import { Vector3 } from '../lib/threejs/math/Vector3';
import { Group } from '../lib/threejs/objects/Group';
import { Face3 } from '../lib/threejs/core/Face3';
import { Mesh } from '../lib/threejs/objects/Mesh';
import { Geometry } from '../lib/threejs/core/Geometry';
import { MeshBasicMaterial } from '../lib/threejs/materials/MeshBasicMaterial';
import { MeshLambertMaterial } from '../lib/threejs/materials/MeshLambertMaterial';
import { MeshPhongMaterial } from '../lib/threejs/materials/MeshPhongMaterial';
import { SpotLight } from '../lib/threejs/lights/SpotLight';
import { MAX_LIVES } from '../constants/Constants'

import DynamicObject from './DynamicObject';

class PlayerCar extends DynamicObject {

    constructor(x, y, z, camera) {
    
		super(x, y, z);

		this.type = 'PlayerCar';
		
		this.lives = MAX_LIVES;
		this.invulnerable = false;
		
		this.camera = (function ( self ) {

			if ( camera !== undefined && camera.isCamera ) {

				camera.position.set( 0, -80, 30);
				camera.lookAt( self.position.clone().negate() );

				camera.updateProjectionMatrix();

				self.add(camera);

				return camera;

			}

			return null;

		})( this );
		
		this.headlights = (function (self) {
			
			let lights = new Array();
			
			// Left and right.
			let Xposition = [-9, 9];
							  
			for (let i = 0; i < 2; i++) {

				let spotlight = new SpotLight(0xffffff, 0.6, 250, Math.PI / 4, 0.4);
	
				spotlight.position.set(Xposition[i], 23, 4);
				spotlight.target.position.copy(spotlight.position);
				spotlight.target.position.add(new Vector3(0, 15, -8));
	
				spotlight.visible = false;
				self.add(spotlight, spotlight.target);
				lights.push(spotlight);

			}

			return lights;

		}(this));
		
		/* Materials. */
		this.materials.push(new MeshBasicMaterial({color: 0x0470B7}));
		this.materials.push(new MeshBasicMaterial({color: 0x646363}));
		this.materials.push(new MeshPhongMaterial({color: 0x0470B7, specular: 0x777777, shininess: 30}));
		this.materials.push(new MeshPhongMaterial({color: 0x646363}));
		this.materials.push(new MeshLambertMaterial({color: 0x0470B7}));
		this.materials.push(new MeshLambertMaterial({color: 0x646363}));


		/* Wheels. */
		this.wheels = (function( self ) {
			
			let group = new Group();
			
			let vectorMultipliers = [
				
					new Vector3(  1,  1, 1 ),
					new Vector3( -1,  1, 1 ),
					new Vector3( -1, -1, 1 ),
					new Vector3(  1, -1, 1 )
			
			];
			
			for (let i = 0; i < 4; i++) {
		
				let vertices = [
					
					//Car Outside Wheel
					new Vector3(15.5, 14, -3).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 14, 4).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 14, -10).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 21, -3).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 7, -3).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 9, 1.5).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 19, 1.5).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 19, -7.5).multiply(vectorMultipliers[i]),
					new Vector3(15.5, 9, -7.5).multiply(vectorMultipliers[i]),
					
					// Car Inside Wheel
					new Vector3(12, 14, -3).multiply(vectorMultipliers[i]),
					new Vector3(12, 14, 4).multiply(vectorMultipliers[i]),
					new Vector3(12, 14, -10).multiply(vectorMultipliers[i]),
					new Vector3(12, 21, -3).multiply(vectorMultipliers[i]),
					new Vector3(12, 7, -3).multiply(vectorMultipliers[i]),
					new Vector3(12, 9, 1.5).multiply(vectorMultipliers[i]),
					new Vector3(12, 19, 1.5).multiply(vectorMultipliers[i]),
					new Vector3(12, 19, -7.5).multiply(vectorMultipliers[i]),
					new Vector3(12, 9, -7.5).multiply(vectorMultipliers[i])
					
				];
				
				if (i % 2 == 1)
					vertices.push.apply(vertices, vertices.splice(0,9));
				
				let faces = [
					
					
					new Face3(0, 1, 5),
					new Face3(0, 5, 4),
					new Face3(0, 4, 8),
					new Face3(0, 8, 2),
					new Face3(0, 2, 7),
					new Face3(0, 7, 3),
					new Face3(0, 3, 6),
					new Face3(0, 6, 1),
					
					new Face3(5+9, 1+9, 0+9),
					new Face3(4+9, 5+9, 0+9),
					new Face3(8+9, 4+9, 0+9),
					new Face3(2+9, 8+9, 0+9),
					new Face3(7+9, 2+9, 0+9),
					new Face3(3+9, 7+9, 0+9),
					new Face3(6+9, 3+9, 0+9),
					new Face3(1+9, 6+9, 0+9),
					
					new Face3(10, 1, 6),
					new Face3(10, 6, 15),
					new Face3(3, 12,6),
					new Face3(12, 15,6),
					new Face3(7, 16, 3),
					new Face3(16, 12, 3),
					new Face3(2, 11, 7),
					new Face3(11, 16, 7),
					new Face3(8, 11, 2),
					new Face3(17, 11, 8),
					new Face3(4, 13, 8),
					new Face3(13, 17, 8),
					new Face3(5, 14, 4),
					new Face3(14, 13, 4),
					new Face3(1, 10, 5),
					new Face3(10, 14, 5)
				
				];
				
				let geo = new Geometry();
				
				geo.vertices = vertices;
				geo.faces = faces;
				geo.computeFaceNormals();
				
				group.add( new Mesh(geo, self.materials[1]) );
				
			}
			
			return group;
			
		}(this));
		
		this.mesh = function( self ) {

			let vertices = [
	
				/* Car Chassis. */
				new Vector3(  12,  -23, -6 ),
				new Vector3(  12,   23, -6 ),
				new Vector3( -12,  -23, -6 ),
				new Vector3( -12,   23, -6 ),
				new Vector3(  12,  -23,  6 ),
				new Vector3(  12,   23,  6 ),
				new Vector3( -12,  -23,  6 ),
				new Vector3( -12,   23,  6 ),
				
				/* Car Roof. */
				new Vector3(  12,  -12,  6 ),
				new Vector3(  12,  -12, 14 ),
				new Vector3( -12,  -12,  6 ),
				new Vector3( -12,  -12, 14 ),
				new Vector3(  12,    8,  6 ),
				new Vector3(  12,    8, 14 ),
				new Vector3( -12,    8,  6 ),
				new Vector3( -12,    8, 14 ),
				new Vector3(  12,   10,  6 ),
				new Vector3( -12,   10,  6 )
	
			];

			let faces = [

				/* Car chassis. */
				
				// Bottom.
				new Face3( 0, 2, 3 ),
				new Face3( 3, 1, 0 ),
				
				// Top.
				new Face3( 7, 6, 4 ),
				new Face3( 4, 5, 7 ),
				
				// Right side.
				new Face3( 5, 4, 0 ),
				new Face3( 0, 1, 5 ),
				
				// Left side.
				new Face3( 2, 6, 7 ),
				new Face3( 7, 3, 2 ),
				
				// Back.
				new Face3( 6, 2, 0 ),
				new Face3( 0, 4, 6 ),
				
				// Front.
				new Face3( 3, 7, 5 ),
				new Face3( 5, 1, 3 ),
				
				/* Car Roof. */
				
				// Bottom.
				new Face3(  6, 17, 16 ),
				new Face3( 16,  4,  6 ),
				
				// Top.
				new Face3( 15, 11,  9 ),
				new Face3(  9, 13, 15 ),
				
				// Back.
				new Face3( 9, 11, 6 ),
				new Face3( 6,  4, 9 ),
				
				// Front.
				new Face3( 15, 13, 16 ),
				new Face3( 16, 17, 15 ),
				
				// Right side.
				new Face3( 12, 13, 9 ),
				new Face3(  9, 8, 12 ),

				// Left side.
				new Face3( 11, 15, 14 ),
				new Face3( 14, 10, 11 ),
				
				// Back right side.
				new Face3( 4, 8, 9 ),
				
				// Back left side.
				new Face3( 11, 10, 6 ),
				
				// Front right side.
				new Face3( 12, 16, 13 ),
				
				// Front left side.
				new Face3( 15, 17, 14 ),		

			];

			let geo = new Geometry();

			geo.vertices = vertices;
			geo.faces = faces;
			geo.computeFaceNormals();

			return new Mesh(geo, self.materials[0]);

		}(this);
		
		this.add(this.mesh, this.wheels);
		
		this.isAccelerating = false;
		this.isBraking      = false;
		this.isTurningRight = false;
		this.isTurningLeft  = false;
		
		/* Set initial direction. */
		this.setDirection(0, 1, 0);
		
		this.MAX_VELOCITY      =  280;
		this.MAX_BACK_VELOCITY =  -100;
		this.acceleration	   =  150;
		this.friction   	   =  175;
		this.brake      	   = -350;
        
    }
    
    removeLife() {
    	this.lives--;
	    this.invulnerable = true;
	    
	    let blinkingEvent = setInterval(() => this.visible = !this.visible, 200);
	    
	    setTimeout(() => {
	        clearInterval(blinkingEvent);
	        this.visible = true;
	        this.invulnerable = false;
	    }, 2500);
    }
	
	
    /**
     *  Update object.
     * 
     *  @param time delta
     */
	update(dt) {
	    
	    let velocity    	  = this.velocity;
	    let acceleration      = this.acceleration;
	    let MAX_VELOCITY      = this.MAX_VELOCITY;
	    let MAX_BACK_VELOCITY = this.MAX_BACK_VELOCITY
	    let friction          = this.friction;
	    let brake             = this.brake;
	    
	    if (this.isTurningRight) {

			let axis = new Vector3(0, 0, 1);
			
			/* Dynamic steering angle.
				- allows car to steer less near zero speed. */
			let angle = - 45 * Math.PI / ( 40 + 10 * Math.abs(this.MAX_VELOCITY) / (Math.abs(this.velocity) + 1e-5) );
			
			angle = angle * dt;
			
			/* Rotate along z-axis. */
			this.direction.applyAxisAngle(axis, angle);
			
			this.rotateOnAxis(axis, angle);

		}
		
		else if (this.isTurningLeft) {

			let axis  = new Vector3(0, 0, 1);

			/* Dynamic steering angle.
				- allows car to steer less near zero speed. */
			let angle = 45 * Math.PI / ( 40 + 10 * Math.abs(this.MAX_VELOCITY) / (Math.abs(this.velocity) + 1e-5) );
	
			angle = angle * dt;
			
			/* Rotate along z-axis. */
			this.direction.applyAxisAngle(axis, angle);
			
			this.rotateOnAxis(axis, angle);

		}
	    
	    /**
	     * Player is pressing key down button.
	     * Car is braking.
	     */
	    if (this.isBraking) {
	    	
	    	this.isMoving = true;
	   
			/**
			 * If car is moving forward.
			 * Brake.
			 */
	    	if (velocity > 0) {
	    		
	    		let dv = brake * dt;
	    		
		    	if (velocity + dv < 0) {
					this.velocity = 0;
				}
				else {
					this.velocity += dv;
				}
	    	}
	    	
			/**
			 * If car is moving backward.
			 * Accelerate backwards.
			 */
	    	else {
	    		let dv = - acceleration * dt;
	    		
		    	if (velocity + dv < MAX_BACK_VELOCITY) {
					this.velocity = MAX_BACK_VELOCITY;
				}
				else {
					this.velocity += dv;
				}
	    	}
	    	
	    }
	    
	    /**
	     * Player is pressing key up button.
	     * Car is accelerating towards facing direction.
	     */
	    else if (this.isAccelerating) {
	    	
	    	this.isMoving = true;
	    	
	    	/* Update velocity. */
	    	if (velocity < this.MAX_VELOCITY) {
	    		
	    		let dv = acceleration * dt;
    			
				if (velocity + dv > MAX_VELOCITY) {
					this.velocity = MAX_VELOCITY;
				}
				else {
					this.velocity += dv;
				}
	    	}
	    }
	    
	    /**
	     * Player isnt pressing any key but the car still got some balance.
	     * Car is slowing down.
	     */
	    else if (velocity != 0) {
	    	
	    	this.isMoving = true;
	    	
	    	let df = friction * dt;
	    	
	    	/* Slowing down in forward direction. */
	    	if (velocity > 0) {
	    		
	    		df *= -1;
	    		
	    		if (velocity + df < 0){
	    			this.velocity = 0;
	    		}
	    		else {
	    			this.velocity += df;
	    		}
	    	}
	    	/* Slowing down in backward direction. */
	    	else {
	    		if (velocity + df > 0){
	    			this.velocity = 0;
	    		}
	    		else {
	    			this.velocity += df;
	    		}
	    	}
	    }
	    
	    /**
	     * Player isnt pressing any key and car has no balance.
	     * Car stopped.
	     */
	    else {
	    	
	    	this.velocity = 0;
	    
	    }
	    
	    super.update(dt);

	}

    /**
     *  Intersect.
     * 
     *  @param other object
     */
	intersect(other) {
		return super.intersect(other);
	}
	
    /**
     *  Handle collision.
     * 
     *  @param other object
     */
	handleCollision(other) {
		
		
		switch (other.type) {

			case 'ButterPacket':
				
				let direction = new Vector3(this.boundingSphere.center.x - other.boundingSphere.center.x, this.boundingSphere.center.y - other.boundingSphere.center.y, 0).normalize();
				let dist = this.position.distanceTo( other.position );
				let distThis = Math.abs( dist - this.boundingSphere.radius );
				let distOther = Math.abs( dist - other.boundingSphere.radius );
				let offset = new Vector3();
				
				offset.copy(direction).multiplyScalar(dist - (distThis + distOther));
				
				this.velocity = 0;

				this.isAccelerating = false;
				this.isBraking = false;
				
				this.position.add(offset);
				this.boundingBox.translate(offset);
				this.boundingSphere.translate(offset);

				break;

			case 'Orange':
				other.handleCollision(this);
				break;

			case 'Cheerio':
				
				var direction = new Vector3(other.boundingSphere.center.x - this.boundingSphere.center.x, other.boundingSphere.center.y - this.boundingSphere.center.y, 0).normalize();
				var dist = this.position.distanceTo( other.position );
				var distThis = Math.abs( dist - this.boundingSphere.radius );
				var distOther = Math.abs( dist - other.boundingSphere.radius );
				var offset = new Vector3();
				
				offset.copy(direction).multiplyScalar(dist + 4 - (distThis + distOther));
				
				other.position.add(offset);
				other.boundingBox.translate(offset);
				other.boundingSphere.translate(offset);
				
				other.isMoving = true;
				other.direction = this.direction.clone();
				other.velocity = this.velocity * 2;
				break;
				
			case 'TableLimit':
				other.handleCollision(this);

			default: break;

		}
		return;
	}
	
	changeMaterial(materialID) {
        switch (materialID) {

			case 'Basic':
			    this.mesh.material = this.materials[0]; 
			    this.wheels.children.forEach((wheel) => wheel.material = this.materials[1]);
			    
			    break;
			    
			case 'Lambert':
			    this.mesh.material = this.materials[4];
			    this.wheels.children.forEach((wheel) => wheel.material = this.materials[5]);
			    
			    break;
			    
			case 'Phong':
			    this.mesh.material = this.materials[2];
			    this.wheels.children.forEach((wheel) => wheel.material = this.materials[3]);
				
				break;

			default: break;

		}
    }
    
	toggleHeadlights () {
		
		this.headlights.forEach((light) => light.visible = !light.visible);

	}
	
}

export default PlayerCar;