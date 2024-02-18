const { response } = require("express");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
var cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const Redis = require("ioredis");
const { generateRandomCards } = require("./utils");
const redis = new Redis();

const server = http.createServer(app);
const io = socketIO(server);

const getLatestLeaderboard = async () => {
  const leaderboard = await redis.zrevrange("leaderboard", 0, -1, "WITHSCORES");
  const formatedLeaderboard = [];
  // formating into the required format
  for (let i = 0; i < leaderboard.length; i += 2) {
    const userName = leaderboard[i];
    const userScore = parseInt(leaderboard[i + 1]);
    formatedLeaderboard.push({ userName, userScore });
  }
  return formatedLeaderboard;
};

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("WebSocket connected");

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

// old: REST leader-board implementation
// app.get("/leader-board", async (req, res) => {
//   try {
//     const leaderboardLatest = await getLatestLeaderboard();
//     res.status(200).send(leaderboardLatest);
//   } catch (e) {
//     console.log(e);
//     throw ("Failed to fecth data", e);
//   }
// });

app.get("/game", async (req, res) => {
  try {
    const { userName } = req.query;

    // check if the memeber already exists
    let isMember = await redis.exists(userName);

    // intitate the game for the new user
    if (!isMember && userName) {
      // createUser = await redis.lpush("users", userName);
      const randomCards = generateRandomCards();
      await redis.hmset(
        userName,
        "score",
        0,
        "gameCards",
        JSON.stringify(randomCards),
        "hasDefuseCard",
        "false",
        "activeCard",
        null
      );
      redis.zadd("leaderboard", 0, userName);
    }

    let game = await redis.hgetall(userName);

    // emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).send({
      ...game,
      gameCards: JSON.parse(game.gameCards || "[]"),
    });
  } catch (e) {
    console.log(e);
    throw ("Failed to fecth data", e);
  }
});

app.put("/game", async (req, res) => {
  try {
    const { userName, hasDefuseCard, activeCard } = req.body;
    const score = req.body.score || 0;
    const gameCards = req.body.gameCards
      ? req.body.gameCards
      : generateRandomCards();
    insertGame = await redis.hmset(
      userName,
      "gameCards",
      JSON.stringify(gameCards),
      "hasDefuseCard",
      hasDefuseCard,
      "activeCard",
      activeCard,
      "score",
      score
    );
    // update the score of the user
    redis.zadd("leaderboard", score, userName);

    // emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).send({ ...req.body, gameCards, score });
  } catch (e) {
    console.log(e);
    throw ("Failed to fecth data", e);
  }
});

app.delete("/game", async (req, res) => {
  try {
    const { userName } = req.body;
    const emptyArray = [];
    insertGame = await redis.hmset(
      userName,
      "gameCards",
      emptyArray,
      "hasDefuseCard",
      "false",
      "activeCard",
      null
    );
    const score = redis.hget(userName, "score");
    redis.zadd("leaderboard", score, userName);

    // emit the latest leaderboard
    const leaderboardLatest = await getLatestLeaderboard();
    io.emit("leaderboardUpdate", leaderboardLatest);

    res.status(200).send("reset succesfull");
  } catch (e) {
    console.log(e);
    throw ("Failed to fecth data", e);
  }
});

server.listen(3000, () => {
  console.log("app is running on port 3000");
});
