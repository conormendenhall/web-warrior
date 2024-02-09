import { useState } from "react";

import "./App.css";

function App() {
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [named, setNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const freshHero = {
    name: "Nameless Warrior",
    hp: 5,
    maxHP: 5,
    attackDie: 5,
    felledFoes: 0,
    isRested: true,
  };
  const [hero, setHero] = useState(freshHero);
  const [foe, setFoe] = useState({ name: "Goblin", hp: 4, attackDie: 5 });
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

  function handleEmbark(e) {
    setInCombat(true);
    e.preventDefault();
    setStatusMessage(`You encounter a ${foe.name}.`);
  }

  function handleAttack(e) {
    e.preventDefault();

    if (foe === null) return;

    const heroAtkDmg = rollDie(hero.attackDie);
    foe.hp -= heroAtkDmg;

    if (foe.hp > 0) {
      setFoe({ ...foe, hp: foe.hp });
      const foeAtkDmg = rollDie(foe.attackDie);
      setStatusMessage(
        `You strike the ${foe.name} for ${heroAtkDmg} damage. ` +
          `The ${foe.name} still stands, sneering at you. ` +
          `The ${foe.name} attacks for ${foeAtkDmg} damage.`
      );
      if (hero.hp - foeAtkDmg > 0) {
        setHero({ ...hero, hp: hero.hp - foeAtkDmg, isRested: false });
      } else {
        setDead(true);
        setInCombat(false);
        setStatusMessage(
          `The ${foe.name} struck you down. Rest in Peace, ${hero.name}`
        );
      }
    } else {
      setFoe({ name: "Goblin", hp: 4, attackDie: 3 });
      hero.felledFoes++;
      setHero({ ...hero, felledFoes: hero.felledFoes });
      setStatusMessage(
        `You deal ${heroAtkDmg} damage, and the ${foe.name} falls dead at your feet.`
      );
      setInCombat(false);
    }
  }

  function handleRest(e) {
    e.preventDefault();
    const restPoints = rollDie(4);
    setHero({
      ...hero,
      hp: Math.min(hero.hp + restPoints, hero.maxHP),
      isRested: true,
    });
    setStatusMessage(`You rest for ${restPoints} HP.`);
  }

  function handleResurrection(e) {
    e.preventDefault();
    setHero(freshHero);
    setNamed(false);
    setDead(false);
  }

  return (
    <div className="App">
      <pre>Hero: {JSON.stringify(hero, null, 2)}</pre>
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
      {!hero.isRested && !inCombat && (
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
