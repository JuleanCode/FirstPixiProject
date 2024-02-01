import React, {useEffect, useState} from 'react';
import {Sprite} from "@pixi/react";
import {GRID_SIZE} from "./Grid";
import {webSocketURL} from "./App";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {newUUID} from "./Socket";

const PLAYER_IMAGE = 'sprite/player.png';
const PLAYER_SPEAKING_IMAGE = 'sprite/player_speaking.png';

const Player = ({uuid, player_x, player_y}) => {
    let [playerPosition, setPlayerPosition] = useState({x: player_x, y: player_y});
    let [playerUUID, setPlayerUUID] = useState(uuid);
    let [playerImage, setPlayerImage] = useState(PLAYER_IMAGE)
    let [playerSpeaking, setPlayerSpeaking] = useState(false);
    const {lastMessage} = useWebSocket(webSocketURL, {share: true});
    useEffect(() => {
        if (lastMessage !== null) {
            const splitEventData = lastMessage.data.split(',');
            const receivedUUID = splitEventData[1];
            if(receivedUUID === playerUUID) {
                const command = splitEventData[0];
                const posX = splitEventData[2];
                const posY = splitEventData[3];
                const speaking = splitEventData[4];
                if (command === 'P') {
                    console.log(`Updating player position with UUID ${receivedUUID}`)
                    setPlayerPosition({x: posX, y: posY});
                    console.log(`player speaking ${speaking}`)
                    setPlayerSpeaking(speaking === '1')
                }
            }
        }
    }, [lastMessage]);

    useEffect(() => {
        console.log("setting remote player image")
        if(playerSpeaking) {
            console.log("setting remote player speaking image")
            setPlayerImage(PLAYER_SPEAKING_IMAGE)
        }
        else {
            console.log("setting remote player non speaking image")
            setPlayerImage(PLAYER_IMAGE)
        }
    },[playerSpeaking])

    return <Sprite
        key={playerUUID}
        image={playerImage}
        x={playerPosition.x}
        y={playerPosition.y}
        width={GRID_SIZE}
        height={GRID_SIZE}
    />;
};
export default Player;
