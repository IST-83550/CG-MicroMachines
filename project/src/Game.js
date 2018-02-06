import { WebGLRenderer } from './lib/threejs/renderers/WebGLRenderer';
import { Scene } from './lib/threejs/scenes/Scene';
import { OrthographicCamera } from './lib/threejs/cameras/OrthographicCamera';
import { PerspectiveCamera } from './lib/threejs/cameras/PerspectiveCamera';
import { WINDOW_PIXEL_RATIO, WINDOW_WIDTH, WINDOW_HEIGHT, WIDTH, HEIGHT, MAX_LIVES } from './constants/Constants';
import * as Keyboard from './constants/Keyboard';
import { Clock } from './lib/threejs/core/Clock';
import { Vector3 } from './lib/threejs/math/Vector3';
import { DirectionalLight } from './lib/threejs/lights/DirectionalLight';
import { PointLight } from './lib/threejs/lights/PointLight';

/*OrbitControls. */
//import OrbitControls from './lib/orbitcontrols';

/* Game Objects. */
import Table from './objects/Table';
import Orange from './objects/Orange';
import ButterPacket from './objects/ButterPacket';
import PlayerCar from './objects/PlayerCar';
import Track from './objects/Track';
import Candle from './objects/Candle';

import HUD from './scenes/HUD';
import Banner from './scenes/Banner';

/* Mesh properties. */
import OrangeMeshProperties from './objects/MeshProperties/OrangeMeshProperties';
const orange_mesh = OrangeMeshProperties.instance;

import ButterPacketMeshProperties from './objects/MeshProperties/ButterPacketMeshProperties';
const butterpacket_mesh = ButterPacketMeshProperties.instance;

import CheerioMeshProperties from './objects/MeshProperties/CheerioMeshProperties';
const cheerio_mesh = CheerioMeshProperties.instance;

import CandleMeshProperties from './objects/MeshProperties/CandleMeshProperties';
const candle_mesh = CandleMeshProperties.instance;

class Game {
    
    constructor () {
        
        this.renderer = (function () {
            let renderer = new WebGLRenderer({antialias: true});
            
            renderer.setPixelRatio(WINDOW_PIXEL_RATIO);
            renderer.setSize(WINDOW_WIDTH(), WINDOW_HEIGHT());
            renderer.autoClear = false;
            return renderer;
        })();
        
        this.scene = new Scene();
        
        this.cameras = (function (self) {
            
            let cameras = new Array();
            
            /* Top Ortographic camera. */
            cameras.push(function () {
                let camera = new OrthographicCamera(
                WIDTH / -2, WIDTH / 2, HEIGHT / 2, HEIGHT / -2, 1, 10000);
        
			    camera.position.set(0, 0, 700);
			    camera.lookAt(self.scene.position);
			    
			    camera.updateProjectionMatrix();

			    return camera;
                
            }());
            
            /* Table perspective camera. */
            cameras.push(function () {
                let camera = new PerspectiveCamera(
					75, WINDOW_WIDTH() / WINDOW_HEIGHT(), 1, 1500
				);
                
				camera.position.set( 0, -850, 450);
				camera.lookAt(self.scene.position);

                camera.updateProjectionMatrix();
                
                return camera;
            
            }());
            
            /* Player Car perspective camera. */
            cameras.push(function () {
                let camera = new PerspectiveCamera(
					75, WINDOW_WIDTH() / WINDOW_HEIGHT(), 1, 1500
				);
                
                return camera;
            
            }()); 
            
            return cameras;
    
        }(this));
        this.camera = this.cameras[0];
        
        /* Lights. */
    	this.sun = (function (self) {
    
    	    let sun = new DirectionalLight(0xffffff, 0.8);
    
        	sun.position.set(550, -550, 1000);
        	sun.target = self.scene;

        	return sun;

        })(this);
	    this.scene.add(this.sun);
	    this.sun.visible = true;
	    
		this.candleLights = (function (self, n) {

			let candles = new Array();

			for(let i = 0; i < n; i++) {

				candles.push(new PointLight(0xffffff, 0.5, 1100));

			}

			return candles;

        }(this, 6));
        
        this.gameHUD = new HUD(this.renderer, MAX_LIVES);
        this.gameBanner = new Banner(this.renderer);
        
        this.lightsOff   = true;
        this.shading     = true;
        this.gameOver    = false;
        
        this.gameClock = new Clock();
        this.gameClock.start()
        
        this.gameObjects = new Array();
        
        /* Orbit Controls */
        //const controls = new OrbitControls(this.camera, this.renderer.domElement);
        //controls.enableZoom = true;
        //controls.addEventListener('change', this.render.bind(this));
    
        window.addEventListener('resize',  this.resize.bind(this));
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup',   this.keyUp.bind(this));
        
        document.body.appendChild(this.renderer.domElement);
        
        this.setup();
        
        /* Force first resize. */
        this.resize();
        
        this.updateDisplay();
        
    }
    
    /** 
     *  Setup Scene.
     *  Adds all objects.
     */
    setup () {
        
        /* Table. */
        this.table = new Table(0, 0, -25);
        this.gameObjects.push(this.table);
        this.scene.add(this.table);
        
        /* Table limits. */
        this.table.children.forEach( function (child) {
			if (child.type === 'TableLimit') this.gameObjects.push(child);
		}, this);
        
        /* Player Car. */
        this.playerCar = new PlayerCar(0, 0, 10, this.cameras[2]);
        this.gameObjects.push(this.playerCar);
        this.scene.add(this.playerCar);
        
        /* Track (Cheerios). */
        this.track = new Track(0, 0, 0);
        this.gameObjects.push(...this.track.children);
        this.scene.add(this.track);
        
        /* Butter packets. */
        let butterPacketsInfo = [
        
        				[ new Vector3(  260,  130, 8 ), Math.PI/3   ],
        				[ new Vector3(  150, -150, 8 ), 3*Math.PI/4 ],
        				[ new Vector3( -430, -200, 8 ), 1           ],
        				[ new Vector3( -150,  440, 8 ), Math.PI/8   ],
        				[ new Vector3( -150, -370, 8 ), Math.PI/6   ]
        
        ];
        
        for (let i = 0; i < butterPacketsInfo.length; i++) {
            
            let position = butterPacketsInfo[i][0];
            let rotation = butterPacketsInfo[i][1];
            
            let butterPacketObject = new ButterPacket(position.x, position.y, position.z);
            butterPacketObject.rotation.z = rotation;
            
            this.gameObjects.push(butterPacketObject);
            this.scene.add(butterPacketObject);
            
        }

        /* Candles. */
        let candlesPositions = [
        
        				new Vector3(  180,  220, 5 ),
        				new Vector3( -175,  220, 5 ),
        				new Vector3( -420,  420, 5 ),
        				new Vector3(   10, -70, 5 ),
        				new Vector3(  240, -300, 5 ),
        				new Vector3( -430, -430, 5 )
        
        ];
        
        for (let i = 0; i < this.candleLights.length; i++) {
            
            let candleLight   = this.candleLights[i];
            let position      = candlesPositions[i];
            
            /* Adds candle object to scene. */
            let candleObject = new Candle(position.x, position.y, position.z);
            candleObject.rotation.x = Math.PI / 2;
            this.gameObjects.push(candleObject);
            this.scene.add(candleObject);
            
            /* Candle light setup. */
            candleLight.position.set(position.x, position.y, position.z + 9);

			candleLight.visible = true;
			this.scene.add(candleLight);
        
        }
        
        this.num_oranges = 0;
        this.gameHUD.setup();
        this.renderer.setViewport(0, 0, WINDOW_WIDTH(), WINDOW_HEIGHT());
    }
    
    /**
     *  Update/Display cicle.
     */
    updateDisplay() {
        
        this.renderer.clear();
        
        this.update();
        
        this.display();
        
        window.requestAnimationFrame(this.updateDisplay.bind(this));
    }
    
    /**
     *  Update.
     */
    update() {
        
        
        if (this.gameClock.running) {

            let dt = this.gameClock.getDelta();
            
            if (this.num_oranges < 3) {
                setTimeout(function() {
                    this.orange = new Orange(this.gameClock.elapsedTime);
                    this.gameObjects.push(this.orange);
                }.bind(this), Math.random() * 10000);
                
                this.num_oranges++;
            }
            
            /* Update objects. */
            let obj = undefined;
            let other = undefined;
            
            for (let i = 0; i < this.gameObjects.length; i++) {
                
                obj = this.gameObjects[i];
                
                /* Remove orange. */
                if (obj.type == 'Orange') {
                    if (!obj.isInBoard) {
                        this.gameObjects.splice(i, 1);
                        this.scene.remove(obj);
                        this.num_oranges--;
                        continue;
                    }
                    else if (this.scene.children.indexOf(obj) == -1) {
                        this.scene.add(obj);
                    }
                }
                
                /* Movement. */
                if (obj.isDynamic || (obj.isCollidable && obj.updateBoundries)) {
                    
                    obj.update(dt);
                    
                }
                
                /* Collisions. */
                if (obj.isCollidable) {
                    
                    for (let j = i + 1; j < this.gameObjects.length; j++) {
                    
                        other = this.gameObjects[j];
                        
                        if (other.isCollidable && obj.intersect(other)) {
                            
                            obj.handleCollision(other);
                            
                        } 
                    }
                }
            }
            
            if (this.playerCar.lives < this.gameHUD.lives) {
				this.gameHUD.lives--;
			}
			
			/* Game Over. */
			if (this.playerCar.lives <= 0) {
			    this.gameOver = true;
			    this.gameClock.stop();
			    this.gameBanner.toggleVisibility(true);
			}
    		
        }
        
    }

    /**
     *  Display (Render).
     */
    display() {
        
        this.renderer.setViewport( 0, 0, WINDOW_WIDTH(), WINDOW_HEIGHT() );
		this.renderer.render( this.scene, this.camera );
		
		this.gameHUD.update();
		if (this.gameBanner.visible) this.gameBanner.update();
        
    }
    
    /**
     *  Render.
     */
    render () {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     *  Resize window handler.
     */
    resize () {
        
        this.renderer.setSize(WINDOW_WIDTH(), WINDOW_HEIGHT());
        
        let size = this.renderer.getSize();
        let ratio = size.width / size.height;
        
        if (this.camera.type == 'OrthographicCamera') {
            
            if (ratio > (WIDTH / HEIGHT)) {
    
    			this.camera.left   = (HEIGHT * ratio) /-2;
    			this.camera.right  = (HEIGHT * ratio) / 2;
    			this.camera.top    = HEIGHT /  2;
    			this.camera.bottom = HEIGHT / -2;
    
    		} else {
    
    			this.camera.left   = WIDTH / -2;
    			this.camera.right  = WIDTH /  2;
    			this.camera.top    = (WIDTH / ratio) /  2;
    			this.camera.bottom = (WIDTH / ratio) / -2;

    		}
    		
        } else {
            
            this.camera.aspect = ratio;
            
        }
        if (this.gameBanner.visible) this.gameBanner.resize();
        this.camera.updateProjectionMatrix();
    }
    
    /**
     *  Update materials.
     * 
     * @param material identifier (ID)
     * 
     */
    updateMaterials(materialID) {
        
        cheerio_mesh.changeMaterial(materialID);
        butterpacket_mesh.changeMaterial(materialID);
        orange_mesh.changeMaterial(materialID);
        candle_mesh.changeMaterial(materialID);
        
        for (let i = 0; i < this.gameObjects.length; i++) {
            
            let obj = this.gameObjects[i];
                
                obj.changeMaterial(materialID);
                
            
        }
        
    }
    
    /**
     *  Keyboard KeyDown handler.
     * 
     *  @param key event
     */
    keyDown(event) {
        
        if (this.gameOver) {
            
            if (event.keyCode == Keyboard.KEY_R) {
                
                window.cancelAnimationFrame(this.updateDisplay.bind(this));
                document.body.removeChild(this.renderer.domElement);
                this.renderer.domElement = null;
                this.scene = null;
                orange_mesh.material = orange_mesh.basicMaterial;
    	    	orange_mesh.leafMaterial = orange_mesh.leafBasicMaterial;
    	    	
                new Game();
                
            }
            else return;
        }

        switch (event.keyCode) {
            
            /* Toggle Wireframe. */
            case Keyboard.KEY_A:
                
		    	this.table.toggleWireframe();
		    	this.playerCar.toggleWireframe();

		    	/* Basic material toggle */
		    	orange_mesh.basicMaterial.wireframe = !orange_mesh.basicMaterial.wireframe;
		    	orange_mesh.leafBasicMaterial.wireframe = !orange_mesh.leafBasicMaterial.wireframe;
		        butterpacket_mesh.basicMaterial.wireframe = !butterpacket_mesh.basicMaterial.wireframe;
		        cheerio_mesh.basicMaterial.wireframe = !cheerio_mesh.basicMaterial.wireframe;
		        candle_mesh.basicMaterial.wireframe = !candle_mesh.basicMaterial.wireframe;
		        
		        /* Lambert material */
		        orange_mesh.lambertMaterial.wireframe = !orange_mesh.lambertMaterial.wireframe;
		    	orange_mesh.leafLambertMaterial.wireframe = !orange_mesh.leafLambertMaterial.wireframe;
		        butterpacket_mesh.lambertMaterial.wireframe = !butterpacket_mesh.lambertMaterial.wireframe;
		        cheerio_mesh.lambertMaterial.wireframe = !cheerio_mesh.lambertMaterial.wireframe;
		        candle_mesh.lambertMaterial.wireframe = !candle_mesh.lambertMaterial.wireframe;
		        
		        /* Phong material */
		        orange_mesh.phongMaterial.wireframe = !orange_mesh.phongMaterial.wireframe;
		    	orange_mesh.leafPhongMaterial.wireframe = !orange_mesh.leafPhongMaterial.wireframe;
		        butterpacket_mesh.phongMaterial.wireframe = !butterpacket_mesh.phongMaterial.wireframe;
		        cheerio_mesh.phongMaterial.wireframe = !cheerio_mesh.phongMaterial.wireframe;
		        candle_mesh.phongMaterial.wireframe = !candle_mesh.phongMaterial.wireframe;

			    break;
			    
            /* Car speed up button. */
            case Keyboard.KEY_UP:
                
                if (!this.playerCar.isAccelerating) {
                    
                    this.playerCar.isAccelerating = true;
                }
		
			    break;

            /* Car braking button. */
            case Keyboard.KEY_DOWN:
                    
                this.playerCar.isBraking = true;
		
			    break;

            /* Car turn right button. */
            case Keyboard.KEY_RIGHT:
                    
                this.playerCar.isTurningRight = true;
		
			    break;

            /* Car turn left button. */
            case Keyboard.KEY_LEFT:

                this.playerCar.isTurningLeft = true;
		
			    break;
			    
            /* Switch to ortogonal camera. */
            case Keyboard.KEY_1:
                    
                    this.camera = this.cameras[0];
                    this.resize();
    	
    		    break;
    		    
            /* Switch to fixed perspective camera. */
            case Keyboard.KEY_2:
                    
                    this.camera = this.cameras[1];
                    this.resize();
    	
    		    break;
    		    
            /* Switch to dynamic perspective camera (player car camera). */
            case Keyboard.KEY_3:
                    
                this.camera = this.cameras[2];
                this.resize();
    	
    		    break;
    		    
            /* Toggle light calculations. */
			case Keyboard.KEY_L:
		
		        this.lightsOff = !this.lightsOff;
		
				if (this.lightsOff) {
				    
				    this.updateMaterials('Basic');
				    
				} else {
				    
				    if (this.shading) {
    				    this.updateMaterials('Lambert');
    				}
    				else {
    				    this.updateMaterials('Phong');
    				}
				}

                break;
    		    
            /* Toggle candles lights. */
    		case Keyboard.KEY_C:
    		    
    		    this.candleLights.forEach((candle) => candle.visible = !candle.visible);
    		    
    		    break;
            
      		/* Toggle day/night. */
			case Keyboard.KEY_N:
			    
                this.sun.visible = !this.sun.visible;
                
                break;
                
			/* Toggle between Gouraud (Lambert) and Phong. */
			case Keyboard.KEY_G:
			    
                if (!this.lightsOff) {
    				this.shading = !this.shading;
    				
    				if (this.shading) {
    				    this.updateMaterials('Lambert');
    				}
    				else {
    				    this.updateMaterials('Phong');
    				}
                }

                break;
                
      		/* Toggle Car Spotlight (headlights). */
			case Keyboard.KEY_H:
			    
                this.playerCar.toggleHeadlights();
                
                break;
                
      		/* Game Start/Pause. */
			case Keyboard.KEY_S:
			    
                this.gameClock.running ? this.gameClock.stop() : this.gameClock.start();
                this.gameBanner.toggleVisibility();
                break;
                
	        default: break;
        }
        
    }

    /**
     *  Keyboard KeyUp handler.
     * 
     *  @param key event
     */
    keyUp(event) {
        
        switch (event.keyCode) {

            /* Car speed up button. */
            case Keyboard.KEY_UP:
                
                this.playerCar.isAccelerating = false;
		
			    break;
			    
            /* Car braking button. */
            case Keyboard.KEY_DOWN:
                    
                this.playerCar.isBraking = false;
		
			    break;
			    
		    /* Car turn right button. */
            case Keyboard.KEY_RIGHT:

                this.playerCar.isTurningRight = false;
		
			    break;

            /* Car turn left button. */
            case Keyboard.KEY_LEFT:
            
                this.playerCar.isTurningLeft = false;
		
			    break;
			    
	        default: break;
        }
    }
    
}

new Game();