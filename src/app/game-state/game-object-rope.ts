import { GameObject } from './game-object';
import { GameObjectType } from './game-object-type';
import { Vector2 } from './vector2';

export class GameObjectRope extends GameObject {
    public constructor(
        id: number,
        position: Vector2,
        velocity: Vector2,
        size: Vector2,
        blocksMovement: boolean
    ) {
        super(id, GameObjectType.ropePart, position, velocity, size, blocksMovement, false);
    }
}