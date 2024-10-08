import { GameObjectType } from './game-object-type';
import { Vector2 } from './vector2';

export class GameObject {
  id: number;
  type: GameObjectType;
  position: Vector2;
  velocity: Vector2;
  size: Vector2;
  blocksMovement: boolean;
  isAffectedByDrag: boolean;
  public constructor(
     id: number,
     type: GameObjectType,
     position: Vector2,
     velocity: Vector2,
     size: Vector2,
     blocksMovement: boolean,
     isAffectedByDrag: boolean
  ) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.blocksMovement = blocksMovement;
    this.isAffectedByDrag = isAffectedByDrag;
  }

  
  public getMinX(): number {
    return this.position.x - this.size.x / 2;
  }
  public getMaxX(): number {
    return this.position.x + this.size.x / 2;
  }
  public getMinY(): number {
    return this.position.y - this.size.y / 2;
  }
  public getMaxY(): number {
    return this.position.y + this.size.y / 2;
  }
}
