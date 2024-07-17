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

    selected: boolean,
    onSelect: () => void,

    editMode: boolean,
}

export function ArmatureNode({ x = 0,
                             y = 0,
                             radius = 0,
                             color = "",
                             showBones = false,
                             selected = false,
                             onSelect = () => {},
                             editMode = false } : ArmatureNodeProps) {
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
        </>
    )
}

