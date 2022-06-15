//https://www.youtube.com/watch?v=y5CAuAZ7kKM&list=PLIRTsuB0iPJvxaYyg8MOrjffPPcYnccL0
//design dari dokumen probadi
import * as THREE from 'three'
import { forwardRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ScrollControls, useScroll, useTexture } from '@react-three/drei'
import useRefs from 'react-use-refs'

//dibantu teman kantor
const rsqw = (t, delta = 0.1, a = 1, f = 1 / (2 * Math.PI)) => 
(a / Math.atan(1 / delta)) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta)

export default function App() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, -3.2, 40], fov: 12 }}>
      <ScrollControls pages={4}>
        <Composition />
      </ScrollControls>
    </Canvas>
  )
}

function Composition({ ...props }) {
  const scroll = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  const [group, big, small, keyLight, stripLight, fillLight] = useRefs()
  const [textureA, textureB] = useTexture(['/Unknown.jpeg', '/Unknown1.jpeg'])
  useFrame((state, delta) => {
    const r1 = scroll.range(0/3, 1/3)
    const r2 = scroll.range(1/3, 1/3)
    big.current.rotation.x = Math.PI - (Math.PI / 2) * rsqw(r1) 
    small.current.rotation.x = Math.PI - (Math.PI / 2) * rsqw(r1) 
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, (-Math.PI) * r2, 3, delta)
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, (-width / 7) * r2, 3, delta)
    group.current.scale.x = group.current.scale.y = group.current.scale.z
    keyLight.current.position.set(0.25, 3 , 3 )
  })
  
  return (
    <>
      <spotLight position={[0, -width * 0.7, 0]} />
      <directionalLight ref={keyLight}>
        <orthographicCamera attachObject={['shadow', 'camera']}/>
      </directionalLight>
      <group ref={group} position={[0, -height / 3, 0]} {...props}>
        <spotLight ref={stripLight} position={[width * 2.5, 0, width]}  />
        <spotLight ref={fillLight} position={[0, -width / 2.4, -width * 2.2]}  />
        <Mac ref={big} texture={textureA} scale={width / 60}>
        </Mac>
        <Mac ref={small} texture={textureB} scale={width / 75} rotation={[0, Math.PI, 0]} position={[0, 0, -width / 2.625]}>
        </Mac>
      </group>
    </>
  )
}

const Mac = forwardRef(({ texture, children, ...props }, ref) => {
  const { nodes, materials } = useGLTF('/mac.glb')
  return (
    <group {...props} dispose={null}>
      <group ref={ref} position={[0, -0.40, -11.35]}>
        <mesh geometry={nodes.back_1.geometry} material={materials.blackmatte} />
        <mesh receiveShadow castShadow geometry={nodes.back_2.geometry} material={materials.aluminium} />
        <mesh geometry={nodes.matte.geometry}>
          <meshLambertMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
      {children}
      <mesh geometry={nodes.body_1.geometry} material={materials.aluminium} material-color="#aaaaaf"/>
      <mesh geometry={nodes.body_2.geometry} material={materials.blackmatte} />
    </group>
  )
})
