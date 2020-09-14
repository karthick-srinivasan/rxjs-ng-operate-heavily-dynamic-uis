import { Component } from '@angular/core';
import { interval, merge, NEVER, Observable, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { mapTo, scan, startWith, switchMap, withLatestFrom, map } from 'rxjs/operators';

interface CounterState {
  isTicking: boolean;
  count: number;
  countUp: boolean;
  tickSpeed: number;
  countDiff: number;
}

enum ElementIds {
  TimerDisplay = 'timer-display',
  BtnStart = 'btn-start',
  BtnPause = 'btn-pause',
  BtnUp = 'btn-up',
  BtnDown = 'btn-down',
  BtnReset = 'btn-reset',
  BtnSetTo = 'btn-set-to',
  InputSetTo = 'input-set-to',
  InputTickSpeed = 'input-tick-speed',
  InputCountDiff = 'input-count-diff'
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  elementIds = ElementIds;

  initialCounterState: CounterState = {
    isTicking: false,
    count: 0,
    countUp: true,
    tickSpeed: 200,
    countDiff: 1
  };

  btnStart: Subject<Event> = new Subject<Event>();
  btnPause: Subject<Event> = new Subject<Event>();
  btnSetTo: Subject<Event> = new Subject<Event>();
  btnReset: Subject<Event> = new Subject<Event>();
  inputSetTo: Subject<Event> = new Subject<Event>();
  tickSpeed: Subject<number> = new Subject<number>();
  direction = new BehaviorSubject<boolean>(true);
  count$: Observable<number>;

  constructor() {
    /* Replace never with your code */
    const interval$ = this.tickSpeed.pipe(
      startWith(this.initialCounterState.tickSpeed),
      switchMap(value => interval(value))
    );

    const btnPause$ = this.btnPause.pipe(
      mapTo(false)
    );

    const btnStart$ = this.btnStart.pipe(
      mapTo(true)
    );

    const play$ = merge(btnStart$, btnPause$).pipe(
      switchMap(value => !value ? NEVER : interval$)
    );

    const btnSetTo$ = this.btnSetTo.pipe(
      withLatestFrom(this.inputSetTo, (_, givenValue) => +givenValue),
      startWith(0)
    );

    const btnReset$ = this.btnReset.pipe(
      mapTo(0)
    );

    this.count$ = merge(btnSetTo$, btnReset$).pipe(
      switchMap(value => play$.pipe(
        scan(acc => this.direction.value ? ++acc : --acc, value),
        startWith(value)
      ))
    );
  }

  getInputValue = (event: HTMLInputElement): number => {
    return parseInt(event['target'].value, 10);
  }

}
