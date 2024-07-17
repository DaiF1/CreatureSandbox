import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus, faArrowRight, faBars} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [boneCount, setBoneCount] = useState<number>(5);
    const [showBones, setShowBones] = useState<boolean>(false);
    const [creatureColor, setCreatureColor] = useState("#B8DE2F");
    const [eyeRadius, setEyeRadius] = useState<number>(15);
    const [editMode, setEditMode] = useState<boolean>(false);

    const mobileRatio = window.innerWidth > 900;

    const [showConfig, setShowConfig] = useState<boolean>(mobileRatio);

    return (
        <div id="main-app">
            <header>
                <h1 id="helper-text">Drag the head to move the creature</h1>
            </header>

            <Creature boneCount={boneCount} showBones={showBones} color={creatureColor} eyeRadius={eyeRadius} editMode={editMode}></Creature>

            <div id="config-panel" style={
                mobileRatio ? 
                { marginRight: showConfig ? 0 : "calc(min(-20vw, -200pt) - 20pt)", /* 20vw of width and 10pt of padding */ }
                : { right: showConfig ? 0 : "calc(min(-20vw, -200pt) - 20pt)" }
            }>
                <button id="config-toggle" onClick={() => setShowConfig(!showConfig)}>
                    {showConfig ? <FontAwesomeIcon icon={faArrowRight} /> : <FontAwesomeIcon icon={faBars} /> }
                </button>
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
                    <p>{boneCount}</p>
                    <button onClick={() => setBoneCount(boneCount + 1)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <p>Eye Radius</p>
                <div className="config-option">
                    <button onClick={() => { if (eyeRadius > 1) setEyeRadius(eyeRadius - 1)}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <p>{eyeRadius}</p>
                    <button onClick={() => setEyeRadius(eyeRadius + 1)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                <div className="config-option">
                    <button id="edit-button" onClick={() => setEditMode(!editMode)}>{editMode ? "Stop editing" : "Edit the bones"}</button>
                </div>
            </div>
        </div>
    )
}

export default App