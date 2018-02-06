import { Object3D } from '../lib/threejs/core/Object3D';

class GameObject extends Object3D {

    constructor (x, y, z) {
        
        super();
        
        this.type = 'GameObject';
        
        this.isGameObject = true;
        
        this.position.set(x, y, z);
        
        this.materials = Array();
        
    }
    
    /**
     *  Toogle object wireframe.
     * 
     */
    toggleWireframe() {
        
        this.materials.forEach(function (material) {

			material.wireframe = !material.wireframe;

        });
        
        this.children.forEach(function (child) {

			if (child.isGameObject) child.toggleWireframe();

        });
    }
    
    changeMaterial(materialID) {
        return
    }
}
export default GameObject;