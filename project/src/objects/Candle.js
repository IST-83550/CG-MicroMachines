import { Mesh } from '../lib/threejs/objects/Mesh';
import { CylinderGeometry } from '../lib/threejs/geometries/CylinderGeometry';

import GameObject from './GameObject';
import CandleMeshProperties from './MeshProperties/CandleMeshProperties';

const candle_mesh = CandleMeshProperties.instance;

class Candle extends GameObject {

    constructor(x, y, z) {
    
		super(x, y, z);

		this.type = 'Candle';
		
		this.geometry = new CylinderGeometry(20, 20, 10, 10);
		this.geometry2 = new CylinderGeometry(1, 1, 8, 4);
	
		this.material = candle_mesh.basicMaterial;
		
		this.main = new Mesh(this.geometry, this.material);
		this.acessory = new Mesh(this.geometry2, this.material);
		
		this.acessory.position.set(0, 9, 0);
		
		this.main.add(this.acessory);
		this.add(this.main);
        
    }
    
    changeMaterial(materialID) {
    	
        switch (materialID) {

			case 'Basic':
			    this.main.material = candle_mesh.basicMaterial;
			    this.acessory.material = candle_mesh.basicMaterial;
			    break;
			    
			case 'Lambert':
			    this.main.material = candle_mesh.lambertMaterial;
			    this.acessory.material = candle_mesh.lambertMaterial;
			    break;
			    
			case 'Phong':
				this.main.material = candle_mesh.phongMaterial;
				this.acessory.material = candle_mesh.phongMaterial;
				break;

			default: break;

		}
    }

}

export default Candle;