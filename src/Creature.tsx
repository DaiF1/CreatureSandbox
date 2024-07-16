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
    const [headX, setHeadX] = useState<number>(window.innerWidth / 2 -
                                               window.innerWidth * 0.1); // Config panel offset
    const [headY, setHeadY] = useState<number>(window.innerHeight / 2);

    const [dragging, setDragging] = useState<boolean>(false);

    const [nodes, setNodes] = useState<NodeProps[]>([]);

    useEffect(() => {
        if (boneCount - 1 > nodes.length) {
            let newNodes = [];


            let lastNode = { x: headX, y: headY };
            if (nodes.length != 0)
                lastNode = nodes[nodes.length - 1];

            let count = boneCount - nodes.length;
            for (let i = 1; i < count; i++) { // Skip the head
                newNodes.push({ x: lastNode.x - i * 50, y: lastNode.y });
            }

            setNodes(nodes.concat(newNodes));
        }
        else {
            let newNodes = nodes.slice(0, boneCount - 1);
            setNodes(newNodes);
        }
    }, [boneCount]);

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
