import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [boneCount, setBoneCount] = useState<number>(1);
    const [showBones, setShowBones] = useState<boolean>(false);
    const [creatureColor, setCreatureColor] = useState("#B8DE2F");

    return (
        <div id="main-app">
            <header>
                <h2 id="helper-text">Drag the head to move the creature</h2>
            </header>

            <Creature boneCount={boneCount} showBones={showBones} color={creatureColor}></Creature>

            <div id="config-panel">
                <h3>Control Panel</h3>

                <label htmlFor="show-bones-input">Display bones: </label>
                <input id="show-bones-input" type="checkbox" checked={showBones} onChange={e => {
                    setShowBones(e.target.checked);
                }}></input>

                <p>Creature color</p>
                <input id="creature-color-input" type="color" value={creatureColor} onChange={e => {
                    setCreatureColor(e.target.value);
                }}></input>

                <p>Bone Count</p>
                <div className="config-option">
                    <button onClick={() => setBoneCount(boneCount + 1)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <p>{boneCount}</p>
                    <button onClick={() => { if (boneCount > 1) setBoneCount(boneCount - 1)}}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
