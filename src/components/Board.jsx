import { useState, useEffect } from "react";
import QuitPopup from "./QuitPopup";
import boardAsset from "../assets/board.svg";

export default function Board({ players }) {
  const [number, setNumber] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [turn, setTurn] = useState(() => {
    const storedTurn = JSON.parse(localStorage.getItem("turn"));
    if (storedTurn && storedTurn !== 1) {
      return storedTurn;
    }
    return 1;
  });

  const [positions, setPositions] = useState(() => {
    const storedPositions = JSON.parse(localStorage.getItem("positions"));
    if (
      storedPositions &&
      Array.isArray(storedPositions) &&
      !storedPositions.every((val) => val === 0)
    ) {
      return storedPositions;
    }
    return Array(players).fill(0);
  });

  const [previousPositions, setPreviousPositions] = useState(
    Array(players).fill(0),
  );

  const [eventMessage, setEventMessage] = useState("");
  const [taskPlayers, setTaskPlayers] = useState({});
  const [winner, setWinner] = useState(null);
  const [stayPlayers, setStayPlayers] = useState([]);

  const playerColors = [
    "bg-gradient-to-r from-blue-500 to-blue-600",
    "bg-gradient-to-r from-green-500 to-green-600",
    "bg-gradient-to-r from-orange-500 to-orange-600",
    "bg-gradient-to-r from-purple-500 to-purple-600",
  ];

  const [showPopup, setShowPopup] = useState(false);

  const ladders = {
    10: 38,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  const snakes = {
    16: 6,
    49: 30,
    56: 53,
    64: 60,
    87: 24,
    95: 75,
    98: 90,
  };

  const tasks = [
    3, 7, 9, 5, 12, 19, 24, 30, 34, 40, 44, 50, 59, 53, 67, 76, 73, 81, 84, 89,
    93, 96, 99,
  ];

  useEffect(() => {
    localStorage.setItem("positions", JSON.stringify(positions));
    localStorage.setItem("turn", JSON.stringify(turn));
  }, [positions]);

  const rollDice = () => {
    if (rolling || showButtons) return;

    if (stayPlayers.includes(turn)) {
      setEventMessage("You Miss Your Turn!");
      setTimeout(() => {
        setEventMessage("");
        setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
      }, 1500);
      return;
    }
    setRolling(true);
    setShowButtons(false);
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      setNumber(randomNumber);
      setRolling(false);
      setShowButtons(true);
    }, 700);
    setEventMessage("");
  };

  const handleMove = () => {
    if (stayPlayers.includes(turn)) {
      setStayPlayers((prevStayPlayers) =>
        prevStayPlayers.filter((player) => player !== turn),
      );

      setShowButtons(false);
      setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
      return;
    }
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const currentPos = newPositions[turn - 1];
      const potentialNewPosition = currentPos + number;
      let event = "";
      if (potentialNewPosition <= 100) {
        let finalPosition = potentialNewPosition;
        if (ladders[finalPosition]) {
          finalPosition = ladders[finalPosition];
          event = "LADDER!";
        } else if (snakes[finalPosition]) {
          finalPosition = snakes[finalPosition];
          event = "SNAKE!";
        }
        if (!tasks.includes(finalPosition)) {
          setTaskPlayers((prev) => {
            const updated = { ...prev };
            delete updated[turn];
            return updated;
          });
        }
        newPositions[turn - 1] = finalPosition;
        if (finalPosition === 100) {
          setWinner(turn);
        }
        if (tasks.includes(finalPosition)) {
          setTaskPlayers((prev) => {
            const updated = { ...prev };
            updated[turn] = true;
            return updated;
          });
        }
      }
      setEventMessage(event);
      return newPositions;
    });
    setPreviousPositions((prev) => {
      const newPrevPositions = [...prev];
      newPrevPositions[turn - 1] = positions[turn - 1];
      return newPrevPositions;
    });
    setShowButtons(false);
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const handleStay = () => {
    setStayPlayers((prevStayPlayers) => [...prevStayPlayers, turn]);
    setTaskPlayers((prev) => {
      const updated = { ...prev };
      delete updated[turn];
      return updated;
    });
    setShowButtons(false);
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const changeTurnWhenMissed = () => {
    setStayPlayers((prevStayPlayers) =>
      prevStayPlayers.filter((player) => player !== turn),
    );
    setTurn((prevTurn) => (prevTurn === players ? 1 : prevTurn + 1));
  };

  const handleQuit = () => {
    localStorage.removeItem("positions");
    localStorage.removeItem("players");
    localStorage.removeItem("turn");
    window.location.reload();
  };

  useEffect(() => {
    if (eventMessage) {
      const timer = setTimeout(() => {
        setEventMessage("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [eventMessage]);

  const grid = [];
  for (let row = 9; row >= 0; row--) {
    const rowSquares = [];
    for (let col = 0; col < 10; col++) {
      const index = row % 2 === 0 ? 10 * row + col : 10 * (row + 1) - col - 1;
      rowSquares.push({ number: index + 1 });
    }
    grid.push(rowSquares);
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#12335f_0%,#0a192f_45%,#06101f_100%)] lg:grid lg:grid-cols-[7fr,3fr]">
      <div className="flex items-center justify-center p-2 md:p-3 lg:p-2">
        <div
          className="game-card real-board-shell overflow-hidden p-2 md:p-3 rounded-2xl"
        >
          <div className="real-board-frame">
            <div className="real-board-surface relative grid grid-cols-10">
            <img
              src={boardAsset}
              alt="Snake and ladder board"
              className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none select-none"
            />
            <div className="board-vignette pointer-events-none absolute inset-0 z-10" />
            <div className="board-glare pointer-events-none absolute inset-0 z-10" />
            {grid.flat().map((cell, index) => {
              const playersOnSquare = positions
                .map((position, i) => (position === cell.number ? i : -1))
                .filter((i) => i !== -1);

              return (
                <div
                  key={index}
                  className="relative z-20 flex flex-col justify-center items-center w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] md:w-[66px] md:h-[66px] lg:w-[90px] lg:h-[90px] border border-[#13253f]/30 bg-white/[0.015]"
                >
                  <div>
                    {playersOnSquare.map((player, index) => (
                      <div
                        key={player}
                        className={`absolute flex w-8 h-8 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full border border-[#64ffda]/30 items-center justify-center text-[10px] sm:text-xs md:text-sm lg:text-base font-bold shadow-lg cursor-pointer transform transition-all duration-100 ${playerColors[player]} hover:scale-110`}
                        style={{
                          top: `50%`,
                          left: `50%`,
                          transform: `translate(-50%, -50%) translate(${index * 2}px, ${index}px)`,
                        }}
                      >
                        {player + 1}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#112240]/90 border-l border-[#29406b] flex flex-col justify-center px-3 py-4 md:px-4 md:py-6 lg:px-5 lg:py-8 space-y-3 md:space-y-4 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#64ffda] font-medieval tracking-wide">
            FINITE LOOP <span className="text-white">CLUB </span>
          </h1>
          <p className="text-sm text-[#b7c6e6] tracking-wide">Snake & Ladder Championship</p>
        </div>
        <button
          onClick={() => {
            setShowPopup(true);
          }}
          className="w-full px-4 py-2 border border-[#ff8a8a] bg-[#d63838] text-white font-mono text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-[#ef4444] hover:shadow-[0_8px_20px_rgba(239,68,68,0.35)]"
        >
          Quit Game
        </button>
        {showPopup && (
          <QuitPopup
            message="Are you sure you want to quit the game?"
            onConfirm={handleQuit}
            onCancel={() => setShowPopup(false)}
          />
        )}
        {!winner ? (
          <>
            {taskPlayers[turn] && (
              <div className="text-center rounded-lg p-2 bg-[#233554]/60 border border-[#64ffda] shadow-lg shadow-[#64ffda]/10">
                <p className="text-base md:text-lg text-[#64ffda] animate-pulse font-medieval tracking-wide">
                  You have a task to perform!
                </p>
              </div>
            )}

            <div className="game-card text-center bg-[#233554]/60 border border-[#2f4778] rounded-xl p-4 shadow-lg">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-2 font-medieval tracking-wide">
                Team {turn}'s Turn
              </h2>
              <div
                className={`w-5 h-5 md:w-6 md:h-6 ${playerColors[turn - 1]} rounded-full mx-auto shadow-lg`}
              />
            </div>

            {eventMessage && (
              <div
                className={`game-card text-center text-base md:text-xl font-bold ${eventMessage === "SNAKE!" ? "text-red-500" : "text-[#64ffda]"} animate-bounce-slow bg-[#233554]/50 border border-[#233554]`}
              >
                {eventMessage}
              </div>
            )}

            <div className="h-auto p-4 rounded-xl flex items-center justify-center bg-[#233554]/60 border border-[#2f4778] shadow-lg">
              {stayPlayers.includes(turn) ? (
                <div
                   className="text-base md:text-lg font-mono text-red-400 text-center cursor-pointer hover:text-red-300"
                  onClick={() => changeTurnWhenMissed()}
                >
                  You Miss Your Turn!
                </div>
              ) : (
                <div className="text-center">
                  <div
                     className={`flex items-center justify-center rounded-lg w-12 h-12 md:w-14 md:h-14 text-lg md:text-xl mx-auto mb-3 md:mb-4 bg-[#64ffda] text-[#0b2547] font-extrabold shadow-[0_10px_25px_rgba(100,255,218,0.35)] ${rolling ? "animate-bounce-slow" : ""} ${!showButtons && !rolling ? "hover:scale-110 cursor-pointer hover:bg-[#8bffe4]" : "opacity-80 cursor-not-allowed"}`}
                    onClick={rollDice}
                  >
                    {number || "?"}
                  </div>

                  {showButtons && (
                    <div className="space-y-2 md:space-y-3 h-auto">
                      <button
                        onClick={handleMove}
                         className="w-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#112240] bg-[#64ffda] rounded-lg transition-all duration-200 hover:bg-[#86ffe2]"
                      >
                        Move
                      </button>
                      {taskPlayers[turn] && (
                        <button
                          onClick={handleStay}
                           className="w-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#64ffda] border border-[#64ffda] rounded-lg transition-all duration-200 hover:bg-[#64ffda]/10"
                        >
                          Stay
                        </button>
                      )}
                    </div>
                  )}

                   <p className="text-[10px] md:text-xs text-[#b7c6e6] mt-2 md:mt-3 tracking-wide">
                    {showButtons
                      ? "Make your move or wait for next turn"
                      : rolling
                        ? "Rolling..."
                        : "Tap the dice to roll"}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="game-card text-center p-6 md:p-8 rounded-xl bg-[#233554]/60 border border-[#64ffda] shadow-[0_14px_35px_rgba(100,255,218,0.2)]">
             <h2 className="text-2xl md:text-3xl font-bold text-[#64ffda] mb-2 md:mb-3">
               🎉 Victory! 🎉
             </h2>
            <p className="text-lg md:text-xl text-white">
              Team {winner} Wins!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
