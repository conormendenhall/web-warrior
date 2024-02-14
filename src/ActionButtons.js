import "./ActionButtons.scss";

export const ActionButtons = ({
  dead,
  inCombat,
  isRested,
  named,
  trading,
  handleResurrection,
  handleAttack,
  handleEmbark,
  handleRest,
  handleTrade,
}) => {
  let text;
  let handler;

  if (dead) {
    text = "Rise Again";
    handler = handleResurrection;
  } else if (inCombat) {
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
    <div className="action-buttons">
      {named && (
        <div className="button" onClick={handler}>
          {text}
        </div>
      )}
      {named && !dead && !inCombat && !trading && (
        <div className="button" onClick={handleTrade}>
          Trade
        </div>
      )}
    </div>
  );
};
