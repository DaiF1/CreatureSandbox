import {useState} from "react";
import {degToRad} from "./utils";

export interface CreatureLegProps {
    attachPoint: { x: number, y: number },
    targetPoint: { x: number, y: number },
    color: string,

    width: number,
    length: number,
}

export function CreatureLeg({attachPoint, targetPoint, color, width, length}: CreatureLegProps) {
    const [footLocation, setFootLocation] = useState(targetPoint);

    function getRotAngle() {
        let dx = footLocation.x - attachPoint.x;
        let dy = footLocation.y - attachPoint.y;

        let mag = Math.sqrt(dx * dx + dy * dy);
        let maxLength = length * Math.sin(degToRad(40)) * 2; // Angle used to determine targetPoint

        if (mag > maxLength * 2)
            setFootLocation(targetPoint);

        return Math.atan2(dy, dx);
    }

    function getScale() {
        let dx = footLocation.x - attachPoint.x;
        let dy = footLocation.y - attachPoint.y;

        let mag = Math.sqrt(dx * dx + dy * dy);
        return mag / (length + width);
    }

    return (<>
            <div className="body-leg"
                style={{
                    left: attachPoint.x,
                    top: attachPoint.y,
                    width: `${length}px`,
                    height: `${width}px`,

                    backgroundColor: color,

                    transformOrigin: "left",
                    transform: `rotate(${getRotAngle()}rad) scaleX(${getScale()}) `
                }}
            >
            </div>
    </>)
}

