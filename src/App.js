import { useState } from "react";

import "./App.scss";

function App() {
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [named, setNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const freshHero = {
    name: "Nameless Warrior",
    level: 1,
    xp: 0,
    levelXP: 20,
    hp: 5,
    maxHP: 5,
    attackDie: 5,
    felledFoes: 0,
    isRested: true,
  };
  const freshGoblin = {
    name: "Goblin",
    hp: 5,
    maxHP: 5,
    attackDie: 3,
  };
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
    hero.name = e.target.value;
  }

  function handleEmbark() {
    setInCombat(true);
    setStatusMessage(`You encounter a ${foe.name}.`);
  }

  function handleAttack() {
    if (foe === null) return;

    const heroAtkDmg = rollDie(hero.attackDie);
    foe.hp -= heroAtkDmg;

    if (foe.hp > 0) {
      setFoe({ ...foe });
      const foeAtkDmg = rollDie(foe.attackDie);
      setStatusMessage(
        `You strike the ${foe.name} for ${heroAtkDmg} damage. ` +
          `The ${foe.name} still stands, sneering at you. ` +
          `The ${foe.name} attacks for ${foeAtkDmg} damage.`
      );
      if (hero.hp - foeAtkDmg > 0) {
        hero.hp -= foeAtkDmg;
        hero.isRested = false;
        setHero({ ...hero });
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
    hero.hp = Math.min(hero.hp + restPoints, hero.maxHP);
    hero.isRested = true;
    setHero({ ...hero });
    setStatusMessage(`You rest for ${restPoints} HP.`);
  }

  function handleResurrection() {
    setHero(freshHero);
    setNamed(false);
    setDead(false);
  }

  return (
    <div className="App">
      <pre>Hero: {JSON.stringify(hero, null, 2)}</pre>
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
          <div>{hero.felledFoes} foes felled</div>
        </div>
      )}
      <p className="status-message">{statusMessage}</p>
      {!named && (
        <form onSubmit={handleSubmitName}>
          <input defaultValue="Nameless Warrior" onChange={handleChangeName} />
          <button disabled={hero.name.length === 0}>Submit</button>
        </form>
      )}
      {!dead && named && !inCombat && hero.isRested && (
        <button onClick={handleEmbark} className="bottom">
          Embark
        </button>
      )}
      {!hero.isRested && !inCombat && !dead && (
        <button onClick={handleRest} className="bottom">
          Rest
        </button>
      )}
      {inCombat && (
        <>
          <pre>Foe: {JSON.stringify(foe, null, 2)}</pre>
          <button onClick={handleAttack} className="bottom">
            Attack
          </button>
        </>
      )}
      {dead && (
        <button onClick={handleResurrection} className="bottom">
          Rise again
        </button>
      )}
    </div>
  );
}

export default App;
