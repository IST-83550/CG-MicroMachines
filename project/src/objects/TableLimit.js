import { BoxGeometry } from '../lib/threejs/geometries/BoxGeometry';
import { Vector3 } from '../lib/threejs/math/Vector3';

import Collidable from './Collidable';

class TableLimit extends Collidable {
    
    constructor(x, y, z, w, h, a) {
        
        super(x, y, z);
        
        this.type = 'TableLimit';
        
        this.geometry = new BoxGeometry(w, h, a);
        
        this.boundingSphere = null;
		
		this.updateBoundries = true;
		
    }
    
    /**
     *  Intersect.
     * 
     *  @param other object
     */
    intersect(other) {
		
		return this.intersectBox(other);

	}
    
    /**
     *  Handle collision.
     * 
     *  @param other object
     */
    handleCollision (other) {
        
		switch (other.type) {

			case 'Orange':
				
				if (this.boundingBox.distanceToPoint(other.position) <= 25) {
					other.isInBoard = false;
				}

				break;
				
			case 'PlayerCar':
				
				if (this.boundingBox.distanceToPoint(other.position) == 0) { 
				
					other.boundingBox.translate(new Vector3( - other.position.x, - other.position.y, 0));
				    other.boundingSphere.translate(new Vector3( - other.position.x, - other.position.y, 0));
				    other.position.x = 0;
				    other.position.y = 0;
				    
				    other.velocity = 0;
					
					other.removeLife();
				
				}
				

			default: break;

		}

	}
}

export default TableLimit;