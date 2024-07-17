export const boneRadius = 12; // 7px radius + 5px border
export const boneOffset = 30; // 30px

export interface NodeProps {
    x: number,
    y: number,
    radius: number,
};

export interface ArmatureNodeProps {
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
                        backgroundColor: showBones ? color + "a0" : color,
                    }
                }
            ></div>
        </>
    )
}

