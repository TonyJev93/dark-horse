"use client";

import { useState } from "react";
import { useGame } from "@/contexts/GameContext";

export default function GameSetup() {
  const { dispatch } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array(4).fill("").map((_, i) => `플레이어 ${i + 1}`)
  );

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill("").map((_, i) => `플레이어 ${i + 1}`));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const names = playerNames.map((name, i) => name.trim() || `플레이어 ${i + 1}`);
    dispatch({ type: "INITIALIZE_GAME", payload: { playerNames: names } });
    dispatch({ type: "ADVANCE_HORSE_PLACEMENT" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-700 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-4 border-amber-600">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-amber-900 mb-2 drop-shadow-md">🏇 다크호스 경마장</h1>
          <p className="text-amber-700 font-semibold">전략적 경마 보드 게임</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-3">
              플레이어 수
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  onClick={() => handlePlayerCountChange(count)}
                  className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                    playerCount === count
                      ? "bg-amber-600 text-white shadow-xl scale-110 ring-4 ring-amber-300"
                      : "bg-amber-100 text-amber-800 hover:bg-amber-200 shadow-md hover:shadow-lg"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-amber-900 mb-3">
              플레이어 이름
            </label>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`플레이어 ${index + 1}`}
                  className="w-full px-4 py-3 border-2 border-amber-300 bg-white rounded-lg focus:ring-4 focus:ring-amber-400 focus:border-amber-500 transition-all shadow-sm hover:shadow-md"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 active:scale-95 text-white font-bold py-4 px-6 rounded-lg shadow-xl transition-all hover:shadow-2xl border-2 border-amber-800"
          >
            🏁 게임 시작
          </button>
        </div>

        <div className="mt-8 text-center text-sm bg-amber-100 p-3 rounded-lg border border-amber-300">
          <p className="text-amber-800 font-semibold">⏱️ 플레이 시간: 약 15분 | 👥 연령: 8세 이상</p>
        </div>
      </div>
    </div>
  );
}
