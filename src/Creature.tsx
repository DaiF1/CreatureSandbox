import {useEffect, useState} from "react"

import './Creature.css'

const boneRadius = 12; // 7px radius + 5px border
const boneOffset = 30; // 30px

const defaultBodyRadius = 20;

interface NodeProps {
    x: number,
    y: number,
    radius: number,
};

interface ArmatureNodeProps {
    x: number,
    y: number,
    radius: number,
    color: string,
    showBones: boolean,
}

export function ArmatureNode({ x = 0, y = 0, radius = 0, color = "", showBones = false } : ArmatureNodeProps) {
    return (
        <>
            <div className="armature-node"
                style={
                    {
                        left: x - boneRadius,
                        top: y - boneRadius,
                        display: showBones ? "block" : "none",
                    }
                }
            ></div>
            <div className="body-node"
                style={
                    {
                        left: x - radius,
                        top: y - radius,
                        width: radius * 2,
                        height: radius * 2,
                        backgroundColor: color,
                    }
                }
            ></div>
        </>
    )
}

interface CreatureProps {
    boneCount: number,
    showBones: boolean,
    color: string,
}

export function Creature({boneCount = 0, showBones = false, color = ""}: CreatureProps) {
    const [headX, setHeadX] = useState<number>(window.innerWidth / 2 -
                                               window.innerWidth * 0.1); // Config panel offset
    const [headY, setHeadY] = useState<number>(window.innerHeight / 2);
    const [headRadius, setHeadRadius] = useState<number>(30);

    const [dragging, setDragging] = useState<boolean>(false);

    const [nodes, setNodes] = useState<NodeProps[]>([]);

    useEffect(() => {
        if (boneCount - 1 > nodes.length) {
            let lastNode = { x: headX, y: headY };
            if (nodes.length != 0)
                lastNode = nodes[nodes.length - 1];

            setNodes([...nodes, {
                x: lastNode.x - boneOffset,
                y: lastNode.y,
                radius: defaultBodyRadius,
            }]);
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
            
            setHeadX(e.clientX - boneRadius);
            setHeadY(e.clientY - boneRadius);

            let prev = { x: e.clientX - boneRadius, y: e.clientY - boneRadius };
            for (let node of nodes) {
                let dx = node.x - prev.x;
                let dy = node.y - prev.y;

                let mag = Math.sqrt(dx * dx + dy * dy);

                let norm_dx = dx / mag;
                let norm_dy = dy / mag;

                node.x = prev.x + norm_dx * boneOffset;
                node.y = prev.y + norm_dy * boneOffset;

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
                 style={{
                     left: headX - boneRadius,
                     top: headY - boneRadius,
                     display: showBones ? "block" : "none",
                 }}
                 onMouseDown={() => {
                    setDragging(true);
                 }}
                 onMouseUp={() => {
                     setDragging(false);
                 }}
                 >
             </div>
            <div className="body-node body-head"
                 style={{
                         left: headX - headRadius,
                         top: headY - headRadius,
                         width: headRadius * 2,
                         height: headRadius * 2,
                         backgroundColor: color,
                     }}
                 onMouseDown={() => {
                    setDragging(true);
                 }}
                 onMouseUp={() => {
                     setDragging(false);
                 }}
                 >
             </div>
            {nodes.map((node, index) => <ArmatureNode key={index}
                       x={node.x}
                       y={node.y}
                       color={color}
                       radius={node.radius}
                       showBones={showBones}>
                   </ArmatureNode>)
            }
            </div>
        </>
    )
}
