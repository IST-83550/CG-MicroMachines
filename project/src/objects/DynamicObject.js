import { Vector3 } from '../lib/threejs/math/Vector3';

import Collidable from './Collidable';

class DynamicObject extends Collidable {

    constructor(x, y, z) {
    
		super(x, y, z);

		this.isDynamic = true;
		
		this.direction = new Vector3();
		
		this.velocity =  0;
		
		this.isMoving = false;
		
		this.updateBoundries = true;
        
    }
    
	/**
     *  Set Direction.
     * 
     *  @param x
     *  @param y
     *  @param z
     */
	setDirection(x, y, z) {
		
		this.direction.set(x, y, z).normalize();
    }
   
	/**
     *  Update.
     * 
     *  @param dt 
     * 
     */
	update(dt) {
	    
	    let direction = this.direction.clone();
	    let velocity  = this.velocity;
	   
	    if (this.isMoving) {
	    	
	    	/* Update position. */
	    	let ds = direction.multiplyScalar(this.velocity);
    		this.position.add(ds.multiplyScalar(dt));
    		
    		/* Translate bounding objects. */
    		this.boundingBox.translate(ds);
			this.boundingSphere.translate(ds);
	    	
	    }
	    
	    super.update()
	    
	}
	
    /**
     *  Intersect.
     * 
     *  @param other object
     */
	intersect(other) {	
		return super.intersect(other);
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

export default DynamicObject;