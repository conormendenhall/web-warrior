import { Health } from "./Health";
import { Equipment } from "./Equipment";
import { FoesFelled } from "./FoesFelled";
import { HeroStatus } from "./HeroStatus";

import "./CharacterSheet.scss";

export const CharacterSheet = ({ creature, heroStatus, showFoes }) => {
  return (
    <div className="character-sheet">
      <div className="character-header">
        <div className="hero-name">{creature.name}</div>
        <div className="level-box">
          <div>Level {creature.level}</div>
          {creature.levelXP > 0 && (
            <div>
              {creature.xp} / {creature.levelXP} XP
            </div>
          )}
        </div>
      </div>
      <Health hp={creature.hp} maxHP={creature.maxHP} />
      <div className="character-body">
        <div>
          {creature.equipment?.length > 0 && (
            <Equipment equipment={creature.equipment} />
          )}
          {creature.isHero && <HeroStatus heroStatus={heroStatus} />}
        </div>
        <div className="status">
          {creature.gold >= 0 && <div>Gold: {creature.gold}</div>}
          {creature.foesFelled && (
            <FoesFelled foesFelled={creature.foesFelled} showFoes={showFoes} />
          )}
        </div>
      </div>
    </div>
  );
};
