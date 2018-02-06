import { BoxGeometry } from '../../lib/threejs/geometries/BoxGeometry';
import { MeshBasicMaterial } from '../../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../../lib/threejs/materials/MeshPhongMaterial';

const singleton = Symbol();
const singletonEnforcer = Symbol()

class CandleMeshProperties {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
        
        this.geometry = new BoxGeometry(50, 50, 16);
        
        this.basicMaterial = new MeshBasicMaterial( { color: 0xf26868 } );
        
        this.lambertMaterial = new MeshLambertMaterial( { color: 0xf26868 } );
        
        this.phongMaterial = new MeshPhongMaterial( { color: 0xf26868 } );
        
        this.material = this.basicMaterial;
        
    }
    
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new CandleMeshProperties(singletonEnforcer);
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

export default CandleMeshProperties