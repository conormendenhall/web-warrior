import { Health } from "./Health";

import "./CharacterSheet.scss";

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
      <div className="character-body">
        {creature.equipment?.length > 0 && (
          <div className="equipment">
            {creature.equipment.map((item) => (
              <div key={item.name}>{item.name}</div>
            ))}
          </div>
        )}
        <div className="status">
          <div>Damage: d{creature.damageDie}</div>
          {creature.armorDie > 0 && <div>Armor: d{creature.armorDie}</div>}
          {creature.deflectDie > 0 && <div>Shield: d{creature.deflectDie}</div>}
          {creature.isCloaked > 0 && <div>Cloaked</div>}
          {creature.gold >= 0 && <div>Gold: {creature.gold}</div>}
          {creature.felledFoes >= 0 && (
            <div>Foes Felled: {creature.felledFoes}</div>
          )}
        </div>
      </div>
    </div>
  );
};
