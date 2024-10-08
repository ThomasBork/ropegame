import { Injectable } from "@angular/core";
import { Vector2 } from "./game-state/vector2";

@Injectable({
  providedIn: 'root'
})
export class VectorService {
  public buildVector(x: number, y: number): Vector2 {
    return {
      x: x,
      y: y,
    };
  }

  public normalizedVector(vector: Vector2): Vector2 {
    const length = this.getLength(vector);
    if (length === 0) {
      throw new Error('Unable to get normalized vector from 0 length');
    }
    return new Vector2(
      vector.x / length,
      vector.y / length
    );
  }

  public multiplyVector(vector: Vector2, multiplier: number): Vector2 {
    return {
      x: vector.x * multiplier,
      y: vector.y * multiplier,
    };
  }

  public addVectors(vectorA: Vector2, vectorB: Vector2): Vector2 {
    return {
      x: vectorA.x + vectorB.x,
      y: vectorA.y + vectorB.y,
    };
  }

  public getLength(vector: Vector2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  public cloneVector(vector: Vector2): Vector2 {
    return {
      x: vector.x,
      y: vector.y,
    };
  }

  public areIdentical(vectorA: Vector2, vectorB: Vector2): boolean {
    return vectorA.x === vectorB.x
      && vectorA.y === vectorB.y;
  }

  public getDistance(vectorA: Vector2, vectorB: Vector2): number {
    const delta: Vector2 = {
      x: vectorA.x - vectorB.x,
      y: vectorA.y - vectorB.y,
    };
    return this.getLength(delta);
  }

  public areSegmentsIntersecting(p1: Vector2, q1: Vector2, p2: Vector2, q2: Vector2): boolean {
    const onSegment = (p: Vector2, q: Vector2, r: Vector2): boolean =>
    { 
        if (
          q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) 
          && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
        ) {
          return true; 
        }
        
        return false; 
    };

    const orientation = (p: Vector2, q: Vector2, r: Vector2): number => {
      const val = (q.y - p.y) * (r.x - q.x) 
        - (q.x - p.x) * (r.y - q.y); 

      if (val == 0) return 0; // collinear 

      return (val > 0) ? 1 : 2; // clock or counterclock wise 
    };

    // Find the four orientations needed for general and 
    // special cases 
    const o1 = orientation(p1, q1, p2); 
    const o2 = orientation(p1, q1, q2); 
    const o3 = orientation(p2, q2, p1); 
    const o4 = orientation(p2, q2, q1); 
    
    // General case 
    if (o1 != o2 && o3 != o4) 
        return true; 
    
    // Special Cases 
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1 
    if (o1 == 0 && onSegment(p1, p2, q1)) return true; 
    
    // p1, q1 and q2 are collinear and q2 lies on segment p1q1 
    if (o2 == 0 && onSegment(p1, q2, q1)) return true; 
    
    // p2, q2 and p1 are collinear and p1 lies on segment p2q2 
    if (o3 == 0 && onSegment(p2, p1, q2)) return true; 
    
    // p2, q2 and q1 are collinear and q1 lies on segment p2q2 
    if (o4 == 0 && onSegment(p2, q1, q2)) return true; 
    
    return false; // Doesn't fall in any of the above cases 
  }
}
