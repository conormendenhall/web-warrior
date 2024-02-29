import { CharacterSheet } from "./CharacterSheet";

export const Combat = ({
  foe,
  isTurn,
  handleAttack,
  handleDefend,
  isUnseen,
  handleSneak,
}) => {
  return (
    <>
      <CharacterSheet creature={foe} />
      <div className="button-section">
        {isTurn ? (
          <button className="button" onClick={handleAttack}>
            Attack
          </button>
        ) : (
          <button className="button" onClick={handleDefend}>
            Defend
          </button>
        )}
        {isUnseen && (
          <button className="button" onClick={handleSneak}>
            Sneak Past
          </button>
        )}
      </div>
    </>
  );
};
