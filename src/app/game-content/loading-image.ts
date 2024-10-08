export class LoadingImage {
  public image: HTMLImageElement;
  public isLoaded: boolean;
  public constructor(
    src: string
  ) {
    this.image = new Image();
    this.isLoaded = false;
    this.image.onload = () => this.isLoaded = true;
    this.image.src = src;
  }
}
