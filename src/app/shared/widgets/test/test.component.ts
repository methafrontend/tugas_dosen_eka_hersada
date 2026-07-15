import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-box',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  standalone: false,
})
export class TestComponent implements OnInit {
  boxPosition = { top: '50%', left: '50%' };
  gameStarted = false;
  gameEnded = false;
  timer = 60;
  score = 0;
  intervalId: any;
  constructor() { }

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
    }, 1000);
  }

  onMouseEnterBox() {
    if (!this.gameEnded) {
      this.score++;
      this.moveBoxRandomly();
    }
  }

  moveBoxRandomly() {
    const top = Math.random() * 90;
    const left = Math.random() * 90;
    this.boxPosition = {
      top: `${top}%`,
      left: `${left}%`,
    };
  }

  onLogout() {
    // this.auth.onLogout();
  }
}
