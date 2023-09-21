const fs = require("fs");

// Load the JSON data from the file
const filePath = "allPlayersDataFinal.json";

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the JSON file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const playerIds = new Map(); // Use a Map to track duplicate IDs and their count

    // Iterate through the players and modify duplicate IDs
    for (const player of jsonData.players) {
      const playerId = player.playerId;

      if (playerIds.has(playerId)) {
        // Subtract 100,000 from the duplicate player's ID
        const count = playerIds.get(playerId);
        player.playerId = (parseInt(playerId) - 100000 * count).toString();
        playerIds.set(playerId, count + 1);
      } else {
        // If it's the first occurrence, add it to the map
        playerIds.set(playerId, 1);
      }
    }

    // Save the modified data back to the file
    fs.writeFile(
      "allPlayersDataFinalModified.json",
      JSON.stringify(jsonData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing the modified JSON file:", err);
        } else {
          console.log("Modification complete.");
        }
      }
    );
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
  }
});
