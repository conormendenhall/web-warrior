import { useState } from "react";

import "./App.scss";
import { ActionButtons } from "./ActionButtons";
import { CharacterSheet } from "./CharacterSheet";
import { MerchantInventory } from "./MerchantInventory";

const App = () => {
  const freshHero = {
    name: "Nameless Warrior",
    level: 1,
    xp: 0,
    levelXP: 20,
    hp: 5,
    maxHP: 5,
    attackDie: 5,
    felledFoes: 0,
    gold: 0,
    isRested: true,
  };
  const freshGoblin = {
    name: "Goblin",
    level: 1,
    hp: 5,
    maxHP: 5,
    attackDie: 3,
    getLoot: () => Math.floor(Math.random() * 8),
  };
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [named, setNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [trading, setTrading] = useState(false);
  const [hero, setHero] = useState(freshHero);
  const [foe, setFoe] = useState(freshGoblin);
  const [dead, setDead] = useState(false);

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function handleSubmitName(e) {
    e.preventDefault();
    setNamed(true);
    setStatusMessage(`Well met, ${hero.name}.`);
  }

  function handleChangeName(e) {
    setHero({ ...hero, name: e.target.value });
  }

  function handleEmbark() {
    setInCombat(true);
    setStatusMessage(`You encounter a ${foe.name}.`);
    setTrading(false);
  }

  function handleTrade() {
    setTrading(true);
  }

  function handleAttack() {
    if (foe === null) return;
    const heroAtkDmg = rollDie(hero.attackDie);
    setFoe({ ...foe, hp: (foe.hp -= heroAtkDmg) });
    if (foe.hp > 0) {
      setFoe({ ...foe });
      const foeAtkDmg = rollDie(foe.attackDie);
      setStatusMessage(
        `You strike the ${foe.name} for ${heroAtkDmg} damage. ` +
          `The ${foe.name} still stands, sneering at you. ` +
          `The ${foe.name} attacks for ${foeAtkDmg} damage.`
      );
      if (hero.hp - foeAtkDmg > 0) {
        setHero({ ...hero, hp: (hero.hp -= foeAtkDmg), isRested: false });
      } else {
        setDead(true);
        setInCombat(false);
        setStatusMessage(
          `The ${foe.name} struck you down. Rest in Peace, ${hero.name}`
        );
      }
    } else {
      let victoryMessage = `You deal ${heroAtkDmg} damage, and the ${foe.name} falls dead at your feet.`;
      hero.felledFoes++;
      hero.xp += foe.maxHP + foe.attackDie;
      hero.gold += foe.getLoot();
      if (hero.xp > hero.levelXP) {
        levelUp(hero);
        victoryMessage += ` ${hero.name} reached level ${hero.level}!`;
      }
      setStatusMessage(victoryMessage);
      setHero({ ...hero });
      setInCombat(false);
      setFoe(freshGoblin);
    }
  }

  function levelUp(hero) {
    hero.xp -= hero.levelXP;
    hero.levelXP += Math.floor(hero.levelXP / 5);
    hero.maxHP += 3;
    hero.hp = hero.maxHP;
    return hero.level++;
  }

  function handleRest() {
    const restPoints = rollDie(4);
    setHero({
      ...hero,
      hp: Math.min(hero.hp + restPoints, hero.maxHP),
      isRested: true,
    });
    setStatusMessage(`You rest for ${restPoints} HP.`);
  }

  function handleResurrection() {
    setHero({ ...freshHero, name: hero.name });
    setNamed(false);
    setDead(false);
  }

  return (
    <div className="App">
      <div className="header">
        {named && <CharacterSheet creature={hero} />}
        <p className="status-message">{statusMessage}</p>
        {!named && (
          <form onSubmit={handleSubmitName}>
            <input
              defaultValue="Nameless Warrior"
              onChange={handleChangeName}
            />
            <button className="button" disabled={hero.name.length === 0}>
              Submit
            </button>
          </form>
        )}
      </div>
      {inCombat && <CharacterSheet creature={foe} />}
      {trading && <MerchantInventory heroGold={hero.gold} />}
      <ActionButtons
        dead={dead}
        inCombat={inCombat}
        isRested={hero.isRested}
        named={named}
        trading={trading}
        handleResurrection={handleResurrection}
        handleAttack={handleAttack}
        handleEmbark={handleEmbark}
        handleRest={handleRest}
        handleTrade={handleTrade}
      />
    </div>
  );
};

export default App;
