import {useEffect, useState} from "react"
import {boneRadius, boneOffset, NodeProps, ArmatureNode} from "./ArmatureNode"
import {degToRad} from "./utils";

import './Creature.css'
import {NodeUpdater, ResetMethods} from "./App";

const defaultBodyRadius = 15;

interface CreatureEyeProps {
    x: number,
    y: number,
    radius: number,
    dragging: boolean,
};

function CreatureEye({x = 0, y = 0, radius = 0, dragging = false}: CreatureEyeProps) {
    const pupilRadius = radius * 0.7;

    const [pupilX, setPupilX] = useState<number>(0);
    const [pupilY, setPupilY] = useState<number>(0);

    function updatePupilPosition(mouseX: number, mouseY: number) {
        let dx = mouseX - x;
        let dy = mouseY - y;

        let mag = Math.sqrt(dx * dx + dy * dy);

        let norm_dx = dx / mag;
        let norm_dy = dy / mag;

        setPupilX(pupilRadius * norm_dx / 2);
        setPupilY(pupilRadius * norm_dy / 2);
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
            >
            <div className="creature-eye creature-eye-pupil"
                style={{
                    left: dragging ? pupilRadius / 2 : pupilX + pupilRadius / 2,
                    top: dragging ? pupilRadius / 2 : pupilY + pupilRadius / 2,
                    width: pupilRadius * 2,
                    height: pupilRadius * 2,
                }}
            ></div>
            </div>
        </>
    )
}

interface CreatureProps {
    boneCount: number,
    showBones: boolean,
    color: string,
    eyeRadius: number,
    legLength: number,
    legWidth: number,

    editMode: boolean,
    onSelect: (updater: NodeUpdater) => void,
    defineReset: (reset: ResetMethods) => void,
}

export function Creature({boneCount = 0,
                         showBones = false,
                         color = "",
                         eyeRadius = 0,
                         legLength = 35,
                         legWidth = 15,
                         editMode = false,
                         onSelect = () => {},
                         defineReset = () => {}}: CreatureProps) {

    const [head, setHead] = useState<NodeProps>({
        x: window.innerWidth / 2 - window.innerWidth * 0.1 /* Config panel offset */ +
            boneOffset * 2,
        y: window.innerHeight / 2,
        radius: 30,
        dirX: -1,
        dirY: 0,
        hasLegs: false,
    });

    const [dirTheta, setDirTheta] = useState<number>(0); // Creature direction in polar coordinates. Angle in radians

    const [dragging, setDragging] = useState<boolean>(false);

    const [nodes, setNodes] = useState<NodeProps[]>([
        {x: head.x - boneOffset    , y: head.y, radius: 38, dirX: -1, dirY: 0, hasLegs: true},
        {x: head.x - boneOffset * 2, y: head.y, radius: 31, dirX: -1, dirY: 0, hasLegs: false},
        {x: head.x - boneOffset * 3, y: head.y, radius: 21, dirX: -1, dirY: 0, hasLegs: true},
        {x: head.x - boneOffset * 4, y: head.y, radius: 15, dirX: -1, dirY: 0, hasLegs: false},
    ]);

    const [selectedNode, setSelectedNode] = useState<number>(-1);
    useEffect(() => {
        onSelect({node: head,
                 updateRadius: (width: number) => { head.radius = width }});

        defineReset({
            position: () => updateCreaturePositions(head,
                                                    window.innerWidth / 2 - window.innerWidth * 0.1 + boneOffset * 2,
                                                    window.innerHeight / 2),
        });
    }, []);

    useEffect(() => {
        if (boneCount - 1 > nodes.length) { // Bone count includes the head. Nodes does not
            let lastNode = head;
            if (nodes.length != 0)
                lastNode = nodes[nodes.length - 1];

            let newNodes = []
            let count = boneCount - nodes.length;
            for (let i = 1; i < count; i++) {
                newNodes.push({
                    x: lastNode.x - boneOffset * i,
                    y: lastNode.y,
                    radius: defaultBodyRadius,
                    dirX: -1,
                    dirY: 0,
                    hasLegs: false,
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

        head.x = x;
        head.y = y;

        let prev = { x: x, y: y };
        for (let node of nodes) {
            let dx = node.x - prev.x;
            let dy = node.y - prev.y;

            let mag = Math.sqrt(dx * dx + dy * dy);

            let norm_dx = dx / mag;
            let norm_dy = dy / mag;

            node.dirX = norm_dx;
            node.dirY = norm_dy;

            node.x = prev.x + norm_dx * boneOffset;
            node.y = prev.y + norm_dy * boneOffset;

            prev = node;
        }
    }

    useEffect(() => {
        let previousPos = { x: head.x, y: head.y };

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
        let previousPos = { x: head.x, y: head.y }

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
                     left: head.x - boneRadius,
                     top: head.y - boneRadius,
                     display: showBones || editMode ? "block" : "none",
                 }}
                 onMouseDown={() => {
                     if (editMode) {
                         setSelectedNode(-1);
                         onSelect({node: head,
                                  updateRadius: (width) => { setHead({ ...head, radius: width }) }});
                     }
                     else setDragging(true);
                 }}
                 onMouseUp={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 onTouchStart={() => {
                     if (editMode) {
                         setSelectedNode(-1);
                         onSelect({node: head,
                                  updateRadius: (width) => { setHead({ ...head, radius: width }) }});
                     }
                     else setDragging(true);
                 }}
                 onTouchEnd={() => {
                     if (editMode) return;
                     setDragging(false);
                 }}
                 >
             </div>
            <div className="body-node body-head"
                 style={{
                         left: head.x - head.radius,
                         top: head.y - head.radius,
                         width: head.radius * 2,
                         height: head.radius * 2,
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
                x={head.x + (head.radius - eyeRadius / 2) * Math.cos(dirTheta - degToRad(90))} 
                y={head.y + (head.radius - eyeRadius / 2) * Math.sin(dirTheta - degToRad(90))} 
                radius={eyeRadius}
                dragging={dragging}>
            </CreatureEye>
             <CreatureEye 
                x={head.x + (head.radius - eyeRadius / 2) * Math.cos(dirTheta + degToRad(90))} 
                y={head.y + (head.radius - eyeRadius / 2) * Math.sin(dirTheta + degToRad(90))} 
                radius={eyeRadius}
                dragging={dragging}>
            </CreatureEye>

            {nodes.map((node, index) => <ArmatureNode key={index}
                       x={node.x}
                       y={node.y}
                       dirTheta={Math.atan2(node.dirY, node.dirX)}
                       color={color}
                       radius={node.radius}
                       showBones={showBones}
                       selected={selectedNode === index}
                       onSelect={() => {
                           setSelectedNode(index)
                           onSelect({node: node,
                                    updateRadius: (width) => { node.radius = width }});
                       }}
                       editMode={editMode}
                       hasLegs={node.hasLegs}
                       legWidth={legWidth}
                       legLength={legLength}
                       >
                   </ArmatureNode>)
            }
            </div>
        </>
    )
}
