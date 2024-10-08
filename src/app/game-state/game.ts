import { GameObject } from './game-object';
import { GameObjectPlayer } from './game-object-player';
import { GameObjectType } from './game-object-type';
import { Vector2 } from './vector2';

export class Game {
  gameObjects: GameObject[];
  nextGameObjectId: number;
  player: GameObjectPlayer;
  public constructor() {
    this.nextGameObjectId = 1;
    this.player = new GameObjectPlayer(
      this.nextGameObjectId++,
      new Vector2(0, 0),
      new Vector2(0, 0),
      new Vector2(100, 100),
      true
    )
    this.gameObjects = [this.player, ...this.buildWorld()];
  }

  private buildWorld(): GameObject[] {
    let objects: GameObject[] = [];
    let minLeft = -1000;
    let wallWidth = 50;
    let wallHeight = 50;
    let maxTop = 200;
    for (let x = 0; x<50; x++) {
      objects.push(
        new GameObject(
          this.nextGameObjectId++,
          GameObjectType.wall,
          new Vector2(minLeft + x * wallWidth, maxTop),
          new Vector2(0, 0),
          new Vector2(wallWidth, wallHeight),
          true,
          false
        )
      )
    }
    for (let x = 0; x<50; x++) {
      objects.push(
        new GameObject(
          this.nextGameObjectId++,
          GameObjectType.wall,
          new Vector2(minLeft + x * wallWidth, maxTop - wallHeight * 8),
          new Vector2(0, 0),
          new Vector2(wallWidth, wallHeight),
          true,
          false
        )
      )
    }
    objects.push(
      new GameObject(
        this.nextGameObjectId++,
        GameObjectType.wall,
        new Vector2(0 - wallWidth * 3, maxTop - wallHeight * 2),
        new Vector2(0, 0),
        new Vector2(wallWidth, wallHeight),
        true,
        false
      )
    )
    objects.push(
      new GameObject(
        this.nextGameObjectId++,
        GameObjectType.wall,
        new Vector2(0 - wallWidth * 6, maxTop - wallHeight * 4),
        new Vector2(0, 0),
        new Vector2(wallWidth, wallHeight),
        true,
        false
      )
    )
    return objects;
  }
}
