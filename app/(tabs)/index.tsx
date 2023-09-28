import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Load  JSON data from allPlayersDataFinal.json
import allPlayersData from "../../allPlayersDataFinalModified.json";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Helper function to shuffle an array randomly
function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex,
    temporaryValue;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Extract unique player names from JSON data
const playerNames = Array.from(
  new Set(allPlayersData.players.map((player) => player.name))
);

// Shuffle player names randomly
const shuffledPlayerNames = shuffleArray(playerNames);

// Filter players who have played for at least two seasons
const eligiblePlayers = shuffledPlayerNames.filter((name) => {
  const seasonsPlayed = new Set();
  allPlayersData.players.forEach((playerData) => {
    if (playerData.name === name) {
      seasonsPlayed.add(playerData.season);
    }
  });
  return seasonsPlayed.size >= 10;
});

// Assign shuffled player names as labels for rows and columns
// let rowLabels = eligiblePlayers.slice(0, 3);
// let columnLabels = eligiblePlayers.slice(3, 6); // Use the next 3 names for columns

let rowLabels = ["Connor McDavid", ...eligiblePlayers.slice(1, 3)];
let columnLabels = ["Leon Draisaitl", ...eligiblePlayers.slice(4, 6)]; // Use the next 3 names for columns

export default function TabOneScreen() {
  const [cellContents, setCellContents] = useState(Array(9).fill(""));
  const [modalVisible, setModalVisible] = useState(Array(9).fill(false));
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState(""); // Add searchTerm state
  const [searchResults, setSearchResults] = useState({}); // Add searchResults state
  const [cellCorrectness, setCellCorrectness] = useState(Array(9).fill(false));
  const [score, setScore] = useState(20); // Initialize the score

  // Reset function to reset the game state and shuffle labels
  const handleReset = () => {
    // Shuffle player names again to get new labels
    const shuffledPlayerNames = shuffleArray(playerNames);

    // Update rowLabels and columnLabels with new shuffled labels
    const newRowLabels = ["Connor McDavid", ...shuffledPlayerNames.slice(1, 3)];
    const newColumnLabels = [
      "Leon Draisaitl",
      ...shuffledPlayerNames.slice(4, 6),
    ];

    // Reset the game state
    setScore(20);
    setCellContents(Array(9).fill(""));
    setCellCorrectness(Array(9).fill(false));
    setModalVisible(Array(9).fill(false));

    // Update the label state with the new shuffled labels
    rowLabels = newRowLabels;
    columnLabels = newColumnLabels;
  };

  const handleSearch = (index, text) => {
    // Update the cellContents state
    const updatedContents = [...cellContents];
    updatedContents[index] = text;
    setCellContents(updatedContents);

    setSearchTerm(text);

    // Implement your search logic here
    const results = allPlayersData.players.filter((player) =>
      player.name.toLowerCase().includes(text.toLowerCase())
    );

    console.log("Search term:", text);

    // Limit the number of results to 20
    const limitedResults = results.slice(0, 20);

    const uniqueLimitedResults = Array.from(
      new Map(limitedResults.map((player) => [player.name, player])).values()
    );
    // Update the searchResults state for the specific cell
    setSearchResults((prevResults) => ({
      ...prevResults,
      [index]: uniqueLimitedResults,
    }));
  };

  const renderGridCell = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.gridCell,
          cellCorrectness[index] ? styles.gridCellCorrect : null,
        ]}
        onPress={() => handleCellPress(index)}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible[index]}
          onRequestClose={() => handleModalClose(index)}
        >
          <TouchableWithoutFeedback onPress={() => handleModalClose(index)}>
            <View style={styles.modalBackground}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalContainer}>
                  <TextInput
                    value={cellContents[index]}
                    onChangeText={(text) => handleSearch(index, text)}
                    style={styles.modalTextInput}
                    placeholder={`Cell ${index + 1}`}
                    placeholderTextColor="#aaa"
                  />
                  {/* Explicit dimensions for the FlatList */}
                  <View style={{ height: 200, width: "100%" }}>
                    <FlatList
                      data={searchResults[index] || []}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handlePlayerSelect(index, item)}
                        >
                          <Text>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.playerId}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => handleModalClose(index)}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </TouchableOpacity>
    );
  };

  const handleCellPress = (index: number) => {
    // Check if the cell is already correct, and if so, prevent opening the modal
    if (cellCorrectness[index]) {
      return;
    }

    setModalVisible((prev) =>
      prev.map((visible, i) => (i === index ? !visible : visible))
    );
    setActiveIndex(index);
  };

  const handleModalClose = (index: number) => {
    setModalVisible((prev) =>
      prev.map((visible, i) => (i === index ? false : visible))
    );
    setActiveIndex(-1);
  };

  const handlePlayerSelect = (index, player) => {
    const rowIndex = Math.floor(index / 3); // Assuming there are 3 cells in each row
    const columnIndex = index % 3; // Assuming there are 3 cells in each column

    // Access the row and column labels using these indices
    const selectedRowName = rowLabels[rowIndex];
    const selectedColumnName = columnLabels[columnIndex];

    // Now we have the row and column index, which we can use as needed
    console.log(
      `Selected cell: Row ${selectedRowName}, Column ${selectedColumnName}`
    );

    const playerName = player.name;
    let dataBank = {};

    // Initialize the arrays with the player names as keys
    dataBank[playerName] = [];
    dataBank[selectedRowName] = [];
    dataBank[selectedColumnName] = [];

    // Iterate through all players in the JSON data
    allPlayersData.players.forEach((playerData) => {
      if (playerData.name === playerName) {
        dataBank[playerName].push({
          season: playerData.season,
          team: playerData.team,
        });
      }
      if (playerData.name === selectedRowName) {
        dataBank[selectedRowName].push({
          season: playerData.season,
          team: playerData.team,
        });
      }
      if (playerData.name === selectedColumnName) {
        dataBank[selectedColumnName].push({
          season: playerData.season,
          team: playerData.team,
        });
      }
    });

    console.log(dataBank);

    // Check if playerName played for the same team in the same season as selectedRowName
    const playerSeasons = dataBank[playerName];
    const rowPlayerSeasons = dataBank[selectedRowName];
    const columnPlayerSeasons = dataBank[selectedColumnName];

    const playedWithRowPlayer = playerSeasons.some((playerSeason) =>
      rowPlayerSeasons.some(
        (rowSeason) =>
          rowSeason.season === playerSeason.season &&
          rowSeason.team === playerSeason.team
      )
    );

    const playedWithColumnPlayer = playerSeasons.some((playerSeason) =>
      columnPlayerSeasons.some(
        (columnSeason) =>
          columnSeason.season === playerSeason.season &&
          columnSeason.team === playerSeason.team
      )
    );

    const havePlayedTogether = playedWithRowPlayer && playedWithColumnPlayer;

    console.log(`Players have played together: ${havePlayedTogether}`);

    // Deduct one point from the score for a false guess
    if (!havePlayedTogether) {
      setScore(score - 1);
    }

    // Update cell correctness based on the guess
    setCellCorrectness((prevCorrectness) => {
      const newCorrectness = [...prevCorrectness];
      newCorrectness[index] = havePlayedTogether;
      return newCorrectness;
    });
  };

  return (
    <View style={styles.container}>
      {/* Display the score above the entire grid */}
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
      <View style={styles.columnLabels}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}></Text>
        </View>
        {columnLabels.map((label, index) => (
          <View style={styles.labelContainer} key={index}>
            <Text style={styles.label}>{label}</Text>
          </View>
        ))}
      </View>
      {rowLabels.map((rowLabel, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>{rowLabel}</Text>
          </View>
          {[0, 1, 2].map((cellIndex) =>
            renderGridCell(rowIndex * 3 + cellIndex)
          )}
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  columnLabels: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 30,
  },
  labelContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    width: 80,
  },
  label: {
    fontSize: screenWidth > 400 ? 16 : 12, // Adjust the threshold as needed
    fontWeight: "bold",
    color: "white",
  },
  rowLabelContainer: {
    width: 100, // Set the width of the label container
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: screenWidth > 400 ? 16 : 12, // Adjust the threshold as needed
    fontWeight: "bold",
    color: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  gridCell: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    backgroundColor: "#3498db",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderWidth: 2,
    borderColor: "#2980b9",
  },
  gridCellCorrect: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    backgroundColor: "#00FF00",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderWidth: 2,
    borderColor: "#2980b9",
  },
  gridCellInput: {
    textAlign: "center",
    fontSize: screenWidth > 400 ? 16 : 12, // Adjust the threshold as needed,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTextInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalCloseButton: {
    width: "100%",
    backgroundColor: "#3498db",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  shuffleButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  shuffleButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  // Add a new style for the score container
  scoreContainer: {
    position: "absolute",
    top: 0, // Position at the top
    right: 0, // Position at the left
    backgroundColor: "#3498db", // Choose a color for the reset button
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  score: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
  },

  // Style for the reset button container
  resetButton: {
    position: "absolute",
    top: 0, // Position at the top
    left: 0, // Position at the left
    backgroundColor: "#e74c3c", // Choose a color for the reset button
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  // Style for the reset button text
  resetButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
