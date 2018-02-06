import { Scene } from '../lib/threejs/scenes/Scene';
import { OrthographicCamera } from '../lib/threejs/cameras/OrthographicCamera';
import { WINDOW_PIXEL_RATIO, WINDOW_WIDTH, WINDOW_HEIGHT, WIDTH, HEIGHT } from '../constants/Constants';
import { Color } from '../lib/threejs/math/Color';

import PlayerCar from '../objects/PlayerCar';

class HUD extends Scene {
    
    constructor(renderer, maxLives) {
        super();
        
        this.renderer = renderer;
        
        this.maxLives = maxLives;
        this.lives = maxLives;
        
        this.cars = new Array();
        
        this.camera = new OrthographicCamera(0, 60 * this.maxLives, 30, -30, -30, 30);
        this.camera.position.set( 0, 0, 1 );
        this.camera.lookAt(this.position);
    }
    
    setVisibility() {
        this.cars.forEach((car, index) => {
            car.visible = index < this.lives;
        });
    }
    
    setup() {

        this.cars = new Array();
        
        for (let i = 0; i < this.maxLives; i++) {
            let car = new PlayerCar( 30 * ( 2 * ( this.maxLives - i ) - 1 ) ,0, 0, undefined);
            
            car.rotateY( - Math.PI / 2 );
            car.rotateX( - Math.PI / 2 );
            
            this.cars.push(car);
            this.add(this.cars[i]);
        }
        
        this.lives = this.maxLives;

    }
    
    update() {
        
        this.setVisibility();
        
        let size = this.renderer.getSize();
		this.renderer.setViewport(size.width - 60 * this.maxLives, 0, 60 * this.maxLives, 60);
        
		this.renderer.render(this, this.camera);
    }
}

export default HUD;