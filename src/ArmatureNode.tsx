import {CreatureLeg} from "./CreatureLeg";
import {degToRad} from "./utils";

export const boneRadius = 12; // 7px radius + 5px border
export const boneOffset = 30; // 30px

export interface NodeProps {
    x: number,
    y: number,
    radius: number,
    dirX: number,
    dirY: number,
    hasLegs: boolean,
};

export interface ArmatureNodeProps {
    x: number,
    y: number,
    radius: number,
    color: string,
    hasLegs: boolean,
    legWidth: number,
    legLength: number,

    dirTheta: number,

    showBones: boolean,

    selected: boolean,
    onSelect: () => void,

    editMode: boolean,
}

export function ArmatureNode({ x = 0,
                             y = 0,
                             dirTheta = 0,
                             radius = 0,
                             color = "",
                             showBones = false,
                             selected = false,
                             onSelect = () => {},
                             editMode = false,
                             legWidth = 15,
                             legLength = 35,
                             hasLegs = false } : ArmatureNodeProps) {
    return (
        <>
            <div className={editMode ?
                "armature-node armature-edit" + (selected ? " armature-selected" : "") :
                "armature-node"}
                style={
                    {
                        left: x - boneRadius,
                        top: y - boneRadius,
                        display: showBones ? "block" : "none",
                    }
                }
                 onMouseDown={() => {
                     if (editMode) onSelect();
                 }}
                 onTouchStart={() => {
                     if (editMode) onSelect();
                 }}
            ></div>
            <div className="body-node"
                style={
                    {
                        left: x - radius,
                        top: y - radius,
                        width: radius * 2,
                        height: radius * 2,
                        backgroundColor: showBones ? color + "a0" : color,
                    }
                }
            ></div>
            {
            hasLegs ? 
                <>
            <CreatureLeg
                attachPoint={{
                    x: x + (radius - legWidth) * Math.cos(dirTheta - degToRad(90)),
                    y: y + (radius - legWidth) * Math.sin(dirTheta - degToRad(90)),
                }}
                targetPoint={{
                    x: x + (radius - legWidth) * Math.cos(dirTheta - degToRad(90)) + legLength * 2 * Math.cos(dirTheta - degToRad(130)),
                    y: y + (radius - legWidth) * Math.sin(dirTheta - degToRad(90)) + legLength * 2 * Math.sin(dirTheta - degToRad(130)),
                }}
                width={legWidth}
                length={legLength}
                color={color}
            ></CreatureLeg>

            <CreatureLeg
                attachPoint={{
                    x: x + (radius - legWidth) * Math.cos(dirTheta + degToRad(90)),
                    y: y + (radius - legWidth) * Math.sin(dirTheta + degToRad(90)),
                }}
                targetPoint={{
                    x: x + (radius - legWidth) * Math.cos(dirTheta + degToRad(90)) + legLength * 2 * Math.cos(dirTheta + degToRad(130)),
                    y: y + (radius - legWidth) * Math.sin(dirTheta + degToRad(90)) + legLength * 2 * Math.sin(dirTheta + degToRad(130)),
                }}
                width={legWidth}
                length={legLength}
                color={color}
            ></CreatureLeg>
            </>
            : null
            }
        </>
    )
}

