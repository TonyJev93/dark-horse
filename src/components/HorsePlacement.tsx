"use client";

import { useGame } from "@/contexts/GameContext";
import { getAvailableHorses } from "@/game/setup";
import type { HorseNumber } from "@/types/game";

export default function HorsePlacement() {
  const { state, dispatch } = useGame();

  if (!state || state.phase !== "horse_placement") {
    return null;
  }

  const availableHorses = getAvailableHorses(state.horses);
  const currentPlayer = state.players[state.currentPlayerIndex];
  const isPlacementComplete = state.horses.length === 7 && state.darkHorseNumber !== null;

  const handlePlaceHorse = (horseNumber: HorseNumber, position: "left" | "right") => {
    dispatch({ type: "PLACE_HORSE", payload: { horseNumber, position } });
  };

  const handleStartGame = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2 text-center">
            말 배치하기
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {isPlacementComplete ? (
              <>모든 말이 배치되었습니다! 시작 버튼을 눌러 경주를 시작하세요.</>
            ) : (
              <>{currentPlayer.name}님, 양쪽 중 한 곳에 말을 배치하세요</>
            )}
          </p>

          <div className="mb-8 flex items-center justify-center gap-4">
            {state.horses.length === 0 ? (
              <div className="text-gray-400 text-lg">아직 배치된 말이 없습니다</div>
            ) : (
              <>
                <div className="text-sm text-gray-500 font-medium">7등</div>
                <div className="flex gap-2">
                  {state.horses.map((horse) => (
                    <div
                      key={horse.number}
                      className={`w-20 h-24 rounded-lg flex items-center justify-center text-2xl font-bold shadow-md ${
                        state.darkHorseNumber === horse.number
                          ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white ring-4 ring-purple-300"
                          : "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                      }`}
                    >
                      🏇
                      <span className="ml-1">{horse.number}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500 font-medium">1등 →</div>
              </>
            )}
          </div>

          {state.darkHorseNumber && (
            <div className="mb-8 p-4 bg-purple-100 border-2 border-purple-300 rounded-lg text-center">
              <p className="text-purple-800 font-semibold">
                🌟 다크호스: #{state.darkHorseNumber}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                상위 3등: +5점 | 하위 4등: -3점
              </p>
            </div>
          )}

          {!isPlacementComplete && (
            <>
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  배치 가능한 말:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableHorses.map((horseNumber) => (
                    <div
                      key={horseNumber}
                      className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700"
                    >
                      #{horseNumber}번 말
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {availableHorses.map((horseNumber) => (
                  <div key={horseNumber} className="space-y-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg p-4 text-center font-bold text-lg">
                      🏇 {horseNumber}
                    </div>
                    <button
                      onClick={() => handlePlaceHorse(horseNumber, "left")}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      ← 왼쪽
                    </button>
                    <button
                      onClick={() => handlePlaceHorse(horseNumber, "right")}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      오른쪽 →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {isPlacementComplete && (
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 active:scale-95 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all hover:shadow-2xl border-2 border-amber-800"
              >
                🏁 게임 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
