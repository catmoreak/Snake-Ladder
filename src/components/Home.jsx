import { useState, useEffect } from "react";
import Board from "./Board";

export default function Home() {
  const [players, setPlayers] = useState(() => {
    const storedPlayers = localStorage.getItem("players");
    return storedPlayers ? parseInt(storedPlayers,10) : 0;
  });
  const clicked = (x) => {
    setPlayers(x);
  };

  useEffect(() => {
    localStorage.setItem("players", players);
  }, [players]);

  return (
    <>
      {players == 0 && (
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#12335f_0%,#0a192f_55%,#06101f_100%)] flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl text-center space-y-8 md:space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide drop-shadow-[0_10px_30px_rgba(2,12,27,0.9)]">
                <span className="text-[#64ffda] font-medieval">
                  FINITE LOOP{" "}
                </span>
                <span className="text-white font-medieval">CLUB</span>
              </h1>
              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-[#c9d6f3] font-mono tracking-wide">
                  Snake & Ladder Championship
                </p>
                <p className="text-sm md:text-base text-[#8fa1c7] font-mono">
                  A Non Technical Club Event
                </p>
              </div>
            </div>

            <div className="bg-[#0f2444]/80 border border-[#2d4f85] rounded-2xl p-8 md:p-12 space-y-8 backdrop-blur-md shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
              <h2 className="text-2xl md:text-3xl text-[#64ffda] font-mono tracking-wide">
                Select Players
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <button
                  onClick={() => clicked(2)}
                  className="w-full md:w-48 px-8 py-4 text-lg md:text-xl font-mono font-semibold text-[#09203f] bg-[#64ffda] rounded-xl transition-all duration-200 hover:bg-[#86ffe2] hover:scale-105 hover:shadow-[0_10px_24px_rgba(100,255,218,0.35)] focus:outline-none focus:ring-2 focus:ring-[#64ffda]/50"
                >
                  2 Players
                </button>
                <button
                  onClick={() => clicked(4)}
                  className="w-full md:w-48 px-8 py-4 text-lg md:text-xl font-mono font-semibold text-[#64ffda] border-2 border-[#64ffda] rounded-xl transition-all duration-200 hover:bg-[#64ffda]/10 hover:scale-105 hover:shadow-[0_10px_24px_rgba(100,255,218,0.2)] focus:outline-none focus:ring-2 focus:ring-[#64ffda]/50"
                >
                  4 Players
                </button>
              </div>
            </div>

            <div className="text-[#8fa1c7] font-mono text-sm">
              Powered by Finite Loop Club
            </div>
          </div>
        </div>
      )}
      {players !== 0 && <Board players={players} />}
    </>
  );
}
