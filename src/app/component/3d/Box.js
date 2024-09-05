'use client';
import { Canvas } from "@react-three/fiber";

function Box(props) {
  const handleClick = (e) => {
    // Empêche le raycaster de traverser plus loin
    e.stopPropagation();
    console.log('Box clicked');
  };

  return (
    <mesh
      position={props.position}
      onClick={handleClick}>
      <boxGeometry args={[5, 5, 2]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default Box;
