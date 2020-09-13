import { Component } from '@angular/core';
import { interval, merge, NEVER, Observable, Subject } from 'rxjs';
import { mapTo, switchMap, scan, startWith, tap } from 'rxjs/operators';

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

// interface ViewModel {
//   count: number;
// }

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
  inputSetTo: Subject<Event> = new Subject<Event>();
  count$: Observable<number>;

  constructor() {
    /* Replace never with your code */
    const interval$ = interval(this.initialCounterState.tickSpeed);
    const btnPause$ = this.btnPause.pipe(
      mapTo(false)
    );
    const btnStart$ = this.btnStart.pipe(
      mapTo(true)
    );
    this.count$ = merge(btnStart$, btnPause$).pipe(
      switchMap(value => !value ? NEVER : interval$),
      scan(acc => ++acc, 0)
    );
  }

  getInputValue = (event: HTMLInputElement): number => {
    return parseInt(event['target'].value, 10);
  }

}
