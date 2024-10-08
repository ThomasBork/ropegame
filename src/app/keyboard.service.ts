import { Injectable } from '@angular/core';
import { Vector2 } from './game-state/vector2';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private movementKeys: string[];
  private buttonsPressed: Map<string, boolean>;
  private currentMovementDirection: Vector2;
  private MOVEMENT_SPEED = 300;
  public constructor() { 
    this.buttonsPressed = new Map<string, boolean>();
    this.movementKeys = ['a', 's', 'd', 'w', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
    this.currentMovementDirection = {
      x: 0,
      y: 0,
    };
  }

  public setButtonDown(keyCode: string): void {
    this.buttonsPressed.set(keyCode, true);
    this.updateMovementDirection();
  }

  public setButtonUp(keyCode: string): void {
    this.buttonsPressed.set(keyCode, false);
    this.updateMovementDirection();
  }

  public isButtonPressed(keyCode: string): boolean {
    if (!this.buttonsPressed.has(keyCode)) {
      return false;
    }
    return this.buttonsPressed.get(keyCode) === true;
  }

  public getMovementKeys(): string[] {
    return this.movementKeys;
  }

  public getMovementDirection(): Vector2 {
    return this.currentMovementDirection;
  }

  private updateMovementDirection(): void {
    let x = 0;
    let y = 0;
    if (this.isButtonPressed('a') || this.isButtonPressed('ArrowLeft')) {
      x -= this.MOVEMENT_SPEED;
    }
    if (this.isButtonPressed('d') || this.isButtonPressed('ArrowRight')) {
      x += this.MOVEMENT_SPEED;
    }
    if (this.isButtonPressed('w') || this.isButtonPressed('ArrowUp')) {
      //y -= 1;
    }
    if (this.isButtonPressed('s') || this.isButtonPressed('ArrowDown')) {
      //y += 1;
    }
    this.currentMovementDirection = {
      x: x,
      y: y,
    };
  }
}
