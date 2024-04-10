/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
//Material
const material = new THREE.MeshToonMaterial({color:  '#ffeded'})

//Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60), material
)
scene.add(mesh1)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32), material
)
scene.add(mesh2)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material
)
scene.add(mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

//Position
const objectsDistance = 4
mesh1.position.x = 2
mesh1.position.y = -objectsDistance * 0
mesh2.position.x = -2
mesh2.position.y = -objectsDistance * 1
mesh3.position.x = 2
mesh3.position.y = -objectsDistance * 2

/*
* Particles 
*/
//Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: '#ffeded'
})
//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
})

/*
* Cursor
*/
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const animate = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //animate meshes 
    for(const mesh of sectionMeshes){
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }

    //animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()