import { useSelector } from "react-redux";
import { useActions } from "../../hooks/useActions";

const Game = (props) => {
  const userName = useSelector((state) => state.gameState?.userName);
  const cards = useSelector((state) => state.gameState?.gameCards);
  const isPending = useSelector((state) => state.gameState?.isPending);
  const score = useSelector((state) => state.gameState?.score);
  const hasDefuseCard = useSelector((state) => state.gameState?.hasDefuseCard);
  const activeCard = useSelector((state) => state.gameState?.activeCard);
  const { putGameState } = useActions();
  let left = 0;
  let top = 0;

  const checkCard = () => {
    const obj = {
      userName: userName,
      activeCard: activeCard,
      hasDefuseCard: hasDefuseCard,
      isPending: isPending,
      gameCards: cards,
      score: score,
    };
    let openedCard = cards.pop();
    let isCompleted = true;
    obj.activeCard = openedCard;
    // obj.gameCards = cards;

    // handle each card based on the character
    if (openedCard === "Defuse card 🙅‍♂️") obj.hasDefuseCard = true;
    else if (openedCard === "Shuffle card 🔀") {
      obj.gameCards = null;
      obj.hasDefuseCard = false;
      isCompleted = false;
    } else if (openedCard === "Exploding kitten card 💣") {
      isCompleted = false;
      // doesn't have defused card
      if (!obj.hasDefuseCard) {
        confirmation();

        function confirmation() {
          if (
            window.confirm(
              `game over!, you lost the game!, your score is ${obj.score} \n Do you want to play new game`
            )
          ) {
            obj.gameCards = null;
          }
        }
      } else {
        // had defused card, so can use it for explode card
        obj.hasDefuseCard = false;
      }
    }

    // incrementing the score.
    if (
      isCompleted &&
      (obj.gameCards?.length === 0 || obj.gameCards === null)
    ) {
      obj.score = parseInt(obj.score) + 1;
      confirmation();
      function confirmation() {
        if (
          window.confirm(
            `You won the game!!!, your score is ${obj.score} \n Do you want to play new game`
          )
        ) {
          obj.gameCards = null;
        }
      }
    }
    // update the score on database
    putGameState(obj);
  };
  return (
    <div style={{ flex: 2 }}>
      <h1 style={{ textAlign: "center" }}>😸 Exploding Kitten</h1>
      {cards?.length > 0 ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              <h3>Tap on the deck to reveal the card</h3>
              <div
                style={{ position: "relative", top: "30px" }}
                onClick={checkCard}
              >
                {cards?.length !== 0 &&
                  cards?.map((card) => {
                    left = left + 10;
                    top = top + 10;
                    return (
                      <div>
                        <div
                          style={{
                            height: "100px",
                            width: "100px",
                            position: "absolute",
                            left: `${left}px`,
                            top: `${top}px`,
                            backgroundColor: "black",
                          }}
                        >
                          {card}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          {activeCard ? (
            <h1 style={{ marginTop: "300px", textAlign: "center" }}>
              Active Card: {activeCard}
            </h1>
          ) : (
            <h1 style={{ marginTop: "300px", textAlign: "center" }}>---</h1>
          )}
        </>
      ) : (
        <span>loading new game...</span>
      )}

      {score ? (
        <h1 style={{ marginTop: "100px", textAlign: "center" }}>
          score: {score}
        </h1>
      ) : (
        <h1 style={{ marginTop: "100px", textAlign: "center" }}>score: ---</h1>
      )}
    </div>
  );
};

export default Game;
