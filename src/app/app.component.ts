import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameContentComponent } from './game-content/game-content.component';
import { Game } from './game-state/game';
import { GameUpdaterService } from './game-logic/game-updater-service';
import { KeyboardService } from './keyboard.service';
import { GameObjectRope } from './game-state/game-object-rope';
import { VectorService } from './vector.service';
import { Vector2 } from './game-state/vector2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameContentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'RopeGame';
  game?: Game;

  public constructor(
    private keyboardService: KeyboardService,
    private gameUpdaterService: GameUpdaterService,
    private vectorService: VectorService
  ) {

  }

  public ngOnInit(): void {
    this.game = new Game();
    this.gameUpdaterService.attachGame(this.game);
  }

  public handleKeyDown(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    const isButtonPressed = this.keyboardService.isButtonPressed(keyEvent.key);
    if (!isButtonPressed) {
      this.keyboardService.setButtonDown(keyEvent.key);
      console.log((this.keyboardService as any)['buttonsPressed']);
      if (this.keyboardService.getMovementKeys().includes(keyEvent.key)) {
        const userMovement = this.keyboardService.getMovementDirection();
        this.game.player.userMovement = userMovement;
      } else if (keyEvent.key === 'e') {
      } else if (keyEvent.key === 'Escape') {
      }
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    this.keyboardService.setButtonUp(keyEvent.key);
    if (this.keyboardService.getMovementKeys().includes(keyEvent.key)) {
      const userMovement = this.keyboardService.getMovementDirection();
      this.game.player.userMovement = userMovement;
    }
  }

  public handleKeyPress(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
  }

  public handleMouseDown(mouseEvent: MouseEvent): void {
    if (!this.game) {
      return;
    }
    const xRelativeToCenter = mouseEvent.offsetX - 400;
    const yRelativeToCenter = mouseEvent.offsetY - 400;
    if (xRelativeToCenter === 0 && yRelativeToCenter === 0) {
      return;
    }
    const normalizedVector = this.vectorService.normalizedVector(new Vector2(xRelativeToCenter, yRelativeToCenter));
    const spawnDistanceFromPlayer = 50;
    const speed = 1000;
    const spawnOffset = this.vectorService.multiplyVector(normalizedVector, spawnDistanceFromPlayer);
    const position = this.vectorService.addVectors(this.game.player.position, spawnOffset);
    const velocity = this.vectorService.multiplyVector(normalizedVector, speed);
    const rope = new GameObjectRope(
      this.game.nextGameObjectId++,
      position,
      velocity,
      new Vector2(20, 20),
      false
    );
    this.game.gameObjects.push(rope);
  }
}
