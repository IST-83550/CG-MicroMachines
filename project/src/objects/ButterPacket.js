import { Mesh } from '../lib/threejs/objects/Mesh';

import Collidable from './Collidable';
import ButterPacketMeshProperties from './MeshProperties/ButterPacketMeshProperties';

const butterpacket_mesh = ButterPacketMeshProperties.instance;

class ButterPacket extends Collidable {

    constructor(x, y, z) {
    
		super(x, y, z);

		this.type = 'ButterPacket';
		
		this.geometry = butterpacket_mesh.geometry;
	
		this.material = butterpacket_mesh.basicMaterial;
		
		this.updateBoundries = true;
		
		this.mesh = new Mesh(this.geometry, this.material);
		
        this.add(this.mesh);
        
    }
    
    /**
     *  Update.
     * 
     *  @param time delta
     */
	update(dt) {
		super.update();
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

			default: break;

		}
    }
    
    changeMaterial(materialID) {

    	this.mesh.material = butterpacket_mesh.material;
    	
    }
}

export default ButterPacket;