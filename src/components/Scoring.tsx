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
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-700 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 text-6xl animate-bounce-slow">🏆</div>
        <div className="absolute top-20 right-20 text-5xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce-slow" style={{ animationDelay: '1s' }}>🎉</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-bounce-slow" style={{ animationDelay: '1.5s' }}>🏇</div>
      </div>
      <div className="max-w-6xl mx-auto relative">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl p-8 border-4 border-amber-600 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-amber-900 mb-4 animate-pulse drop-shadow-lg">🏆 게임 종료!</h1>
            {winners.length === 1 ? (
              <p className="text-2xl text-amber-800">
                승자: <span className="font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full inline-block animate-bounce-slow">
                  🎊 {winners[0].playerName} 🎊
                </span>
              </p>
            ) : (
              <p className="text-2xl text-amber-800">
                무승부: <span className="font-bold text-yellow-600 bg-yellow-100 px-4 py-2 rounded-full inline-block">
                  {winners.map(w => w.playerName).join(", ")}
                </span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">최종 경주 결과</h2>
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl overflow-x-auto">
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">7등</div>
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
                        {rank === 1 && "🥇 1등"}
                        {rank === 2 && "🥈 2등"}
                        {rank === 3 && "🥉 3등"}
                        {rank > 3 && `${rank}등`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">1등 →</div>
            </div>
          </div>

          <div className="space-y-6">
            {sortedScores.map((playerScore, index) => {
              const player = state.players.find(p => p.id === playerScore.playerId)!;
              const isWinner = winners.some(w => w.playerId === playerScore.playerId);

              return (
                <div
                  key={playerScore.playerId}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    isWinner
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 shadow-2xl ring-4 ring-yellow-300 animate-pulse"
                      : "border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className={`text-2xl font-bold ${isWinner ? 'text-amber-900' : 'text-gray-800'}`}>
                        {index === 0 && !isWinner && "🥇 "}
                        {index === 1 && !isWinner && "🥈 "}
                        {index === 2 && !isWinner && "🥉 "}
                        {isWinner && "👑 "}
                        {playerScore.playerName}
                      </h3>
                    </div>
                    <div className={`text-4xl font-bold ${
                      isWinner 
                        ? 'text-yellow-600 drop-shadow-lg' 
                        : 'text-amber-600'
                    }`}>
                      {playerScore.totalScore}점
                      {isWinner && " ✨"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">베팅 카드:</h4>
                      <div className="space-y-2">
                        {playerScore.bettingScores.map((score, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white p-3 rounded-lg"
                          >
                            <span>
                              #{score.horseNumber}번 말
                              {state.darkHorseNumber === score.horseNumber && " 🌟"}
                            </span>
                            <span className="font-semibold">
                              {score.rank === 1 && "🥇"}
                              {score.rank === 2 && "🥈"}
                              {score.rank === 3 && "🥉"}
                              {score.rank > 3 && `${score.rank}등`}
                              {" = "}
                              {score.points}점
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">보너스:</h4>
                      <div className="space-y-2">
                        {playerScore.hasDoubleBetting && (
                          <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <span>더블 베팅 🎯</span>
                            <span className="font-semibold text-blue-600">
                              +{playerScore.doubleBettingBonus}점
                            </span>
                          </div>
                        )}
                        {player.hasDarkHorseToken && (
                          <div className={`flex justify-between items-center p-3 rounded-lg border ${
                            playerScore.darkHorseTokenBonus > 0
                              ? "bg-purple-50 border-purple-200"
                              : "bg-red-50 border-red-200"
                          }`}>
                            <span>다크호스 토큰 🌟</span>
                            <span className={`font-semibold ${
                              playerScore.darkHorseTokenBonus > 0
                                ? "text-purple-600"
                                : "text-red-600"
                            }`}>
                              {playerScore.darkHorseTokenBonus > 0 ? "+" : ""}
                              {playerScore.darkHorseTokenBonus}점
                            </span>
                          </div>
                        )}
                        {!playerScore.hasDoubleBetting && !player.hasDarkHorseToken && (
                          <div className="text-gray-400 italic p-3">보너스 없음</div>
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
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 active:scale-95 text-white font-bold py-4 px-8 rounded-lg shadow-xl transition-all hover:shadow-2xl border-2 border-amber-800"
            >
              🔄 새 게임
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
