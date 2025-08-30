const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8083 });

// Container to store connected players' data, including their individual baseCoordinates
const connectedPlayers = {};
var uniqueArray = [];
let players = []; // Store player data
// Initialize playerWithHighestPercentage variable
let playerWithHighestPercentage = null;

// Set up an interval to send the time message every second
let timerInterval;
// Set up a variable to hold the remaining time
let remainingTime = 30;

const colors = [
  { rgba: "rgba(255, 0, 0, 0.5)", hex: "#FF0000" }, // Red
  { rgba: "rgba(0, 255, 0, 0.5)", hex: "#00FF00" }, // Green
  { rgba: "rgba(0, 0, 255, 0.5)", hex: "#0000FF" }, // Blue
];

wss.on("connection", function connection(ws) {
  console.log("A new player connected!");

  // Assign a unique ID to each connected WebSocket
  ws.id = Math.random().toString(36).substring(7);

  // Send the ID to the connected client
  ws.send(JSON.stringify({ type: "playerId", id: ws.id }));

  // Send the list of connected players to the newly connected client
  ws.send(JSON.stringify({ type: "connectedPlayers", data: connectedPlayers }));

  // If it's the first player connecting, start the timer interval
  if (wss.clients.size === 1) {
    startTimerInterval();
  }

  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);
      if (data.type === "spawn") {
        // Generate a random color index
        const colorIndex = Math.floor(Math.random() * colors.length);
        // Initialize baseCoordinates for the new player
        const baseCoordinates = [];
        // Update connected players container with spawn position, color, and baseCoordinates
        connectedPlayers[ws.id] = {
          x: data.spawnX,
          y: data.spawnY,
          color: colors[colorIndex],
          baseCoordinates: baseCoordinates, // Each player has their own baseCoordinates array
          id: ws.id,
        };
        // Broadcast updated list of connected players to all clients
        broadcastConnectedPlayers();
      } else if (data.type === "updateBaseCoordinates") {
        // Ensure the player exists in connectedPlayers before updating baseCoordinates
        if (connectedPlayers[data.id]) {
          // Update base coordinates for the player with the specified id
          connectedPlayers[data.id].baseCoordinates = data.data;
          // Broadcast updated list of connected players to all clients
          broadcastConnectedPlayers();
        } else {
          console.error("Player not found:", data.id);
        }
      } else if (data.type === "uniqueArray") {
        // Handle the received uniqueArray
        uniqueArray = data.data;
        handleUniqueArray(data.data);
      } else if (data.type === "updateRectPosition") {
        // Handle updateRectPosition message
        if (connectedPlayers[data.id]) {
          // Update the player's position based on the received grid coordinates
          connectedPlayers[data.id].x = data.x * 50;
          connectedPlayers[data.id].y = data.y * 50;

          // Check if the player's position matches any value in the uniqueArray
          const playerPosition = `${data.x},${data.y}`;
          var slicedArray = uniqueArray.slice(0, uniqueArray.length - 5);
          if (slicedArray.includes(playerPosition)) {
            // If the player's position is in the uniqueArray, send a playerDisconnected message
            ws.send(JSON.stringify({ type: "disconnectPlayer" }));
            // Close the websocket connection
            //ws.close();
            return; // Exit the function early to prevent broadcasting connectedPlayers
          }

          // Broadcast updated list of connected players to all clients
          broadcastConnectedPlayers();
        } else {
          console.error("Player not found:", data.id);
        }
      } else if (data.type === "playerPercentage") {
        // Extract player ID and percentage from the received data
        const { playerId, percentage } = data;
        // Store player data
        players.push({ id: playerId, percentage: percentage });
      } else if (data.type === "updateRemainingTime") {
        remainingTime = parseInt(data.roundLength);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  // Modify the close event handler to broadcast the disconnected player's ID
  ws.on("close", function close() {
    playerWithHighestPercentage = null;
    players = [];
    // Remove the disconnected player from the connectedPlayers array
    delete connectedPlayers[ws.id];
    // Broadcast updated list of connected players to all clients
    broadcastConnectedPlayers();
    console.log("Player disconnected!");
    // Broadcast the disconnected player's ID
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "playerDisconnected", id: ws.id }));
      }
    });
    // If there are no more clients, stop the timer interval
    if (wss.clients.size === 0) {
      stopTimerInterval();
      remainingTime = 30;
    }
  });
  /* // Start the timer interval when the first client connects
  if (wss.clients.size === 1) {
    timerInterval = setInterval(sendTimeToClients, 1000);
  }*/
});

// Function to broadcast the list of connected players to all clients
function broadcastConnectedPlayers() {
  const message = JSON.stringify({
    type: "connectedPlayers",
    data: connectedPlayers,
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to handle the end of the timer
function handleTimerEnd() {
  // Send the player with the highest percentage back to the client side
  const message = JSON.stringify({
    type: "playerWithHighestPercentage",
    data: playerWithHighestPercentage,
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to handle the received uniqueArray
function handleUniqueArray(array) {
  // You can broadcast the uniqueArray to all connected players if needed
  const message = JSON.stringify({
    type: "uniqueArray",
    data: array,
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Define a function to send the current time to all connected clients
function sendTimeToClients() {
  const currentTime = new Date().toLocaleTimeString();
  const message = JSON.stringify({
    type: "timer",
    time: currentTime,
  });
  // Send the time message to all connected clients
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to start the timer interval
function startTimerInterval() {
  // Set up an interval to update the remaining time every second
  timerInterval = setInterval(() => {
    remainingTime--;
    // Broadcast the remaining time to all connected clients
    broadcastRemainingTime();
    // If the timer reaches 0, reset it to 60 seconds
    if (remainingTime === 0) {
      console.log(players);
      // handleTimerEnd();
      playerWithHighestPercentage = findPlayerWithHighestPercentage();
      if (playerWithHighestPercentage) {
        // Send the player with the highest percentage to all connected clients
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "playerWithHighestPercentage",
                data: playerWithHighestPercentage,
              })
            );
          }
        });
      }

      remainingTime = 30;
      stopTimerInterval();
    }
  }, 1000);
}

// Function to stop the timer interval
function stopTimerInterval() {
  clearInterval(timerInterval);
  timerInterval = null; // Set timerInterval to null to indicate that the timer is stopped
}

// Function to broadcast the remaining time to all connected clients
function broadcastRemainingTime() {
  const message = JSON.stringify({
    type: "timer",
    remainingTime: remainingTime,
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Function to find the player with the highest percentage
function findPlayerWithHighestPercentage() {
  // Sort players by percentage in descending order
  players.sort((a, b) => b.percentage - a.percentage);
  // Return player with the highest percentage
  return players[0];
}
