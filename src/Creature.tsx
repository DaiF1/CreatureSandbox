import {useEffect, useState} from "react"
import {boneRadius, boneOffset, NodeProps, ArmatureNode} from "./ArmatureNode"
import {degToRad} from "./utils";

import './Creature.css'

const defaultBodyRadius = 20;

interface CreatureEyeProps {
    x: number,
    y: number,
    radius: number,
    dragging: boolean,
};

function CreatureEye({x = 0, y = 0, radius = 0, dragging = false}: CreatureEyeProps) {
    const [pupilX, setPupilX] = useState<number>(x);
    const [pupilY, setPupilY] = useState<number>(y);

    const pupilRadius = radius * 0.7;

    function updatePupilPosition(mouseX: number, mouseY: number) {
        let dx = mouseX - x;
        let dy = mouseY - y;

        let mag = Math.sqrt(dx * dx + dy * dy);

        let norm_dx = dx / mag;
        let norm_dy = dy / mag;

        setPupilX(x + pupilRadius * norm_dx / 2);
        setPupilY(y + pupilRadius * norm_dy / 2);
    }

    useEffect(() => {
        function onMouseMove(e: MouseEvent) {
            updatePupilPosition(e.clientX, e.clientY);
        }

        window.addEventListener('mousemove', onMouseMove);

        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [x, y, radius]);

    useEffect(() => {
        function onTouchMove(e: TouchEvent) {
            if (e.targetTouches.length > 1)
                return;

            updatePupilPosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }

        window.addEventListener('touchmove', onTouchMove);

        return () => window.removeEventListener('touchmove', onTouchMove);
    }, [x, y, radius]);

    return (<>
            <div className="creature-eye creature-eye"
                style={{
                    left: x - radius,
                    top: y - radius,
                    width: radius * 2,
                    height: radius * 2,
                }}
            ></div>
            <div className="creature-eye creature-eye-pupil"
                style={{
                    left: dragging ? x - pupilRadius : pupilX - pupilRadius,
                    top: dragging ? y - pupilRadius : pupilY - pupilRadius,
                    width: pupilRadius * 2,
                    height: pupilRadius * 2,
                }}
            ></div>
        </>
    )
}

interface CreatureProps {
    boneCount: number,
    showBones: boolean,
    color: string,
    eyeRadius: number,
    editMode: boolean,
}

export function Creature({boneCount = 0, showBones = false, color = "", eyeRadius = 0, editMode = false}: CreatureProps) {
    const [headX, setHeadX] = useState<number>(window.innerWidth / 2 -
                                               window.innerWidth * 0.1); // Config panel offset
    const [headY, setHeadY] = useState<number>(window.innerHeight / 2);
    const headRadius = 30; // Change that to a useState when adding size controls

    const [dirTheta, setDirTheta] = useState<number>(0); // Creature direction in polar coordinates. Angle in radians

    const [dragging, setDragging] = useState<boolean>(false);

    const [nodes, setNodes] = useState<NodeProps[]>([]);

    const [selectedNode, setSelectedNode] = useState<number>(-1);

    useEffect(() => {
        if (boneCount - 1 > nodes.length) { // Bone count includes the head. Nodes does not
            let lastNode = { x: headX, y: headY };
            if (nodes.length != 0)
                lastNode = nodes[nodes.length - 1];

            let newNodes = []
            let count = boneCount - nodes.length;
            for (let i = 1; i < count; i++) {
                newNodes.push({
                    x: lastNode.x - boneOffset * i,
                    y: lastNode.y,
                    radius: defaultBodyRadius,
                });
            }

            setNodes([...nodes, ...newNodes]);
        }
        else {
            let newNodes = nodes.slice(0, boneCount - 1);
            setNodes(newNodes);
        }
    }, [boneCount]);

    function updateCreaturePositions(prevPos: any, x: number, y: number) {
        let dx = x - prevPos.x;
        let dy = y - prevPos.y;

        let mag = Math.sqrt(dx * dx + dy * dy);

        if (mag > 3) {
            let theta = Math.atan2(dy, dx);
            setDirTheta(theta);
        }

        setHeadX(x);
        setHeadY(y);

        let prev = { x: x, y: y };
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

    useEffect(() => {
        let previousPos = { x: headX, y: headY }

        function onMouseMove(e: MouseEvent) {
            if (!dragging)
                return;
            updateCreaturePositions(previousPos, e.clientX, e.clientY);
            previousPos = { x: e.clientX, y: e.clientY };
        }

        window.addEventListener('mousemove', onMouseMove);

        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [dragging])

    useEffect(() => {
        let previousPos = { x: headX, y: headY }

        function onTouchMove(e: TouchEvent) {
            if (!dragging || e.targetTouches.length > 1)
                return;

            updateCreaturePositions(previousPos, e.targetTouches[0].clientX, e.targetTouches[0].clientY);
            previousPos = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
        }

        window.addEventListener('touchmove', onTouchMove);

        return () => window.removeEventListener('touchmove', onTouchMove);
    }, [dragging])

    return (
        <>
            <div id="armature" key={boneCount}>
            <div className={editMode ?
                "armature-node armature-edit" + (selectedNode === -1 ? " armature-selected" : "") :
                "armature-node"}
                 style={{
                     left: headX - boneRadius,
                     top: headY - boneRadius,
                     display: showBones || editMode ? "block" : "none",
                 }}
                 onMouseDown={() => {
                     if (editMode) setSelectedNode(-1);
                     else setDragging(true);
                 }}
                 onMouseUp={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 onTouchStart={() => {
                     if (editMode) setSelectedNode(-1);
                     else setDragging(true);
                 }}
                 onTouchEnd={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 >
             </div>
            <div className="body-node"
                 style={{
                         left: headX - headRadius,
                         top: headY - headRadius,
                         width: headRadius * 2,
                         height: headRadius * 2,
                         backgroundColor: showBones ? color + "a0" : color,
                     }}
                 onMouseDown={() => {
                     if (editMode) return;
                     setDragging(true);
                 }}
                 onMouseUp={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 onTouchStart={() => {
                     if (editMode) return;
                     setDragging(true);
                 }}
                 onTouchEnd={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 >
             </div>

             <CreatureEye 
                x={headX + (headRadius - eyeRadius / 2) * Math.cos(dirTheta - degToRad(90))} 
                y={headY + (headRadius - eyeRadius / 2) * Math.sin(dirTheta - degToRad(90))} 
                radius={eyeRadius}
                dragging={dragging}>
            </CreatureEye>
             <CreatureEye 
                x={headX + (headRadius - eyeRadius / 2) * Math.cos(dirTheta + degToRad(90))} 
                y={headY + (headRadius - eyeRadius / 2) * Math.sin(dirTheta + degToRad(90))} 
                radius={eyeRadius}
                dragging={dragging}>
            </CreatureEye>

            {nodes.map((node, index) => <ArmatureNode key={index}
                       x={node.x}
                       y={node.y}
                       color={color}
                       radius={node.radius}
                       showBones={showBones}
                       selected={selectedNode === index}
                       onSelect={() => setSelectedNode(index)}
                       editMode={editMode}
                       >
                   </ArmatureNode>)
            }
            </div>
        </>
    )
}
