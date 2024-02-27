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
        <div className="button" onClick={handler}>
          {text}
        </div>
      )}
      {visitingShrine && (
        <>
          <div className="button" onClick={handleAngel}>
            Touch the Angel
          </div>
          <div className="button" onClick={handleDemon}>
            Touch the Demon
          </div>
        </>
      )}
      {named && !isDead && !inCombat && !trading && !visitingShrine && (
        <div className="button" onClick={handleTrade}>
          Trade
        </div>
      )}
      {unseen && inCombat && !visitingShrine && (
        <div className="button" onClick={handleSneak}>
          Sneak Past
        </div>
      )}
    </div>
  );
};
