import { TorusGeometry } from '../../lib/threejs/geometries/TorusGeometry';
import { MeshBasicMaterial } from '../../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../../lib/threejs/materials/MeshPhongMaterial';

const singleton = Symbol();
const singletonEnforcer = Symbol()

class CheerioMeshProperties {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";

        this.geometry = new TorusGeometry(6, 2.8, 6, 6);
        
        this.basicMaterial = new MeshBasicMaterial( { color: 0xe6b06d } );
        
        this.lambertMaterial = new MeshLambertMaterial( { color: 0xe6b06d } );
        
        this.phongMaterial = new MeshPhongMaterial( { color: 0xe6b06d } );
        
        this.material = this.basicMaterial;

    }
    
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new CheerioMeshProperties(singletonEnforcer);
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

export default CheerioMeshProperties