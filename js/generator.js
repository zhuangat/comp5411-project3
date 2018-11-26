
const Shader = {
    Phong: new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    Fresnel: 
        new THREE.ShaderMaterial( {
            uniforms: THREE.FresnelShader.uniforms,
            vertexShader: THREE.FresnelShader.vertexShader,
            fragmentShader: THREE.FresnelShader.fragmentShader
        } )
    ,
    Basic: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
};

class CrystalGenerator {

    constructor(shader) {
        if (shader)
            this.shader = params.shader;
        else
            this.shader = Shader.Fresnel;
    }

    generate(scene) {
        var geo = new THREE.OctahedronGeometry(250, 0);
        var material = new Physijs.createMaterial(
            this.shader,
            0,
            0.3
        );
        var object = new Physijs.ConvexMesh(geo, material);
        object.position.set(Math.random() * 5000 - 2500, 1000, Math.random() * 5000 - 2500);
        object.rotation.set(Math.random()*(Math.PI),Math.random()*(Math.PI),Math.random()*(Math.PI));
        object.setLinearVelocity(new THREE.Vector3(0,500,500));
        scene.add(object);
    }
}