import { Injectable } from "@angular/core";
import { Game } from "../game-state/game";
import { GameObject } from "../game-state/game-object";
import { GameObjectPlayer } from "../game-state/game-object-player";
import { KeyboardService } from "../keyboard.service";

@Injectable({
    providedIn: 'root'
})
export class GameUpdaterService {
    private timeout?: NodeJS.Timer;
    private millisecondsBetweenEachTick: number = 50;
    private game!: Game;
    private GRAVITY = 100;
    private DRAG_FACTOR = 0.9;
    private MAX_COLLISION_CHECKS = 5;
    private JUMP_FORCE = 1000;
    public constructor(
        private keyboardService: KeyboardService
    ) {
    }

    public attachGame(game: Game): void {
        this.game = game;
        this.timeout = setInterval(
            () => {
                this.update(this.millisecondsBetweenEachTick)
            }, 
            this.millisecondsBetweenEachTick
        );
    }

    private update(deltaTimeInMilliseconds: number): void {
        this.handlePlayerInput(this.game.player);

        const deltaTimeInSeconds = deltaTimeInMilliseconds / 1000;
        this.applyGravity(this.game.player, deltaTimeInSeconds);
        for (let gameObject of this.game.gameObjects) {
            if (gameObject.isAffectedByDrag) {
                this.applyDrag(gameObject, deltaTimeInSeconds);
            }
        }
        for (let gameObject of this.game.gameObjects) {
            this.applyVelocity(gameObject, deltaTimeInSeconds);
        }
        this.applyUserMovement(this.game.player, deltaTimeInSeconds);
        this.handleCollisionsForPlayer(this.game.player);
    }

    private applyGravity(gameObject: GameObject, deltaTime: number): void {
        gameObject.velocity.y += this.GRAVITY; 
    }

    private applyDrag(gameObject: GameObject, deltaTime: number): void {
        gameObject.velocity.y *= this.DRAG_FACTOR; 
        gameObject.velocity.x *= this.DRAG_FACTOR; 
    }

    private applyVelocity(gameObject: GameObject, deltaTime: number): void {
        gameObject.position.y += gameObject.velocity.y * deltaTime;
        gameObject.position.x += gameObject.velocity.x * deltaTime;
    }

    private applyUserMovement(player: GameObjectPlayer, deltaTime: number): void {
        player.position.y += player.userMovement.y * deltaTime;
        player.position.x += player.userMovement.x * deltaTime;
    }

    private handleCollisionsForPlayer(player: GameObjectPlayer): void {
        player.isOnSurface = false;
        let collidingObjects = this.getCollidingObjects(player);
        let maxCollisionChecksRemaining = this.MAX_COLLISION_CHECKS;
        while(collidingObjects.length > 0 && maxCollisionChecksRemaining > 0) {
            const mostOverlappingObject = collidingObjects.reduce((a, b) => {
                const aOverlap = this.calculateDistanceOverlappedOnXAxisPlusYAxis(player, a);
                const bOverlap = this.calculateDistanceOverlappedOnXAxisPlusYAxis(player, b);
                if (aOverlap > bOverlap) {
                    return a;
                }
                return b;
            });
            const xOverlap = this.calculateDistanceOverlappedOnXAxis(player, mostOverlappingObject);
            const yOverlap = this.calculateDistanceOverlappedOnYAxis(player, mostOverlappingObject);
            if (xOverlap < yOverlap) {
                player.velocity.x = 0;
                if (player.position.x < mostOverlappingObject.position.x) {
                    player.position.x -= xOverlap;
                } else {
                    player.position.x += xOverlap;
                }
            } else {
                player.velocity.y = 0;
                if (player.position.y < mostOverlappingObject.position.y) {
                    player.position.y -= yOverlap;
                    player.isOnSurface = true;
                } else {
                    player.position.y += yOverlap;
                }
            }
            collidingObjects = this.getCollidingObjects(player);
            maxCollisionChecksRemaining--;
        }
    }

    private getCollidingObjects(gameObject: GameObject): GameObject[] {
        return this.game.gameObjects.filter(o => 
            o !== gameObject 
            && this.areObjectsIntersecting(o, gameObject)
        );
    }

    private areObjectsIntersecting(objectA: GameObject, objectB: GameObject): boolean {
        const isOverlappingOnXAxis = this.calculateDistanceOverlappedOnXAxis(objectA, objectB) > 0;
        const isOverlappingOnYAxis = this.calculateDistanceOverlappedOnYAxis(objectA, objectB) > 0;
    
        return isOverlappingOnXAxis && isOverlappingOnYAxis;
    }

    private calculateDistanceOverlappedOnXAxis(objectA: GameObject, objectB: GameObject): number {
        const posDeltaX = Math.abs(objectA.position.x - objectB.position.x);
        const bothHalfWidths = objectA.size.x / 2 + objectB.size.x / 2;
        return bothHalfWidths - posDeltaX;
    }

    private calculateDistanceOverlappedOnYAxis(objectA: GameObject, objectB: GameObject): number {
        const posDeltaY = Math.abs(objectA.position.y - objectB.position.y);
        const bothHalfHeights = objectA.size.y / 2 + objectB.size.y / 2;
        return bothHalfHeights - posDeltaY;
    }

    private calculateDistanceOverlappedOnXAxisPlusYAxis(objectA: GameObject, objectB: GameObject): number {
        return this.calculateDistanceOverlappedOnXAxis(objectA, objectB)
            + this.calculateDistanceOverlappedOnYAxis(objectA, objectB);
    }
    
    private handlePlayerInput(player: GameObjectPlayer): void {
        const attemptToJump = this.keyboardService.isButtonPressed('w') || this.keyboardService.isButtonPressed('ArrowUp');
        if (attemptToJump) {
            if (player.isOnSurface) {
                player.velocity.y -= this.JUMP_FORCE;
            }
        }
    }
}
