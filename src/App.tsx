import {useState} from 'react';
import './App.css'
import {Creature} from './Creature'

function App() {
    const [boneCount, setBoneCount] = useState<number>(1);

    return (
        <>
        <Creature boneCount={boneCount}></Creature>
        </>
    )
}

export default App
