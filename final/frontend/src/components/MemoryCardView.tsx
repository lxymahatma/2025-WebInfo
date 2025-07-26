import type { CardProperties } from 'types/game';

export const MemoryCardView = ({ card, flipped, handleChoice, disabled }: CardProperties) => {
  const onClick = () => {
    if (!flipped && !disabled) handleChoice(card);
  };

  const innerTransform = flipped ? '[transform:rotateY(180deg)]' : '';
  const matchedAnimation = card.matched ? 'animate-match-pulse' : '';

  return (
    <div
      className={`cursor-pointer transition-transform duration-200 [perspective:1000px] hover:scale-105 ${matchedAnimation}`}
      onClick={onClick}
    >
      <div
        className={`relative h-[160px] w-[120px] transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] ${innerTransform}`}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-800 text-[2rem] font-semibold text-white shadow-lg shadow-black/15 transition-all duration-300 [backface-visibility:hidden] hover:shadow-xl hover:shadow-cyan-600/30">
          ?
        </div>
        <div className="absolute inset-0 flex [transform:rotateY(180deg)] items-center justify-center rounded-2xl bg-gray-100 text-[1.4rem] font-semibold text-gray-800 shadow-lg shadow-black/15 transition-all duration-300 [backface-visibility:hidden]">
          {card.text}
        </div>
      </div>
    </div>
  );
};
