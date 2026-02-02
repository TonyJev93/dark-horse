"use client";

import { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import { canTakeDarkHorseToken, isGameOver } from "@/game/rules";
import { getHorseRank } from "@/game/movement";
import type { ActionCard, MovementChoice, ExchangeBettingChoice } from "@/types/game";

export default function MainGame() {
  const { state, dispatch } = useGame();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<ActionCard | null>(null);
  const [showDirectionChoice, setShowDirectionChoice] = useState(false);
  const [showPlayerChoice, setShowPlayerChoice] = useState(false);

  if (!state || state.phase !== "playing") {
    return null;
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const canTakeToken = canTakeDarkHorseToken(state);
  const gameOver = isGameOver(state);

  const handleTakeToken = () => {
    dispatch({ type: "TAKE_DARK_HORSE_TOKEN" });
  };

  const handleSkipToken = () => {
    dispatch({ type: "SKIP_DARK_HORSE_TOKEN" });
  };

  const handleSelectCard = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handlePlayCard = () => {
    if (selectedCardIndex === null) return;

    const card = currentPlayer.actionCards[selectedCardIndex];
    dispatch({ type: "PLAY_ACTION_CARD", payload: { cardIndex: selectedCardIndex } });
    setSelectedCard(card);
    setSelectedCardIndex(null);

    if (card.type === "exchange_betting") {
      setShowPlayerChoice(true);
    } else if (
      (card.type === "single_movement" || card.type === "dual_movement") &&
      card.direction === "choice"
    ) {
      setShowDirectionChoice(true);
    } else {
      executeCard(card, null);
    }
  };

  const executeCard = (card: ActionCard, choice: MovementChoice | ExchangeBettingChoice | null) => {
    dispatch({ type: "EXECUTE_ACTION_CARD", payload: { card, choice } });
    setSelectedCard(null);
    setShowDirectionChoice(false);
    setShowPlayerChoice(false);
  };

  const handleDirectionChoice = (direction: "forward" | "backward") => {
    if (!selectedCard) return;
    executeCard(selectedCard, { direction });
  };

  const handlePlayerChoice = (playerId: string, cardIndex: number) => {
    if (!selectedCard) return;
    executeCard(selectedCard, { targetPlayerId: playerId, cardIndex });
  };

  const handleNextTurn = () => {
    dispatch({ type: "NEXT_TURN" });
  };

  const handleEndGame = () => {
    dispatch({ type: "END_GAME" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl p-6 border-4 border-amber-600">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-amber-200">
              <h1 className="text-3xl font-bold text-amber-900 drop-shadow-sm">🏇 다크호스 경마장</h1>
              <div className="text-lg font-semibold bg-amber-600 text-white px-4 py-2 rounded-full shadow-md">
                턴: {currentPlayer.name}
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 p-4 rounded-lg border-2 border-amber-300 shadow-inner">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-bold text-amber-900">단계: </span>
                  <span className="text-amber-800">
                    {state.turnPhase === "take_token" && "토큰 가져가기 (선택)"}
                    {state.turnPhase === "play_card" && "카드 플레이"}
                    {state.turnPhase === "execute_card" && "카드 실행"}
                  </span>
                </div>
                <div className="text-sm bg-amber-600 text-white px-3 py-1 rounded-full font-semibold">
                  남은 토큰: {state.availableTokens}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏁 경주 트랙</h2>
            <div className="relative bg-gradient-to-b from-green-800 to-green-900 rounded-2xl p-6 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
                }}></div>
              </div>

              <div className="relative">
                <div className="flex justify-between mb-2 px-2">
                  <div className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full shadow-lg">
                    🚩 START
                  </div>
                  <div className="text-white font-bold text-sm bg-yellow-500 px-3 py-1 rounded-full shadow-lg">
                    🏁 FINISH
                  </div>
                </div>

                <div className="space-y-1">
                  {state.horses.map((horse) => {
                    const rank = getHorseRank(state.horses, horse.number);
                    const raceProgressPercentage = ((7 - horse.position) / 6) * 100;
                    
                    const horseJerseyColors = [
                      'from-red-500 to-red-700',
                      'from-blue-500 to-blue-700',
                      'from-yellow-400 to-yellow-600',
                      'from-green-500 to-green-700',
                      'from-orange-500 to-orange-700',
                      'from-pink-500 to-pink-700',
                      'from-cyan-500 to-cyan-700',
                    ];
                    const jerseyColorGradient = horseJerseyColors[horse.number - 1] || 'from-gray-500 to-gray-700';
                    const isDarkHorse = state.darkHorseNumber === horse.number;
                    
                    return (
                      <div key={horse.number} className="relative">
                        <div className="relative h-16 bg-gradient-to-r from-green-700/50 via-green-600/30 to-green-700/50 border-b-2 border-white/20 rounded-lg overflow-hidden">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 font-bold text-xs">
                            #{horse.number}
                          </div>
                          
                          <div className="absolute inset-0 flex justify-around items-center px-12">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-px h-8 bg-white/10"></div>
                            ))}
                          </div>

                          <div 
                            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
                            style={{ left: `${raceProgressPercentage}%`, transform: `translate(-50%, -50%)` }}
                          >
                            <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${
                              isDarkHorse
                                ? 'from-purple-500 to-purple-800 ring-4 ring-purple-300 ring-offset-2 ring-offset-green-800 animate-pulse'
                                : `${jerseyColorGradient} ring-2 ring-white/50`
                            } flex flex-col items-center justify-center shadow-xl hover:scale-110 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                              rank <= 3 ? 'animate-bounce-slow' : ''
                            }`}>
                              <div className="text-2xl">{rank === 1 ? '🏇✨' : '🏇'}</div>
                              <div className="absolute -bottom-1 text-xs font-bold text-white bg-black/50 px-1.5 py-0.5 rounded animate-fade-in">
                                {horse.number}
                              </div>
                            </div>
                          </div>

                          <div className="absolute right-2 top-1/2 -translate-y-1/2 transition-all duration-500">
                            <div className={`text-lg font-bold px-2 py-1 rounded-full transition-all duration-500 ${
                              rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-500/50 animate-pulse' :
                              rank === 2 ? 'bg-gray-300 text-gray-800 shadow-lg shadow-gray-400/50' :
                              rank === 3 ? 'bg-orange-400 text-orange-900 shadow-lg shadow-orange-500/50' :
                              'bg-white/20 text-white/80'
                            }`}>
                              {rank === 1 && '🥇'}
                              {rank === 2 && '🥈'}
                              {rank === 3 && '🥉'}
                              {rank > 3 && `${rank}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-white/60">
                  <div>경마장 잔디 트랙</div>
                  <div>총 거리: 1200m</div>
                </div>
              </div>
            </div>
          </div>

          {state.turnPhase === "take_token" && (
            <div className="mb-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-3">다크호스 토큰</h3>
              {canTakeToken ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleTakeToken}
                    className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    ✨ 토큰 가져가기
                  </button>
                  <button
                    onClick={handleSkipToken}
                    className="bg-gray-400 hover:bg-gray-500 active:scale-95 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    건너뛰기
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-purple-700 mb-2">토큰을 가져갈 수 없습니다:</p>
                  <ul className="text-sm text-purple-600 list-disc list-inside">
                    {currentPlayer.hasDarkHorseToken && <li>이미 토큰을 가지고 있습니다</li>}
                    {currentPlayer.actionCards.length <= 1 && <li>카드가 1장만 남았습니다</li>}
                    {state.availableTokens <= 0 && <li>남은 토큰이 없습니다</li>}
                  </ul>
                  <button
                    onClick={handleSkipToken}
                    className="mt-3 bg-gray-400 hover:bg-gray-500 active:scale-95 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    계속하기
                  </button>
                </div>
              )}
            </div>
          )}

          {state.turnPhase === "play_card" && (
            <div className="mb-6 animate-fade-in">
              <h3 className="font-bold text-gray-800 mb-3">🎴 행동 카드</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                {currentPlayer.actionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCard(index)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`p-4 h-40 rounded-xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-slide-in relative overflow-hidden ${
                      selectedCardIndex === index
                        ? "border-emerald-500 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 shadow-2xl scale-110 ring-4 ring-emerald-300 -translate-y-2"
                        : "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 hover:border-emerald-400 hover:from-emerald-50 hover:via-white shadow-md"
                    }`}
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-black/5 rounded-bl-lg"></div>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        {card.type === "single_movement" && (
                          <>
                            <div className="text-3xl mb-2">🏇</div>
                            <div className="font-bold text-lg text-gray-800">#{card.horseNumber}</div>
                            <div className="mt-1 px-3 py-1 bg-blue-100 rounded-full">
                              <span className="text-sm font-bold text-blue-800">
                                {card.direction === "choice" ? "±" : card.direction === "forward" ? "+" : "-"}
                                {card.spaces} 칸
                              </span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider">Single Move</div>
                          </>
                        )}
                        {card.type === "dual_movement" && (
                          <>
                            <div className="text-3xl mb-2">🏇🏇</div>
                            <div className="font-bold text-sm text-gray-800">
                              #{card.horseNumbers[0]} & #{card.horseNumbers[1]}
                            </div>
                            <div className="mt-1 px-3 py-1 bg-indigo-100 rounded-full">
                              <span className="text-sm font-bold text-indigo-800">±{card.spaces} 칸</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider">Dual Move</div>
                          </>
                        )}
                        {card.type === "rider_fall_off" && (
                          <>
                            <div className="text-3xl mb-2">💥</div>
                            <div className="font-bold text-lg text-red-700">낙마!</div>
                            <div className="mt-1 px-3 py-1 bg-red-100 rounded-full">
                              <span className="text-xs font-bold text-red-800">꼴찌로 이동</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider">Fall Off</div>
                          </>
                        )}
                        {card.type === "exchange_betting" && (
                          <>
                            <div className="text-3xl mb-2">🔄</div>
                            <div className="font-bold text-lg text-orange-700">교환</div>
                            <div className="mt-1 px-3 py-1 bg-orange-100 rounded-full">
                              <span className="text-xs font-bold text-orange-800">베팅 카드</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider">Exchange</div>
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <div className="text-[8px] text-gray-400 font-mono">#{String(index + 1).padStart(3, '0')}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handlePlayCard}
                disabled={selectedCardIndex === null}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🎴 선택한 카드 플레이
              </button>
            </div>
          )}

          {state.turnPhase === "execute_card" && showDirectionChoice && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl animate-slide-in">
              <h3 className="font-bold text-blue-800 mb-3">🧭 방향 선택</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDirectionChoice("forward")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  앞으로 ➡️
                </button>
                <button
                  onClick={() => handleDirectionChoice("backward")}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  뒤로 ⬅️
                </button>
              </div>
            </div>
          )}

          {state.turnPhase === "execute_card" && showPlayerChoice && (
            <div className="mb-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl animate-slide-in">
              <h3 className="font-bold text-orange-800 mb-3">🔄 베팅 카드 교환</h3>
              <div className="space-y-3">
                {state.players.map((player) => (
                  <div key={player.id} className="bg-white p-4 rounded-lg border shadow-md">
                    <div className="font-semibold mb-2">{player.name}</div>
                    <div className="flex gap-2">
                      {player.bettingCards.map((_, cardIndex) => (
                        <button
                          key={cardIndex}
                          onClick={() => handlePlayerChoice(player.id, cardIndex)}
                          className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          카드 {cardIndex + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {state.turnPhase === "execute_card" && !showDirectionChoice && !showPlayerChoice && (
            <div className="mb-6 text-center animate-fade-in">
              <button
                onClick={handleNextTurn}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ▶️ 다음 턴
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center animate-slide-in shadow-xl">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">🏁 게임 종료!</h3>
              <button
                onClick={handleEndGame}
                className="bg-yellow-600 hover:bg-yellow-700 active:scale-95 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
              >
                🏆 점수 보기
              </button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {state.players.map((player) => (
              <div
                key={player.id}
                className={`p-3 rounded-lg border-2 shadow-md transition-all ${
                  player.id === currentPlayer.id
                    ? "border-amber-500 bg-gradient-to-br from-amber-100 to-yellow-100 ring-2 ring-amber-400 shadow-lg scale-105"
                    : "border-amber-200 bg-gradient-to-br from-white to-amber-50 hover:shadow-lg"
                }`}
              >
                <div className="font-bold text-sm text-amber-900">{player.name}</div>
                <div className="text-xs text-amber-700 mt-1 font-medium">
                  🎴 카드: {player.actionCards.length}
                </div>
                {player.hasDarkHorseToken && (
                  <div className="text-xs text-purple-700 font-bold mt-1 bg-purple-100 px-2 py-0.5 rounded-full inline-block">🌟 다크호스</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
