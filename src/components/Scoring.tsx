"use client";

import { useGame } from "@/contexts/GameContext";
import { calculateAllScores, determineWinner } from "@/game/scoring";
import { getHorseRank } from "@/game/movement";

export default function Scoring() {
  const { state } = useGame();

  if (!state || (state.phase !== "scoring" && state.phase !== "finished")) {
    return null;
  }

  const scores = calculateAllScores(state);
  const winners = determineWinner(scores);
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore);

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-yellow-700 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-yellow-800 mb-4">🏆 Game Over!</h1>
            {winners.length === 1 ? (
              <p className="text-2xl text-gray-700">
                Winner: <span className="font-bold text-yellow-600">{winners[0].playerName}</span>
              </p>
            ) : (
              <p className="text-2xl text-gray-700">
                Tie: <span className="font-bold text-yellow-600">
                  {winners.map(w => w.playerName).join(", ")}
                </span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Final Race Results</h2>
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl overflow-x-auto">
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">7th</div>
              <div className="flex gap-3">
                {state.horses.map((horse) => {
                  const rank = getHorseRank(state.horses, horse.number);
                  return (
                    <div key={horse.number} className="flex flex-col items-center">
                      <div
                        className={`w-24 h-32 rounded-lg flex flex-col items-center justify-center text-3xl font-bold shadow-lg ${
                          state.darkHorseNumber === horse.number
                            ? "bg-gradient-to-br from-purple-600 to-purple-800 text-white ring-4 ring-purple-300"
                            : "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
                        }`}
                      >
                        <div>🏇</div>
                        <div className="text-2xl">{horse.number}</div>
                      </div>
                      <div className="mt-2 text-lg font-bold">
                        {rank === 1 && "🥇 1st"}
                        {rank === 2 && "🥈 2nd"}
                        {rank === 3 && "🥉 3rd"}
                        {rank > 3 && `${rank}th`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">1st →</div>
            </div>
          </div>

          <div className="space-y-6">
            {sortedScores.map((playerScore, index) => {
              const player = state.players.find(p => p.id === playerScore.playerId)!;
              const isWinner = winners.some(w => w.playerId === playerScore.playerId);

              return (
                <div
                  key={playerScore.playerId}
                  className={`p-6 rounded-xl border-2 ${
                    isWinner
                      ? "border-yellow-400 bg-yellow-50 shadow-lg"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {index === 0 && !isWinner && "🥇 "}
                        {index === 1 && !isWinner && "🥈 "}
                        {index === 2 && !isWinner && "🥉 "}
                        {isWinner && "👑 "}
                        {playerScore.playerName}
                      </h3>
                    </div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {playerScore.totalScore} pts
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Betting Cards:</h4>
                      <div className="space-y-2">
                        {playerScore.bettingScores.map((score, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white p-3 rounded-lg"
                          >
                            <span>
                              Horse #{score.horseNumber}
                              {state.darkHorseNumber === score.horseNumber && " 🌟"}
                            </span>
                            <span className="font-semibold">
                              {score.rank === 1 && "🥇"}
                              {score.rank === 2 && "🥈"}
                              {score.rank === 3 && "🥉"}
                              {score.rank > 3 && `${score.rank}th`}
                              {" = "}
                              {score.points} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Bonuses:</h4>
                      <div className="space-y-2">
                        {playerScore.hasDoubleBetting && (
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <span>Double Betting 🎯</span>
                            <span className="font-semibold text-blue-600">
                              +{playerScore.doubleBettingBonus} pts
                            </span>
                          </div>
                        )}
                        {player.hasDarkHorseToken && (
                          <div className={`flex justify-between items-center p-3 rounded-lg border ${
                            playerScore.darkHorseTokenBonus > 0
                              ? "bg-purple-50 border-purple-200"
                              : "bg-red-50 border-red-200"
                          }`}>
                            <span>Dark Horse Token 🌟</span>
                            <span className={`font-semibold ${
                              playerScore.darkHorseTokenBonus > 0
                                ? "text-purple-600"
                                : "text-red-600"
                            }`}>
                              {playerScore.darkHorseTokenBonus > 0 ? "+" : ""}
                              {playerScore.darkHorseTokenBonus} pts
                            </span>
                          </div>
                        )}
                        {!playerScore.hasDoubleBetting && !player.hasDarkHorseToken && (
                          <div className="text-gray-400 italic p-3">No bonuses</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleNewGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
