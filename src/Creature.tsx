import {useEffect, useState} from "react"

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
            let lastNode = { x: headX, y: headY };
            if (nodes.length != 0)
                lastNode = nodes[nodes.length - 1];

            setNodes([...nodes, { x: lastNode.x - 50, y: lastNode.y }]);
        }
        else {
            let newNodes = nodes.slice(0, boneCount - 1);
            setNodes(newNodes);
        }
    }, [boneCount]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging)
                return;
            
            setHeadX(e.clientX - 10);
            setHeadY(e.clientY - 10);

            let prev = { x: e.clientX - 10, y: e.clientY - 10 };
            for (let node of nodes) {
                let dx = node.x - prev.x;
                let dy = node.y - prev.y;

                let mag = Math.sqrt(dx * dx + dy * dy);

                let norm_dx = dx / mag;
                let norm_dy = dy / mag;

                node.x = prev.x + norm_dx * 50;
                node.y = prev.y + norm_dy * 50;

                prev = node;
            }
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
            {nodes.map((node, index) => <ArmatureNode key={index} x={node.x} y={node.y}></ArmatureNode>)
            }
            </div>
        </>
    )
}
