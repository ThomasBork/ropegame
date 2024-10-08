import { GameObject } from './game-object';
import { GameObjectType } from './game-object-type';
import { Vector2 } from './vector2';

export class GameObjectPlayer extends GameObject {
    public userMovement: Vector2;
    public isOnSurface: boolean;
    public constructor(
        id: number,
        position: Vector2,
        velocity: Vector2,
        size: Vector2,
        blocksMovement: boolean
    ) {
        super(id, GameObjectType.player, position, velocity, size, blocksMovement, true);
        this.userMovement = new Vector2(0, 0);
        this.isOnSurface = false;
    }
}