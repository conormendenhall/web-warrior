import "./ActionButtons.scss";

export const ActionButtons = ({
  isDead,
  inCombat,
  isTurn,
  isRested,
  visitingShrine,
  named,
  trading,
  unseen,
  handleAttack,
  handleDefend,
  handleEmbark,
  handleRest,
  handleAngel,
  handleDemon,
  handleTrade,
  handleSneak,
}) => {
  let text;
  let handler;

  if (inCombat && isTurn) {
    text = "Attack";
    handler = handleAttack;
  } else if (inCombat && !isTurn) {
    text = "Defend";
    handler = handleDefend;
  } else if (isRested) {
    text = "Embark";
    handler = handleEmbark;
  } else {
    text = "Rest";
    handler = handleRest;
  }

  return (
    <div className="button-section">
      {named && !isDead && !visitingShrine && (
        <button className="button" onClick={handler}>
          {text}
        </button>
      )}
      {visitingShrine && (
        <>
          <button className="button" onClick={handleAngel}>
            Touch the Angel
          </button>
          <button className="button" onClick={handleDemon}>
            Touch the Demon
          </button>
        </>
      )}
      {named && !isDead && !inCombat && !trading && !visitingShrine && (
        <button className="button" onClick={handleTrade}>
          Trade
        </button>
      )}
      {unseen && inCombat && !visitingShrine && (
        <button className="button" onClick={handleSneak}>
          Sneak Past
        </button>
      )}
    </div>
  );
};
