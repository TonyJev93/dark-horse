"use client";

import { useState } from "react";
import { useGame } from "@/contexts/GameContext";

export default function GameSetup() {
  const { dispatch } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(4).fill("").map((_, i) => `Player ${i + 1}`)
  );

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill("").map((_, i) => `Player ${i + 1}`));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const names = playerNames.map((name, i) => name.trim() || `Player ${i + 1}`);
    dispatch({ type: "INITIALIZE_GAME", payload: { playerNames: names } });
    dispatch({ type: "ADVANCE_HORSE_PLACEMENT" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-800 mb-2">🏇 Dark Horse</h1>
          <p className="text-gray-600">Strategic Horse Racing Game</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Players
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    playerCount === count
                      ? "bg-green-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Player Names
            </label>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            Start Game
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Duration: ~15 minutes | Age: 8+</p>
        </div>
      </div>
    </div>
  );
}
