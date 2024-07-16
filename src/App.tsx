import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [boneCount, setBoneCount] = useState<number>(1);

    return (
        <>
        <Creature boneCount={boneCount}></Creature>

        <div id="config-panel">
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
        </>
    )
}

export default App
