import { SphereGeometry } from '../../lib/threejs/geometries/SphereGeometry';
import { MeshBasicMaterial } from '../../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../../lib/threejs/materials/MeshPhongMaterial';

const singleton = Symbol();
const singletonEnforcer = Symbol()

class OrangeMeshProperties {

    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
        
        this.geometry = new SphereGeometry(50, 10, 10);
        
        this.basicMaterial = new MeshBasicMaterial( { color: 0xff9203 } );

        this.lambertMaterial = new MeshLambertMaterial( { color: 0xff9203 } );
        
        this.phongMaterial = new MeshPhongMaterial( { color: 0xff9203 } );

        this.leafBasicMaterial = new MeshBasicMaterial( { color: 0x02b62c } );
        
        this.leafLambertMaterial = new MeshLambertMaterial( { color: 0x02b62c } );
        
        this.leafPhongMaterial = new MeshPhongMaterial( { color: 0x02b62c } );
        
        this.material = this.basicMaterial;
        
        this.leafMaterial = this.leafBasicMaterial; 
        
    }
    
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new OrangeMeshProperties(singletonEnforcer);
        }
        return this[singleton];
    }
    
    changeMaterial(materialID) {
        switch (materialID) {

			case 'Basic':
			    this.material = this.basicMaterial;
			    this.leafMaterial = this.leafBasicMaterial;
			    
			    break;
			    
			case 'Lambert':
			    this.material = this.lambertMaterial;
			    this.leafMaterial = this.leafLambertMaterial;
			    
			    break;
			    
			case 'Phong':
				this.material = this.phongMaterial;
				this.leafMaterial = this.leafPhongMaterial;
				
				break;

			default: break;

		}
    }
    
}

export default OrangeMeshProperties