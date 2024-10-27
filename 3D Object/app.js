// Inisialisasi scene, camera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Set ukuran renderer dan enable shadow map
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('container').appendChild(renderer.domElement);

// Tambahkan kabut ke scene
scene.fog = new THREE.Fog(0xffffff, 1, 10);

// Buat pencahayaan
const ambientLight = new THREE.AmbientLight(0x404040); // Cahaya lembut
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Cahaya titik
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Muat tekstur panorama
const loader = new THREE.TextureLoader();
const texture = loader.load('textures/texture1.jpg', () => {
    // Set latar belakang scene ke tekstur panorama
    scene.background = texture; 
    texture.wrapS = THREE.RepeatWrapping;  // Ulangi tekstur secara horizontal
    texture.wrapT = THREE.RepeatWrapping;  // Ulangi tekstur secara vertikal
});

// Buat geometrik kubus dengan warna baby pink dan tekstur
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffc0cb, // Baby Pink
    emissive: 0x000000,
    roughness: 0.5,
    metalness: 0.5 
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2; // Pindahkan kubus ke kiri
cube.castShadow = true; // Aktifkan bayangan untuk kubus
scene.add(cube);

// Buat geometrik bola dengan warna ungu dan tekstur
const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x800080, // Purple
    emissive: 0x000000,
    roughness: 0.5,
    metalness: 0.5 
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2; // Pindahkan bola ke kanan
sphere.castShadow = true; // Aktifkan bayangan untuk bola
scene.add(sphere);

// Buat geometrik torus dengan warna biru dan tekstur
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0000ff, // Biru
    emissive: 0x000000,
    roughness: 0.5,
    metalness: 0.5 
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.y = -1; // Pindahkan torus ke bawah
torus.castShadow = true; // Aktifkan bayangan untuk torus
scene.add(torus);

// Atur posisi kamera
camera.position.set(0, 0, 5);

// Kontrol kamera
const cameraSpeed = 0.1; // Kecepatan pergerakan kamera
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.y -= cameraSpeed; // Membalik arah sumbu Y
            break;
        case 'ArrowDown':
            camera.position.y += cameraSpeed; // Membalik arah sumbu Y
            break;
        case 'ArrowLeft':
            camera.position.x += cameraSpeed; // Membalik arah sumbu X
            break;
        case 'ArrowRight':
            camera.position.x -= cameraSpeed; // Membalik arah sumbu X
            break;
    }
});

// Fungsi animasi
function animate() {
    requestAnimationFrame(animate);
    
    // Geser tekstur panorama untuk menciptakan efek gerakan
    texture.offset.x += 0.0005; // Geser tekstur panorama lebih lambat
    
    // Rotasi objek
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    // Render scene
    renderer.render(scene, camera);
}

// Panggil fungsi animasi
animate();
