import * as THREE from '../lib/threejs/constants';

import { Mesh } from '../lib/threejs/objects/Mesh';
import { Vector3 } from '../lib/threejs/math/Vector3';
import { Face3 } from '../lib/threejs/core/Face3';
import { Geometry } from '../lib/threejs/core/Geometry';
import { PlaneGeometry } from '../lib/threejs/geometries/PlaneGeometry';
import { MeshBasicMaterial } from '../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../lib/threejs/materials/MeshPhongMaterial';
import { TextureLoader } from '../lib/threejs/loaders/TextureLoader';

import GameObject from './GameObject';
import TableLimit from './TableLimit';

class Table extends GameObject {

    constructor(x, y, z, w = 1000, h = 1000, a = 50) {
    
		super(x, y, z);

		this.type = 'Table';
		
		this.width = w;
		this.height = h;
		this.altura = a;
		
		// Right limit
		this.add(new TableLimit(-(w/2 + 50), 0, 0, 100, h + 200, a + 1));
		// Left Limit
		this.add(new TableLimit((w/2 + 50), 0, 0, 100, h + 200, a + 1));
		// Upper limit
		this.add(new TableLimit(0, (h/2 + 50), 0, w + 200, 100, a + 1));
		// Bottom limit
		this.add(new TableLimit(0, -(h/2 + 50), 0, w + 200, 100, a + 1));
		
		this.plane = new PlaneGeometry(w, h, 200, 200);
		
		this.basicMaterial = new MeshBasicMaterial();
		this.lambertMaterial = new MeshLambertMaterial({reflectivity : 0});
		this.phongMaterial = new MeshPhongMaterial({shininess: 0, reflectivity: 0});
		this.material = this.basicMaterial;
		this.materials.push(this.basicMaterial, this.lambertMaterial, this.phongMaterial);
		
		this.mesh = function(self) {

			let vertices = [
				
				new Vector3(  -500, -500, -25 ),
				new Vector3(  -500,  500, -25 ),
				new Vector3(   500, -500, -25 ),
				new Vector3(   500,  500, -25 ),
	
				new Vector3(  -500, -500,  25 ),
				new Vector3(  -500,  500,  25 ),
				new Vector3(   500, -500,  25 ),
				new Vector3(   500,  500,  25 ),

			];

			let faces = [
				
				// Edges.
				new Face3( 6, 4, 0 ),
				new Face3( 0, 2, 6 ),
				
				new Face3( 7, 6, 2 ),
				new Face3( 2, 3, 7 ),
				
				new Face3( 5, 1, 0 ),
				new Face3( 0, 4, 5 ),
				
				new Face3( 5, 7, 3 ),
				new Face3( 3, 1, 5 ),
				
				// Bottom.
				new Face3( 1, 3, 2 ),
				new Face3( 2, 0, 1 )

			];

			let geo = new Geometry();

			geo.vertices = vertices;
			geo.faces = faces;
			geo.computeFaceNormals();

			return new Mesh(geo, self.material);

		}(this);

		this.planeMesh = new Mesh(this.plane, this.material);
	 	this.planeMesh.position.set(0, 0, 25);
	 	
	 	/* Texture. */
	 	let loader = new TextureLoader();
	 	let texture = loader.load('../src/assets/towel1.png');
		
		this.basicMaterial.map = texture;
		this.lambertMaterial.map = texture;
		this.phongMaterial.map = texture;
		
		this.add(this.mesh, this.planeMesh);
		
    }
    
    changeMaterial(materialID) {
    	
        switch (materialID) {

			case 'Basic':
				this.mesh.material = this.basicMaterial;
			    this.planeMesh.material = this.basicMaterial;
			    
			    break;
			    
			case 'Lambert':
				this.mesh.material = this.lambertMaterial;
			    this.planeMesh.material = this.lambertMaterial;
			    
			    break;
			    
			case 'Phong':
				this.mesh.material = this.phongMaterial;
				this.planeMesh.material = this.phongMaterial;
				
				break;

			default: break;

		}
    }
}

export default Table;