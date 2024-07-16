import {useEffect, useRef, useState} from "react"

import './Creature.css'

interface NodeProps {
    x: number,
    y: number,
};

export function ArmatureNode({ x = 0, y = 0} : NodeProps) {
    return (
        <>
            <div className="armature-node"
                style={
                    {
                        left: x,
                        top: y,
                    }
                }
            ></div>
        </>
    )
}

interface CreatureProps {
    boneCount: number,
}

export function Creature({boneCount = 0}: CreatureProps) {
    const [headX, setHeadX] = useState<number>(window.innerWidth / 2);
    const [headY, setHeadY] = useState<number>(window.innerHeight / 2);

    const [dragging, setDragging] = useState<boolean>(false);

    let nodeInit = [];

    for (let i = 1; i < boneCount; i++) {
        nodeInit.push({ x: 0, y: 0 });
    }

    const [nodes, setNodes] = useState<NodeProps[]>(nodeInit);

    useEffect(() => {
        const onMouseMove = e => {
            if (!dragging)
                return;
            
            setHeadX(e.clientX - 10);
            setHeadY(e.clientY - 10);
        }

        window.addEventListener('mousemove', onMouseMove);

        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [dragging])

    return (
        <>
            <div id="armature" key={boneCount}>
            <div className="armature-node armature-head"
                 style={{left: headX, top: headY}}
                 onMouseDown={() => {
                    setDragging(true);
                 }}
                 onMouseUp={() => {
                     setDragging(false);
                 }}
                 >
             </div>
            {nodes.map(node => <ArmatureNode x={node.x} y={node.y}></ArmatureNode>)
            }
            </div>
        </>
    )
}
