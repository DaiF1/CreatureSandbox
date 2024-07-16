import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [boneCount, setBoneCount] = useState<number>(1);

    return (
        <div id="main-app">
            <header>
                <h2 id="helper-text">Drag the red dot to move the creature</h2>
            </header>

            <Creature boneCount={boneCount}></Creature>

            <div id="config-panel">
                <h3>Control Panel</h3>

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
