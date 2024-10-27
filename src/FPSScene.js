// Mengimpor modul GameScene, THREE.js, GLTFLoader, dan Input untuk pengaturan scene 3D
import GameScene from "./GameScene";
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import Input from "./Input";

// Daftar nama file tekstur kubus untuk lingkungan (cubemap)
let cubeTexture = [
   'cubemap_px.png',  // Positive X face
   'cubemap_nx.png',  // Negative X face
   'cubemap_py.png',  // Positive Y face
   'cubemap_ny.png',  // Negative Y face
   'cubemap_pz.png',  // Positive Z face
   'cubemap_nz.png'   // Negative Z face
];

// Mendefinisikan kelas FPSScene yang merupakan turunan dari GameScene
export default class FPSScene extends GameScene {
    
    // Fungsi untuk mengatur lantai (ground) di scene
    setupGround(size) {
        // Memuat tekstur tanah dan mengatur pengulangan tekstur
        const groundTexture = new THREE.TextureLoader().load("/texture/grounds.jpg");
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        let tSize = size * 0.09;
        groundTexture.repeat.set(tSize, tSize);

        // Membuat mesh tanah menggunakan PlaneGeometry dan material tekstur
        this.groundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size),
            new THREE.MeshStandardMaterial({
                map: groundTexture
            })
        );
        // Memutar mesh agar sejajar dengan sumbu X-Z (horizontal)
        this.groundMesh.rotateX(-Math.PI * 0.5);
        this.scene.add(this.groundMesh);  // Menambahkan tanah ke scene
    }

    // Fungsi utama setup untuk konfigurasi awal scene
    setup() {
        // Mengatur intensitas pencahayaan ambien
        this.ambientLight.intensity = 3.0;
        this.clock = new THREE.Clock();  // Timer untuk animasi
        this.mixer = null;  // Untuk animasi model

        // Memuat cubemap sebagai tekstur lingkungan
        const environmentTexture = new THREE.CubeTextureLoader().load(cubeTexture,
            (texture) => {
                this.scene.background = texture;  // Menjadikan cubemap sebagai latar belakang scene

                // Mengatur kontrol kamera (OrbitControls)
                this.OrbitControls.enabled = true;
                this.OrbitControls.enableZoom = false;  // Nonaktifkan zoom
                this.OrbitControls.maxPolarAngle = Math.PI * 0.49;  // Batasi rotasi vertikal
                this.OrbitControls.minPolarAngle = Math.PI * 0.49;

                let size = 3000;
                this.setupGround(size);  // Mengatur tanah dengan ukuran tertentu

                // Memuat model 3D menggunakan GLTFLoader
                const gltfLoader = new GLTFLoader();
                gltfLoader.load("Soldier.glb", (model) => {
                    let mesh = model.scene;
                    this.player = mesh;  // Menyimpan referensi pemain
                    mesh.position.set(80, 5, 40);
                    this.camera.position.set(mesh.position.x, mesh.position.y + 3, mesh.position.z - 50);

                    let scale = 15;
                    mesh.scale.set(scale, scale, scale);  // Mengatur skala model pemain
                    this.scene.add(mesh);  // Menambahkan model ke scene

                    this.mixer = new THREE.AnimationMixer(mesh);  // Mengatur mixer animasi
                    this.clips = model.animations;

                    // Mendefinisikan animasi model dengan nama-nama aksi
                    this.animations = {
                        idle: this.mixer.clipAction(this.clips[0]),
                        jump: this.mixer.clipAction(this.clips[1]),
                        run: this.mixer.clipAction(this.clips[2]),
                        walk: this.mixer.clipAction(this.clips[3])
                    }
                    this.animations.idle.play();  // Menjalankan animasi idle secara default
                });
            },
        );

        // Log jika CubeTextureLoader menggunakan fallback tekstur tunggal
        if (!environmentTexture.isCubeTexture) {
            console.warn('CubeTextureLoader: Fallback to single texture');
        }
    }

    // Fungsi untuk memperbarui scene pada setiap frame
    update() {
        if (this.mixer) {
            // Mengambil delta waktu dan memperbarui animasi
            let d = this.clock.getDelta();
            this.mixer.update(d);

            // Mengatur OrbitControls untuk mengikuti pemain
            this.OrbitControls.target = this.player.position.clone().add({x: 0, y: 40, z: 0});
            this.player.rotation.set(0, this.OrbitControls.getAzimuthalAngle() + Math.PI, 0);
        }

        // Menangani perintah tombol yang dilepas
        if(Input.keyUp) {
            if(Input.keyUp.keyCode == 38 || Input.keyUp.keyCode == 87 || Input.keyUp.keyCode == 32 || Input.keyUp.keyCode == 82) {
                console.log(Input.keyUp);
                if(!this.animations.idle.isRunning()) {
                    // Mengatur kembali animasi ke idle ketika tombol dilepas
                    this.animations.idle.play();
                    this.animations.run.stop();
                    this.animations.walk.stop();
                    this.animations.jump.stop();
                }
            }
        }

        // Menangani perintah tombol yang ditekan
        if(Object.keys(Input.keyDown).length > 0) {
            // Jika tombol 'W' ditekan, menjalankan animasi berjalan
            if(Input.keyDown[87]) {
                if(!this.animations.walk.isRunning()) {
                    this.animations.idle.stop();
                    this.animations.walk.play();
                    this.animations.run.stop();
                    this.animations.jump.stop();
                }
                this.player.translateZ(0.3);  // Gerakkan pemain maju
                this.camera.translateZ(-0.3);  // Mengikuti posisi pemain dengan kamera
            }

            // Jika tombol 'R' ditekan, menjalankan animasi lari
            else if(Input.keyDown[82]) {
                console.log(Input.keyUp);
                if(!this.animations.run.isRunning()) {
                    this.animations.idle.stop();
                    this.animations.run.play();
                    this.animations.jump.stop();
                    this.animations.walk.stop();
                }
                this.player.translateZ(2.0);
                this.camera.translateZ(-2.0);
            }

            // Jika tombol 'Spasi' ditekan, menjalankan animasi lompat
            else if(Input.keyDown[32]) {
                console.log(Input.keyUp);
                if(!this.animations.jump.isRunning()) {
                    this.animations.idle.stop();
                    this.animations.run.stop();
                    this.animations.jump.play();
                    this.animations.walk.stop();
                }
                this.player.translateZ(3.5);
                this.camera.translateZ(-3.5);
            }
        }
    }
}
