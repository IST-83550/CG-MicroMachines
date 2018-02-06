import { Mesh } from '../lib/threejs/objects/Mesh';
import { Vector3 } from '../lib/threejs/math/Vector3';

import DynamicObject from './DynamicObject';
import OrangeMeshProperties from './MeshProperties/OrangeMeshProperties';
import OrangeLeaf from './OrangeLeaf';

const orange_mesh = OrangeMeshProperties.instance;

class Orange extends DynamicObject {

    constructor(game_time) {
        
        let [x, y] = [Math.floor(Math.random() * 949) - 449,
                    Math.floor(Math.random() * 949) - 449];
    
		super(x, y, 50);

		this.type = 'Orange';
		
		this.geometry = orange_mesh.geometry;
		
		this.material = orange_mesh.material;
		this.leafMaterial = orange_mesh.leafMaterial;
		
		this.orange = new Mesh(this.geometry, this.material);
		this.orangeLeaf = new OrangeLeaf(0, 0, 0, this.leafMaterial);
		
		this.add( this.orange, this.orangeLeaf );
        
        this.isMoving = true;
        
        this.direction = (function(self) {

			let [ x, y ] = [ Math.random(), Math.random()];

			return new Vector3( - x * self.position.x, - y * self.position.y, 0 ).normalize();

        }( this ));
        
        this.MAX_VELOCITY = 500;
        
        this.velocity = (function(self) {
            
            let vel = game_time + 25;
            
            if (vel >= self.MAX_VELOCITY)
                vel = self.MAX_VELOCITY;

			return vel;
			
        }( this ));
        
        this.isInBoard = true;
        
        this.axis = new Vector3();
        this.setAxis();
        
    }
    
    setAxis() {
        this.axis.set( this.direction.x, this.direction.y, 0 ).normalize();
        this.axis.cross(new Vector3(0, 0, 1));
    }
    
    /**
     *  Update.
     * 
     *  @param time delta
     */
    update(dt) {
        
        this.rotateOnAxis(this.axis, - Math.PI / 90 * this.velocity * dt);
        
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
			    
			    if (!other.invulnerable) {
			        other.boundingBox.translate(new Vector3( - other.position.x, - other.position.y, 0));
    			    other.boundingSphere.translate(new Vector3( - other.position.x, - other.position.y, 0));
    			    other.position.x = 0;
    			    other.position.y = 0;
    			    
    			    other.velocity = 0;
    			    
    			    other.removeLife();
			    }
			    
			    break;
			    
			case 'TableLimit':
				other.handleCollision(this);
				
				break;

			default: break;

		}
	}
	
    changeMaterial(materialID) {
		
		this.orange.material = orange_mesh.material;
		this.orangeLeaf.material = orange_mesh.leafMaterial;
		
    }
    
}

export default Orange;