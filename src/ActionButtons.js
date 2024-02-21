export const ActionButtons = ({
  isDead,
  inCombat,
  isRested,
  named,
  trading,
  unseen,
  handleAttack,
  handleEmbark,
  handleRest,
  handleTrade,
  handleSneak,
}) => {
  let text;
  let handler;

  if (inCombat) {
    text = "Attack";
    handler = handleAttack;
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
