import "./App.css";
import { useSelector } from "react-redux";
import io from "socket.io-client";

import { useEffect } from "react";
import Leaderboard from "./components/leaderboard/Leaderboard";
import { useActions } from "./hooks/useActions";
import Game from "./components/game/Game";
import { baseURL } from "./apis/endpoints";

function App() {
  const userName = useSelector((state) => state.gameState?.userName);
  const cards = useSelector((state) => state.gameState?.gameCards);
  const { requestGameState, updateLeaderboard, setUserName } = useActions();
  const socket = io(baseURL, { transports: ["websocket"] });

  useEffect(() => {
    // prompt to enter userName
    const enterName = () => {
      if (!userName) {
        let name = prompt("enter your name!");
        setUserName(name);
        return name;
      }
    };
    // fetch the game state of the user
    requestGameState({ userName: enterName() });

    // Listen for leaderboard updates
    socket.on("leaderboardUpdate", (leaderboard) => {
      console.log("Leaderboard updated:", leaderboard);
      updateLeaderboard(leaderboard);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log("cards", cards);

  return (
    <>
      <div className="container" style={{ display: "flex" }}>
        <Game />
        <Leaderboard />
      </div>
    </>
  );
}
export default App;
