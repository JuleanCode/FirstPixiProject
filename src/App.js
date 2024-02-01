import React, {createContext, useContext, useEffect, useState} from 'react';
import Meter from "./Meter";
import Grid from "./Grid";
import {Stage} from "./Stage";
import {Socket} from "./Socket";
import {newUUID} from "./Socket";
import VolumeProvider from "./VolumeProvider";

export const screenWidth = 800;
export const screenHeight = 600;
export const webSocketURL = "ws://127.0.0.1:6969"


function App() {
    const [players, setPlayers] = useState([]);
    const addPlayer = (uuid, x, y) => {
        const playerExists = players.some(player => player.key === uuid);
        if (!playerExists && uuid !== newUUID) {
            const newPlayer = { key: uuid, x: x, y: y };
            setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
            console.log("Player added:", newPlayer);

        }
    };
    const removePlayer = (uuid) => {
        setPlayers(players.filter(player => player.key !== uuid));
    };
    return (
        <div>
            <Socket addPlayer={addPlayer} removePlayer={removePlayer}/>
            <VolumeProvider>
                <Meter/>
                <Stage width={screenWidth} height={screenHeight} renderOnComponentChange={true}
                           options={{backgroundColor: 0x1099bb}}>
                        <Grid screenWidth={screenWidth} screenHeight={screenHeight} players={players} setPlayers={setPlayers}
                        />
                </Stage>
            </VolumeProvider>
        </div>

    );
}

export default App;