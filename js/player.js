import { player, player_list, createPlayer } from "./game.js"

export const UUID = generateUUID();
console.log('Generated UUID:', UUID);
export let socket = new WebSocket("ws://192.168.43.164:6969");

// Event listener for when the connection is opened
socket.addEventListener("open", (event) => {
    const initialMessage = "N," + UUID + "," + player.x + "," + player.y;  // 'C' might indicate a connection request
    console.log("Connected with UUID " + UUID );
    // Send an initial message to the server upon connection
    console.log(`Send to server: ${initialMessage}`);
    socket.send(initialMessage);
});

// Event listener for when a message is received from the server
socket.addEventListener("message", (event) => {
    console.log(`Received: ${event.data}`);
    let split_event_data = event.data.split(",")
    let command = split_event_data[0]
    let uuid = split_event_data[1]
    if(command === "N") {
        console.log(`Received New GUID: ${event.data}`);
        let pos_x = split_event_data[2]
        let pos_y = split_event_data[3]
        if(uuid !== UUID) {
            createPlayer(uuid, pos_x, pos_y)
            console.log(player_list)
        }
    }
    else if (command === "P") {
        console.log(`Received New Position: ${event.data}`);
        let pos_x = split_event_data[2]
        let pos_y = split_event_data[3]
        player_list[uuid].x = pos_x
        player_list[uuid].y = pos_y
    }



    // Display the received message on the screen
    const receivedMessage = event.data;
    // Append the message to an HTML element with the id "message-container"
    document.getElementById("message-container").innerHTML += `<p>${receivedMessage}</p>`;
});

// Event listener for when the connection is closed
socket.addEventListener("close", (event) => {
    console.log("Connection closed");
});

function generateUUID() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isValidGUIDFormat(inputString) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return guidRegex.test(inputString);
}