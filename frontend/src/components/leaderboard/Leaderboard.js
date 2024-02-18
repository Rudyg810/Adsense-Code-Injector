import React from "react";
import { useSelector } from "react-redux";

function Leaderboard() {
  const users = useSelector((state) => state.leaderBoard?.userScores);
  const myUserName = useSelector((state) => state.gameState?.userName);

  return (
    <div style={{ flex: 1 }}>
      <h1 style={{ textAlign: "center" }}>Leaderboard</h1>
      {users &&
        users.map((user, index) => {
          const { userName, userScore } = user;
          return (
            <div
              style={{
                borderBottom: "2px solid",
                margin: "10px",
                padding: "3px",
                display: "flex",
                fontWeight: myUserName === userName ? "bold" : "",
                fontSize: myUserName === userName ? 18 : 14,
              }}
            >
              <div className="equi">{`#${index + 1}`} </div>
              <div className="equi">{userName} </div>
              <div className="equi">{userScore} </div>
            </div>
          );
        })}
    </div>
  );
}

export default Leaderboard;
