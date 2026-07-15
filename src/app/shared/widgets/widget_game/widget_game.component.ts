import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget_game',
  templateUrl: './widget_game.component.html',
  styleUrls: ['./widget_game.component.scss'],
  standalone: false
})
export class Widget_gameComponent implements OnInit {

  boxPosition = { top: '50%', left: '50%' };
  gameStarted = false;
  gameEnded = false;
  timer = 60;
  score = 0;
  intervalId: any;
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.startGame();
  }
  startGame() {
    this.gameStarted = true;
    this.timer = 60;
    this.score = 0;
    this.gameEnded = false;
    this.moveBoxRandomly();

    this.intervalId = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        this.gameEnded = true;
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  onMouseEnterBox() {
    if (!this.gameEnded) {
      this.score++;
      this.moveBoxRandomly();
      // this.cdr.detectChanges();

    }
  }

  moveBoxRandomly() {
    const top = Math.random() * 90;
    const left = Math.random() * 90;
    this.boxPosition = {
      top: `${top}%`,
      left: `${left}%`,
    };
    this.cdr.detectChanges();

  }

  onLogout() {
    // this.auth.onLogout();
  }

}
