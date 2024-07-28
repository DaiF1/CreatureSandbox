import {useState} from "react";

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

        if (mag > length * 1.5 + width)
            setFootLocation(targetPoint);

        return Math.atan2(dy, dx);
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
                    transform: `rotate(${getRotAngle()}rad)`
                }}
            >
            </div>
    </>)
}

