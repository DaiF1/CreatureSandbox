import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus, faArrowRight, faBars, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {NodeProps} from './ArmatureNode';

export interface NodeUpdater {
    node: NodeProps,
    updateRadius: (radius: number) => void,
    updateLegs: (state: boolean) => void,
};

export interface ResetMethods {
    position: () => void,
};

function App() {
    const [boneCount, setBoneCount] = useState<number>(5);
    const [showBones, setShowBones] = useState<boolean>(false);
    const [creatureColor, setCreatureColor] = useState<string>("#B8DE2F");
    const [eyeRadius, setEyeRadius] = useState<number>(15);

    const [legLength, setLegLength] = useState<number>(35);
    const [legWidth, setLegWidth] = useState<number>(15);

    const [editMode, setEditMode] = useState<boolean>(false);
    const [updater, setUpdater] = useState<NodeUpdater>({node: {
        x: 0,
        y: 0,
        radius: 0,
        dirX: 0,
        dirY: 0,
        hasLegs: false,
    }, updateRadius: () => {}, updateLegs: () => {}})
    const [resetMethods, setResetMethods] = useState<ResetMethods>({position: () => {}})

    const mobileRatio = window.innerWidth > 900;
    const configIcon = mobileRatio ? faArrowRight : faArrowDown;

    const [showConfig, setShowConfig] = useState<boolean>(true);

    return (
        <div id="main-app">
            <header>
                <h1 id="helper-text">Drag the head to move the creature</h1>
            </header>

            <Creature boneCount={boneCount}
                showBones={showBones || editMode}
                color={creatureColor}
                eyeRadius={eyeRadius}
                editMode={editMode}
                onSelect={(updater) => { setUpdater(updater) }}
                defineReset={(reset) => setResetMethods(reset)}
                legLength={legLength}
                legWidth={legWidth}
                >
            </Creature>

            <div id="config-panel" style={
                mobileRatio ? 
                { marginRight: showConfig ? 0 : "calc(min(-20vw, -200pt) - 20pt)", /* 20vw of width and 10pt of padding */ }
                : { top: showConfig ? "calc(60% + 20pt)" : "100%" }
            }>
                <button id="config-toggle" onClick={() => setShowConfig(!showConfig)}>
                    {showConfig ? <FontAwesomeIcon icon={configIcon} /> : <FontAwesomeIcon icon={faBars} /> }
                </button>
                <div id="config-panel-content">

                <h2>Creature Parameters</h2>

                <div className="config-option">
                <button id="reset-pos-button" onClick={() => resetMethods.position()}>Reset Position</button>
                </div>

                <label htmlFor="show-bones-input">Display bones: </label>
                <input id="show-bones-input" type="checkbox" checked={showBones} onChange={e => {
                    setShowBones(e.target.checked);
                }}></input>

                <p>Creature color</p>
                <div className="config-option">
                    <input id="creature-color-input" type="color" value={creatureColor} onChange={e => {
                        setCreatureColor(e.target.value);
                    }}></input>
                </div>

                <p>Bone Count</p>
                <div className="config-option">
                    <button onClick={() => { if (boneCount > 1) setBoneCount(boneCount - 1)}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input type="number"
                        value={boneCount}
                        onChange={e => {
                            setBoneCount(Number(e.target.value));
                    }}></input>
                    <button onClick={() => setBoneCount(boneCount + 1)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <p>Eye Radius</p>
                <div className="config-option">
                    <button onClick={() => { if (eyeRadius > 1) setEyeRadius(eyeRadius - 1)}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input type="number"
                        value={eyeRadius}
                        onChange={e => {
                            setEyeRadius(Number(e.target.value));
                    }}></input>
                    <button onClick={() => setEyeRadius(eyeRadius + 1)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <p>Leg length</p>
                <div className="config-option">
                    <input className="config-slider-input"
                        type="number"
                        value={legLength}
                        onChange={e => {
                            setLegLength(Math.max(Number(e.target.value), legWidth * 2));
                    }}></input>
                    <input className="config-slider"
                        type="range"
                        min={legWidth * 2}
                        max={200}
                        value={legLength}
                        onChange={(e) => {
                            setLegLength(Number(e.target.value));
                        }}>
                    </input>
                </div>

                <p>Leg Width</p>
                <div className="config-option">
                    <input className="config-slider-input"
                        type="number"
                        value={legWidth}
                        onChange={e => {
                            let width = Number(e.target.value);
                            setLegWidth(Math.max(width, 1));
                            setLegLength(Math.max(legLength, width * 2));
                    }}></input>
                    <input className="config-slider"
                        type="range"
                        min={1}
                        max={30}
                        value={legWidth}
                        onChange={(e) => {
                            let width = Number(e.target.value);
                            setLegWidth(width);
                            setLegLength(Math.max(legLength, width * 2));
                        }}>
                    </input>
                </div>

                <div className="config-option">
                    <button id="edit-button" onClick={() => setEditMode(!editMode)}>{editMode ? "Stop editing" : "Edit the bones"}</button>
                </div>

                {
                    editMode ? 
                    <>
                    <h2>Bone Parameters</h2>
                    <p>Body width</p>
                    <div className="config-option">
                        <input className="config-slider-input"
                            type="number"
                            value={updater.node.radius}
                            onChange={e => {
                                updater.updateRadius(Number(e.target.value));
                                setUpdater({ ...updater, node: { ...updater.node, radius: Number(e.target.value) } });
                        }}></input>
                        <input className="config-slider"
                            type="range"
                            min={10}
                            max={200}
                            value={updater.node.radius}
                            onChange={(e) => {
                                updater.updateRadius(Number(e.target.value));
                                setUpdater({ ...updater, node: { ...updater.node, radius: Number(e.target.value) } });
                            }}>
                        </input>
                    </div>

                    <label htmlFor="has-legs-input">Has legs: </label>
                    <input id="has-legs-input" type="checkbox" checked={updater.node.hasLegs} onChange={e => {
                        updater.updateLegs(e.target.checked);
                        setUpdater({ ...updater, node: { ...updater.node, hasLegs: e.target.checked } });
                    }}></input>
                    </>
                    : null
                }
            </div>
            </div>
        </div>
    )
}

export default App
