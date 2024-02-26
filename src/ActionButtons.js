import "./ActionButtons.scss";

export const ActionButtons = ({
  isDead,
  inCombat,
  isTurn,
  isRested,
  named,
  trading,
  unseen,
  handleAttack,
  handleDefend,
  handleEmbark,
  handleRest,
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
      {named && !isDead && (
        <div className="button" onClick={handler}>
          {text}
        </div>
      )}
      {named && !isDead && !inCombat && !trading && (
        <div className="button" onClick={handleTrade}>
          Trade
        </div>
      )}
      {unseen && inCombat && (
        <div className="button" onClick={handleSneak}>
          Sneak Past
        </div>
      )}
    </div>
  );
};
