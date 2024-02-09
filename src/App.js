import { useState } from "react";

import "./App.css";

function App() {
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [heroNamed, setHeroNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [isHeroTurn, setIsHeroTurn] = useState(true);
  const [hero, setHero] = useState({ name: "Nameless Warrior" });
  const [foe, setFoe] = useState({ name: "Goblin", hp: 4, attackDie: 3 });

  function handleSubmitName(e) {
    e.preventDefault();
    setHeroNamed(true);
    setStatusMessage(`Well met, ${hero.name}.`);
    hero.hp = 5;
    hero.attackDie = 5;
    hero.felledFoes = 0;
  }

  function handleChangeName(e) {
    hero.name = e.target.value;
  }

  function handleEmbark(e) {
    setInCombat(true);
    e.preventDefault();
    console.log(JSON.stringify(foe));
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
      setHero({...hero, hp: hero.hp - foeAtkDmg})
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

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Hero: {JSON.stringify(hero)}</div>
        <div>{hero.name}</div>
        <div>HP {hero.hp}</div>
        <div>Attack {hero.attackDie}</div>
        <p>{statusMessage}</p>
        {!heroNamed && (
          <form onSubmit={handleSubmitName}>
            <input
              defaultValue="Nameless Warrior"
              onChange={handleChangeName}
            />
            <button disabled={hero.name.length === 0}>Submit</button>
          </form>
        )}
        {heroNamed && !inCombat && (
          <button onClick={handleEmbark}>Embark</button>
        )}
        {inCombat && isHeroTurn && (
          <>
            <div>Foe: {JSON.stringify(foe)}</div>
            <button onClick={handleAttack}>Attack</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
