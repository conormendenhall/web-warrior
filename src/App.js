import { useState } from "react";

import "./App.scss";

function App() {
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
  let merchantInventory = [
    { name: "Shield", cost: 8 },
    { name: "Leather Armor", cost: 10 },
    { name: "Morning Star", cost: 12 },
    { name: "Chain Mail", cost: 14 },
    { name: "Claymore", cost: 16 },
    { name: "Scale Armor", cost: 16 },
    { name: "Lucerne", cost: 18 },
    { name: "Plate Armor", cost: 20 },
    { name: "Cloak of Invisibility", cost: 40 },
  ];
  const inventoryItems = merchantInventory.map((item) => (
    <li key={item.name}>
      {item.name} - {item.cost}
    </li>
  ));

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
    setHero(freshHero);
    setNamed(false);
    setDead(false);
  }

  return (
    <div className="App">
      <div className="header">
        {named && (
          <div className="character-sheet">
            <div className="character-header">
              <div className="hero-name">{hero.name}</div>
              <div className="level-box">
                <div>Level {hero.level}</div>
                <div>
                  {hero.xp} / {hero.levelXP} XP
                </div>
              </div>
            </div>
            <div className="health">
              <div className="health-count">
                {hero.hp} / {hero.maxHP} HP
              </div>
              <div className="health-bar">
                <div
                  className="hp"
                  style={{ width: (hero.hp / hero.maxHP) * 100 + "%" }}
                ></div>
              </div>
            </div>
            <div>Attack: d{hero.attackDie}</div>
            <div>{hero.gold} gold</div>
            <div>{hero.felledFoes} foes felled</div>
          </div>
        )}
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
      {inCombat && (
        <div className="character-sheet">
          <div className="character-header">
            <div className="hero-name">{foe.name}</div>
            <div className="level-box">
              <div>Level {foe.level}</div>
            </div>
          </div>
          <div className="health">
            <div className="health-count">
              {foe.hp} / {foe.maxHP} HP
            </div>
            <div className="health-bar">
              <div
                className="hp"
                style={{ width: (foe.hp / foe.maxHP) * 100 + "%" }}
              ></div>
            </div>
          </div>
          <div>Attack: d{foe.attackDie}</div>
        </div>
      )}
      {trading && <div className="inventory">{inventoryItems}</div>}
      <div className="button-section">
        {!dead && named && !inCombat && hero.isRested && (
          <div className="button" onClick={handleEmbark}>
            Embark
          </div>
        )}
        {!dead && named && !inCombat && hero.isRested && !trading && (
          <div className="button" onClick={handleTrade}>
            Trade
          </div>
        )}
        {!hero.isRested && !inCombat && !dead && (
          <div className="button" onClick={handleRest}>
            Rest
          </div>
        )}
        {inCombat && (
          <div className="button" onClick={handleAttack}>
            Attack
          </div>
        )}
        {dead && (
          <div className="button" onClick={handleResurrection}>
            Rise again
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
