'use strict'


const Shader = {
    Phong: new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    Frensel: new THREE.ShaderMaterial(),
    Basic: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
};

class CrystalGenerator {

    constructor(shader) {
        if (shader)
            this.shader = params.Shader;
        else
            this.shader = Shader.Basic;
    }

    generate(scene) {
        var geo = new THREE.OctahedronGeometry(100, 0);
        var material = new Physijs.createMaterial(
            this.shader,
            0.8,
            0.3
        );
        var object = new Physijs.BoxMesh(geo, material);
        object.position.set(Math.random() * 5000 - 2500, 1000, Math.random() * 5000 - 2500);
        scene.add(object);
    }
}