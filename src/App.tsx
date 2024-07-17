import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus, faArrowRight, faBars, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {NodeProps} from './ArmatureNode';

export interface NodeUpdater {
    node: NodeProps,
    updateRadius: (radius: number) => void,
}

function App() {
    const [boneCount, setBoneCount] = useState<number>(5);
    const [showBones, setShowBones] = useState<boolean>(false);
    const [creatureColor, setCreatureColor] = useState<string>("#B8DE2F");
    const [eyeRadius, setEyeRadius] = useState<number>(15);

    const [editMode, setEditMode] = useState<boolean>(false);
    const [updater, setUpdater] = useState<NodeUpdater>({node: {x: 0, y: 0, radius: 0}, updateRadius: () => {}})

    const mobileRatio = window.innerWidth > 900;
    const configIcon = mobileRatio ? faArrowRight : faArrowDown;

    const [showConfig, setShowConfig] = useState<boolean>(mobileRatio);

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
                onSelect={(updater) => { setUpdater(updater) }}>
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

                <div className="config-option">
                    <button id="edit-button" onClick={() => setEditMode(!editMode)}>{editMode ? "Stop editing" : "Edit the bones"}</button>
                </div>

                {
                    editMode ? 
                    <>
                    <h2>Bone Parameters</h2>
                    <p>Body width</p>
                    <div className="config-option">
                        <input id="body-input"
                            type="number"
                            value={updater.node.radius}
                            onChange={e => {
                                updater.updateRadius(Number(e.target.value));
                                setUpdater({ ...updater, node: { ...updater.node, radius: Number(e.target.value) } });
                        }}></input>
                        <input id="body-slider"
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
                    </>
                    : null
                }
            </div>
            </div>
        </div>
    )
}

export default App
