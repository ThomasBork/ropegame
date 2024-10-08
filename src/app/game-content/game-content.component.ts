import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadingImage } from './loading-image';
import { Game } from '../game-state/game';
import { GameObject } from '../game-state/game-object';
import { Vector2 } from '../game-state/vector2';

@Component({
  selector: 'app-game-content',
  standalone: true,
  templateUrl: './game-content.component.html',
  styleUrls: ['./game-content.component.scss']
})
export class GameContentComponent implements AfterViewInit, OnDestroy {
  @Input()
  public game!: Game;

  @ViewChild("theCanvas", { static: false }) 
  public canvas?: ElementRef<HTMLCanvasElement>;

  public context?: CanvasRenderingContext2D;

  private images: Map<string, LoadingImage> = new Map();
  private canvases: Map<string, HTMLCanvasElement> = new Map();
  private flippedHorizontallyPostfix: string = '[FLIPPED_HORIZONTALLY]';

  public ngOnDestroy(): void {
    // Tear down update loop
  }
  public ngAfterViewInit(): void {
    if (!this.canvas){
      throw Error("Canvas not found");
    }
    const context = this.canvas.nativeElement.getContext('2d');
    if(!context) {
      throw Error("Context not found");
    }
    this.context = context;
    this.drawGame();
  }

  private drawGame(): void {
    if (!this.context) {
      throw Error("Context not found");
    }

    const canvasHeight = 800;
    const canvasWidth = 800;

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.context.save();

    const centerX = this.game.player.position.x;
    const centerY = this.game.player.position.y;

    const screenMinX = centerX - canvasWidth / 2;
    const screenMaxX = centerX + canvasWidth / 2;
    const screenMinY = centerY - canvasHeight / 2;
    const screenMaxY = centerY + canvasHeight / 2;

    const isOnScreen = (object: GameObject) => {
      return (screenMinX <= object.getMaxX() && object.getMinX() <= screenMaxX) 
        && (screenMinY <= object.getMaxY() && object.getMinY() <= screenMaxY); 
    }

    for (let object of this.game.gameObjects) {
      if (isOnScreen(object)) {
        const drawX = object.getMinX() - screenMinX;
        const drawY = object.getMinY() - screenMinY;
        const imagePath = this.getImagePath(object);
        this.drawImage(this.context, imagePath, drawX, drawY, object.size.x, object.size.y);
      }
    }

    this.context.restore();
    window.requestAnimationFrame(() => this.drawGame());
  }

  private getOrCreateLoadingImage(imagePath: string): LoadingImage {
    let loadingImage = this.images.get(imagePath);
    if (!loadingImage) {
      loadingImage = new LoadingImage(imagePath);
      this.images.set(imagePath, loadingImage);
    }
    return loadingImage;
  }

  private drawImageFlippedHorizontally(context: CanvasRenderingContext2D, imagePath: string, x: number, y: number, width: number, height: number): void {
    const flippedImagePath = imagePath + this.flippedHorizontallyPostfix;
    let flippedCanvas = this.canvases.get(flippedImagePath);
    if (!flippedCanvas) {
      const loadingImage = this.getOrCreateLoadingImage(imagePath);
      if (!loadingImage.isLoaded) {
        return;
      }
      flippedCanvas = document.createElement('canvas');
      const flippedContext = flippedCanvas.getContext('2d');
      if (!flippedContext) {
        throw Error("Could not find 2d context of canvas for flipped image.");
      }
      flippedCanvas.height = height;
      flippedCanvas.width = width;
      flippedContext.scale(-1, 1);
      flippedContext.drawImage(loadingImage.image, 0, 0, -width, height);
      this.canvases.set(flippedImagePath, flippedCanvas);
    }

    context.drawImage(flippedCanvas, x, y, width, height)
  }

  private drawImage(context: CanvasRenderingContext2D, imagePath: string, x: number, y: number, width: number, height: number): void {
    const loadingImage = this.getOrCreateLoadingImage(imagePath);

    if(loadingImage.isLoaded) {
      context.drawImage(loadingImage.image, x, y, width, height)
    }
  }

  private getImagePath(object: GameObject): string {
    return 'assets/images/' + object.type.toString() + '.png';
  }

  private drawCone(
    centerX: number, 
    centerY: number, 
    minimumDistance: number,
    maximumDistance: number,
    spanInRadians: number,
    directionInRadians: number
  ): void {
    if (!this.context) {
      throw Error("Context not found");
    }
    const rightAngle = directionInRadians - spanInRadians / 2;
    const leftAngle = directionInRadians + spanInRadians / 2;
    const innerRightPoint: Vector2 = {
      x: centerX + minimumDistance * Math.cos(rightAngle),
      y: centerY + minimumDistance * Math.sin(rightAngle)
    };
    const outerLeftPoint: Vector2 = {
      x: centerX + maximumDistance * Math.cos(leftAngle),
      y: centerY + maximumDistance * Math.sin(leftAngle)
    };

    this.context.beginPath();
    this.context.moveTo(innerRightPoint.x, innerRightPoint.y);
    this.context.arc(centerX, centerY, minimumDistance, rightAngle, leftAngle, false);
    this.context.lineTo(outerLeftPoint.x, outerLeftPoint.y);
    this.context.arc(centerX, centerY, maximumDistance, leftAngle, rightAngle, true);
    this.context.closePath();
    this.context.stroke();
  }

  private drawDot(vector: Vector2): void {
    if (!this.context) {
      throw Error("Context not found");
    }

    this.context.beginPath();
    this.context.arc(vector.x, vector.y, 5, 0, Math.PI * 2);
    this.context.fill();
  }
}
