import { Health } from "./Health";

export const CharacterSheet = ({ creature }) => {
  return (
    <div className="character-sheet">
      <div className="character-header">
        <div className="hero-name">{creature.name}</div>
        <div className="level-box">
          <div>Level {creature.level}</div>
          {creature.xp >= 0 && creature.levelXP >= 0 && (
            <div>
              {creature.xp} / {creature.levelXP} XP
            </div>
          )}
        </div>
      </div>
      <Health hp={creature.hp} maxHP={creature.maxHP} />
      <div>Attack: d{creature.attackDie}</div>
      {creature.gold >= 0 && <div>{creature.gold} gold</div>}
      {creature.felledFoes >= 0 && <div>{creature.felledFoes} foes felled</div>}
    </div>
  );
};
