import { BoxGeometry } from '../../lib/threejs/geometries/BoxGeometry';
import { MeshBasicMaterial } from '../../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../../lib/threejs/materials/MeshPhongMaterial';

const singleton = Symbol();
const singletonEnforcer = Symbol()

class ButterPacketMeshProperties {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
        
        this.geometry = new BoxGeometry(50, 50, 16);
        
        this.basicMaterial = new MeshBasicMaterial( { color: 0xffdf6a } );
        
        this.lambertMaterial = new MeshLambertMaterial( { color: 0xffdf6a } );
        
        this.phongMaterial = new MeshPhongMaterial( { color: 0xffdf6a } );
        
        this.material = this.basicMaterial;
        
    }
    
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ButterPacketMeshProperties(singletonEnforcer);
        }
        return this[singleton];
    }
    
    changeMaterial(materialID) {
        switch (materialID) {

			case 'Basic':
			    this.material = this.basicMaterial;
			    
			    break;
			    
			case 'Lambert':
			    this.material = this.lambertMaterial;
			    
			    break;
			    
			case 'Phong':
				this.material = this.phongMaterial;
				
				break;

			default: break;

		}
    }
    
}

export default ButterPacketMeshProperties