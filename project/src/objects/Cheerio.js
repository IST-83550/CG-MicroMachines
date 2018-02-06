import { Vector3 } from '../lib/threejs/math/Vector3';
import { Mesh } from '../lib/threejs/objects/Mesh';

import DynamicObject from './DynamicObject';
import CheerioMeshProperties from './MeshProperties/CheerioMeshProperties';

const cheerio_mesh = CheerioMeshProperties.instance;

class Cheerio extends DynamicObject {

    constructor(x, y, z) {
    
		super(x, y, z);

		this.type = 'Cheerio';
		
		this.geometry = cheerio_mesh.geometry;
		
		this.material = cheerio_mesh.basicMaterial;
		
		this.friction = 500;
		
		this.mesh = new Mesh(this.geometry, this.material);
		
        this.add(this.mesh);
    }
    
	/**
     *  Update.
     * 
     *  @param time delta
     */
    update(dt) {
    	
    	this.isMoving = false;
    	
    	let velocity = this.velocity;
    	let friction = this.friction;
    	
    	/* Apply friction. */
	    if (velocity > 0) {
	    	
	    	this.isMoving = true;
	    	
	    	let df = -friction * dt;
	    	
	    	if (velocity + df < 0){
    			this.velocity = 0;
    		}
    		else {
    			this.velocity += df;
    		}    	
	    	
	    }
	    
	    else if (velocity < 0) {
	    	this.isMoving = true;
	    	
	    	let df = friction * dt;
	    	
	    	if (velocity + df > 0){
    			this.velocity = 0;
    		}
    		else {
    			this.velocity += df;
    		}  
	    }

        super.update(dt);
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
		switch (other.type) {
			
			case 'PlayerCar':
				other.handleCollision(this);
				break;
				
			case 'Cheerio':
				
				
				if (other.isMoving) {
					
					var direction = new Vector3(other.boundingSphere.center.x - this.boundingSphere.center.x, other.boundingSphere.center.y - this.boundingSphere.center.y, 0).normalize();
					var dist = this.position.distanceTo( other.position );
					var distThis = Math.abs( dist - this.boundingSphere.radius );
					var distOther = Math.abs( dist - other.boundingSphere.radius );
					var offset = new Vector3();
					
					offset.copy(direction).multiplyScalar(dist - (distThis + distOther));
					
					other.position.add(offset);
					other.boundingBox.translate(offset);
					other.boundingSphere.translate(offset);

				    this.isMoving  =  true;
				    this.direction =  other.direction.clone();
    			    this.velocity  =  other.velocity;
    			    other.velocity *= 0.85;
    			    
				}
				
				else if (this.isMoving) {
					other.handleCollision(this);
				}
				
				break;
				
			default: break;

		}
	}
	
	changeMaterial(materialID) {

    	this.mesh.material = cheerio_mesh.material;
	}
}

export default Cheerio;