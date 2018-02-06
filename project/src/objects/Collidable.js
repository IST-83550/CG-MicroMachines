import { Sphere } from '../lib/threejs/math/Sphere';
import { Box3 } from '../lib/threejs/math/Box3';

import GameObject from './GameObject';

class Collidable extends GameObject {
    
    constructor(x, y, z) {

		super(x, y, z);

		this.type = 'Collidable';

		this.isCollidable = true;
		
		this.updateBoundries = false;

		this.boundingBox = new Box3();
		this.boundingSphere = new Sphere();
	
	}

    /**
     *  Intersect.
     * 
     *  @param other object
     */
	intersect(other) {
		
		if (!this.updateBoundries && !other.updateBoundries)
			return this.intersectSphere(other);
			
		return false;

	}

    /**
     *  Intersect Sphere.
     * 
     *  @param other object
     */
	intersectSphere(other) {
		

		if (this.boundingSphere !== null && other.boundingSphere !== null) {
			
			let dist = this.position.distanceTo( other.position );
			
			let radius1 = this.boundingSphere.radius
			let radius2 = other.boundingSphere.radius
			
			return dist <= radius1 + radius2;

		}

		return false;

	}

    /**
     *  Intersect Box.
     * 
     *  @param other object
     */
	intersectBox (other) {
	
			if (this.boundingBox !== null && other.boundingBox !== null) {
	
				let [ a, b ] = [ this.boundingBox, other.boundingBox ];
	
				return (a.min.x < b.max.x && a.max.x > b.min.x &&
					a.min.y < b.max.y && a.max.y > b.min.y &&
					a.min.z < b.max.z && a.max.z > b.min.z);
	
			}
	
			return false;
	
	}

    /**
     *  Update.
     * 
     */
	update () {
	
			if (this.updateBoundries) {
	
				this.updateBoundries = false;
	
				if (this.boundingBox !== null) {
	
					this.boundingBox.setFromObject(this);
	
					if (this.boundingSphere !== null) {
	
						this.boundingBox.getBoundingSphere(this.boundingSphere);
						this.boundingSphere.radius /= 1.6;
	
					}
				}
		        
			}
	
		}
	
	/**
     *  Handle collision.
     * 
     *  @param other object
     */
	handleCollision(other) {
		return;
	}
    
}

export default Collidable;