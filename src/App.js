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
    lootDie: 8,
  };
  const freshInventory = [
    {
      name: "Shield",
      price: 8,
      message: "Ah, the trusty shield. May it guard you well.",
    },
    {
      name: "Leather Armor",
      price: 10,
      message: "You think this will protect you? Good luck.",
    },
    {
      name: "Morning Star",
      price: 12,
      message: "So, you lust for blood. Heh heh...",
    },
    {
      name: "Chain Mail",
      price: 14,
      message: "See these links? They may save your hide.",
    },
    {
      name: "Claymore",
      price: 16,
      message: "Strike true, warrior.",
    },
    {
      name: "Scale Armor",
      price: 16,
      message: "Ah, look how it shimmers. Heh...",
    },
    {
      name: "Lucerne",
      price: 18,
      message: "Be careful where you swing that thing.",
    },
    {
      name: "Plate Armor",
      price: 20,
      message: "This steel is nigh impenetrable.",
    },
    {
      name: "Cloak of Invisibility",
      price: 40,
      message: "I wonder, what will you do when no one can see you?",
    },
  ];
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [named, setNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [trading, setTrading] = useState(false);
  const [inventory, setInventory] = useState(freshInventory);
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
    const message =
      inventory.length > 0
        ? "Hello, weary traveler. See anything you like?"
        : "You've cleaned me out. I must head back to town to restock the caravan.";
    setStatusMessage(message);
  }

  function handlePurchase(selection) {
    if (hero.gold >= selection.price) {
      setHero({ ...hero, gold: (hero.gold -= selection.price) });
      setInventory(inventory.filter((item) => item.name !== selection.name));
      setStatusMessage(selection.message);
    }
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
      hero.gold += rollDie(foe.lootDie);
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
          <form onSubmit={handleSubmitName} className="name-form">
            <input
              defaultValue="Nameless Warrior"
              onChange={handleChangeName}
            />
            <button className="button" disabled={hero.name.length === 0}>
              Submit
            </button>
          </form>
        )}
        {trading && (
          <MerchantInventory
            inventory={inventory}
            heroGold={hero.gold}
            handlePurchase={handlePurchase}
          />
        )}
      </div>
      {inCombat && <CharacterSheet creature={foe} />}
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
