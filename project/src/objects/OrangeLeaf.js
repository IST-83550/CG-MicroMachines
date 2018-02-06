import { Mesh } from '../lib/threejs/objects/Mesh';
import { TorusGeometry } from '../lib/threejs/geometries/TorusGeometry';

class OrangeLeaf extends Mesh {
    
    constructor(x, y, z, material) {
    
		super();
		
		this.geometry = new TorusGeometry(50, 2, 4, 4, 0.4);
		
		this.material = material;
		
		this.position.set(x, y, z);
		
    }
}

export default OrangeLeaf;