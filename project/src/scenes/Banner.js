import { Scene } from '../lib/threejs/scenes/Scene';
import { OrthographicCamera } from '../lib/threejs/cameras/OrthographicCamera';
import { TextureLoader } from '../lib/threejs/loaders/TextureLoader';
import { Mesh } from '../lib/threejs/objects/Mesh';
import { MeshBasicMaterial } from '../lib/threejs/materials/MeshBasicMaterial';
import { PlaneGeometry } from '../lib/threejs/geometries/PlaneGeometry';

import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../constants/Constants';

class Banner extends Scene {
    
    constructor(renderer, width = 1920, height = 1020) {
        
        super();
        
        this.renderer = renderer;
        
        this.width = width;
        this.height = height;
        
        this.camera = (function (self) {
            let camera = new OrthographicCamera(
                self.width / -2, self.width / 2, self.height / 2, self.height / -2, -10, 10);
                
            camera.position.set(0, 0, 1);
            camera.lookAt(self.position);
            
            camera.updateProjectionMatrix();
            
            return camera;
            
        }(this));
        
        this.screens = (function() {
            let screens = new Array();
            let loader = new TextureLoader();
            
            screens.push(loader.load('../src/assets/pause2.png'));
            screens.push(loader.load('../src/assets/over2.png'));
            
            return screens;
            
        }());
        
        this.banner = (function (self) {
            let geometry = new PlaneGeometry(self.width, self.height);
            let material = new MeshBasicMaterial();
            material.transparent = true;
            material.depthTest = false;
            material.depthWrite = false;
            
            let mesh = new Mesh(geometry, material);
            
            return mesh;
        }(this));
        
        this.add(this.banner);
        this.visible = false;
    }
    
    update() {

		this.renderer.setViewport( 0, 0, WINDOW_WIDTH(), WINDOW_HEIGHT() );
		this.renderer.render( this, this.camera );

	}
	
	toggleVisibility (gameOver = false ) {
	    
        this.visible = !this.visible;

		if (this.visible) {

			if (gameOver) {
				this.banner.material.map = this.screens[1];

			} else {
				this.banner.material.map = this.screens[0];

			}
            this.resize();
			this.update();

		}
	}

    
    resize () {

		let ratio = WINDOW_WIDTH() / WINDOW_HEIGHT();

		if ( ratio > ( this.width / this.height ) ) {

			this.camera.left   = ( this.height * ratio ) / -2;
			this.camera.right  = ( this.height * ratio ) /  2;
			this.camera.top    = this.height /  2;
			this.camera.bottom = this.height / -2;

		} else {

			this.camera.left   = this.width / -2;
			this.camera.right  = this.width /  2;
			this.camera.top    = ( this.width / ratio ) /  2;
			this.camera.bottom = ( this.width / ratio ) / -2;

		}

		this.camera.updateProjectionMatrix();

	}
    
}

export default Banner;