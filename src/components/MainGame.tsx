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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-700 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-emerald-800">🏇 다크호스</h1>
              <div className="text-lg font-semibold text-gray-700">
                턴: {currentPlayer.name}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium">단계: </span>
                  {state.turnPhase === "take_token" && "토큰 가져가기 (선택)"}
                  {state.turnPhase === "play_card" && "카드 플레이"}
                  {state.turnPhase === "execute_card" && "카드 실행"}
                </div>
                <div className="text-sm">
                  <span className="font-medium">남은 토큰: </span>
                  {state.availableTokens}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">경주 트랙</h2>
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
                      <div className="mt-2 text-xs font-semibold text-gray-600">
                        {rank === 1 && "🥇"}
                        {rank === 2 && "🥈"}
                        {rank === 3 && "🥉"}
                        {rank > 3 && `${rank}th`}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-gray-500 font-medium whitespace-nowrap">1등 →</div>
            </div>
          </div>

          {state.turnPhase === "take_token" && (
            <div className="mb-6 p-6 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <h3 className="font-bold text-purple-800 mb-3">다크호스 토큰</h3>
              {canTakeToken ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleTakeToken}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    토큰 가져가기
                  </button>
                  <button
                    onClick={handleSkipToken}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
                    className="mt-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    계속하기
                  </button>
                </div>
              )}
            </div>
          )}

          {state.turnPhase === "play_card" && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">행동 카드</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                {currentPlayer.actionCards.map((card, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCard(index)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCardIndex === index
                        ? "border-emerald-500 bg-emerald-50 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-emerald-300 hover:shadow-md"
                    }`}
                  >
                    <div className="text-center text-sm font-medium">
                      {card.type === "single_movement" && (
                        <>
                          <div className="text-2xl mb-1">🏇</div>
                          <div>#{card.horseNumber}번 말</div>
                          <div className="text-xs text-gray-600">
                            {card.direction === "choice" ? "±" : card.direction === "forward" ? "+" : "-"}
                            {card.spaces}
                          </div>
                        </>
                      )}
                      {card.type === "dual_movement" && (
                        <>
                          <div className="text-2xl mb-1">🏇🏇</div>
                          <div className="text-xs">
                            #{card.horseNumbers[0]} & #{card.horseNumbers[1]}
                          </div>
                          <div className="text-xs text-gray-600">±{card.spaces}</div>
                        </>
                      )}
                      {card.type === "rider_fall_off" && (
                        <>
                          <div className="text-2xl mb-1">💥</div>
                          <div className="text-xs">낙마</div>
                        </>
                      )}
                      {card.type === "exchange_betting" && (
                        <>
                          <div className="text-2xl mb-1">🔄</div>
                          <div className="text-xs">교환</div>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handlePlayCard}
                disabled={selectedCardIndex === null}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
              >
                선택한 카드 플레이
              </button>
            </div>
          )}

          {state.turnPhase === "execute_card" && showDirectionChoice && (
            <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-bold text-blue-800 mb-3">방향 선택</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDirectionChoice("forward")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors"
                >
                  앞으로 ➡️
                </button>
                <button
                  onClick={() => handleDirectionChoice("backward")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition-colors"
                >
                  뒤로 ⬅️
                </button>
              </div>
            </div>
          )}

          {state.turnPhase === "execute_card" && showPlayerChoice && (
            <div className="mb-6 p-6 bg-orange-50 border-2 border-orange-200 rounded-xl">
              <h3 className="font-bold text-orange-800 mb-3">베팅 카드 교환</h3>
              <div className="space-y-3">
                {state.players.map((player) => (
                  <div key={player.id} className="bg-white p-4 rounded-lg border">
                    <div className="font-semibold mb-2">{player.name}</div>
                    <div className="flex gap-2">
                      {player.bettingCards.map((_, cardIndex) => (
                        <button
                          key={cardIndex}
                          onClick={() => handlePlayerChoice(player.id, cardIndex)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
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
            <div className="mb-6 text-center">
              <button
                onClick={handleNextTurn}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
              >
                다음 턴
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">게임 종료!</h3>
              <button
                onClick={handleEndGame}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-lg transition-colors"
              >
                점수 보기
              </button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {state.players.map((player) => (
              <div
                key={player.id}
                className={`p-3 rounded-lg border-2 ${
                  player.id === currentPlayer.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <div className="font-semibold text-sm">{player.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  카드: {player.actionCards.length}
                </div>
                {player.hasDarkHorseToken && (
                  <div className="text-xs text-purple-600 font-semibold mt-1">🌟 토큰</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
