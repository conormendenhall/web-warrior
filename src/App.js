import { useState } from "react";

import { ActionButtons } from "./ActionButtons";
import { CharacterSheet } from "./CharacterSheet";
import { MerchantInventory } from "./MerchantInventory";

import "./App.scss";

const App = () => {
  const freshHero = {
    name: "Nameless Warrior",
    level: 20,
    xp: 0,
    levelXP: 20,
    hp: 5,
    maxHP: 5,
    damageDie: 5,
    armorDie: 0,
    deflectDie: 0,
    isCloaked: false,
    isRested: true,
    gold: 0,
    equipment: [],
    felledFoes: 0,
  };
  const foes = [
    {
      name: "Goblin",
      level: 1,
      hp: 5,
      maxHP: 5,
      damageDie: 3,
    },
    { name: "Skeleton", level: 2, hp: 6, maxHP: 6, damageDie: 5 },
    { name: "Brigand", level: 3, hp: 8, maxHP: 8, damageDie: 6 },
    { name: "Cultist", level: 3, hp: 6, maxHP: 6, damageDie: 8 },
    { name: "Hag", level: 4, hp: 8, maxHP: 8, damageDie: 9 },
    { name: "Manticore", level: 5, hp: 12, maxHP: 12, damageDie: 8 },
    {
      name: "Bog Shambler",
      level: 5,
      hp: 14,
      maxHP: 14,
      damageDie: 6,
    },
    {
      name: "Cyclops",
      level: 6,
      hp: 13,
      maxHP: 13,
      damageDie: 10,
    },
    {
      name: "Demonoid",
      level: 6,
      hp: 9,
      maxHP: 9,
      damageDie: 14,
    },
    { name: "Warlock", level: 7, hp: 11, maxHP: 11, damageDie: 15 },
    { name: "Vampire", level: 7, hp: 13, maxHP: 13, damageDie: 13 },
    { name: "Lich", level: 8, hp: 16, maxHP: 16, damageDie: 13 },
    { name: "Wyvern", level: 9, hp: 16, maxHP: 16, damageDie: 16 },
    {
      name: "Leviathan",
      level: 100,
      hp: 50,
      maxHP: 50,
      damageDie: 35,
    },
  ];
  const freshInventory = [
    {
      name: "Shield",
      price: 8,
      message: "Ah, the trusty shield. May it guard you well.",
      deflectDie: 5,
    },
    {
      name: "Leather Armor",
      price: 10,
      message: "You think this will protect you? Good luck.",
      armorDie: 4,
    },
    {
      name: "Morning Star",
      price: 12,
      message: "So, you lust for blood. Heh heh...",
      damageDie: 8,
    },
    {
      name: "Chain Mail",
      price: 14,
      message: "See these links? They may save your hide.",
      armorDie: 6,
    },
    {
      name: "Claymore",
      price: 16,
      message: "Strike true, warrior.",
      damageDie: 10,
    },
    {
      name: "Scale Armor",
      price: 16,
      message: "Ah, look how it shimmers. Heh...",
      armorDie: 8,
    },
    {
      name: "Lucerne",
      price: 18,
      message: "Be careful where you swing that thing.",
      damageDie: 12,
    },
    {
      name: "Plate Armor",
      price: 20,
      message: "This steel is nigh impenetrable.",
      armorDie: 10,
    },
    {
      name: "Cloak of Invisibility",
      price: 40,
      message: "I wonder, what will you do when no one can see you?",
      isCloaked: true,
    },
  ];
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [named, setNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [trading, setTrading] = useState(false);
  const [merchantInventory, setMerchantInventory] = useState(freshInventory);
  const [hero, setHero] = useState(freshHero);
  const [foe, setFoe] = useState(getRandomFoe);
  const [dead, setDead] = useState(false);

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function getRandomFoe() {
    const foesInRange = foes.filter(
      (foe) => Math.abs(foe.level - hero.level) < 2
    );
    let randomFoe = foes[foes.length - 1];
    if (foesInRange.length > 0) {
      randomFoe = foesInRange[Math.floor(Math.random() * foesInRange.length)];
    }
    return randomFoe;
  }

  function foeAttack(message) {
    if (foe.hp < foe.maxHP) message += ` It still stands, sneering at you.`;

    if (hero.deflectDie > 0 && rollDie(hero.deflectDie) === 1) {
      message += ` The ${foe.name} attacks, but you deflect it with your shield.`;
      setStatusMessage(message);
    } else {
      message += ` The ${foe.name} strikes.`;
      let foeAtkDmg = rollDie(foe.damageDie);
      let dmgReduction = 0;

      if (hero.armorDie > 0) {
        dmgReduction = rollDie(hero.armorDie);
        foeAtkDmg = Math.max(foeAtkDmg - dmgReduction, 0);
        message += ` Your armor negates ${dmgReduction} damage.`;
      }
      message += ` You take ${foeAtkDmg} damage.`;
      setStatusMessage(message);

      if (hero.hp - foeAtkDmg > 0) {
        setHero({ ...hero, hp: (hero.hp -= foeAtkDmg), isRested: false });
      } else {
        setHero({ ...hero, hp: 0 });
        setDead(true);
        setInCombat(false);
        message += ` You fall dead before the ${foe.name}. Rest in Peace, ${hero.name}`;
        setStatusMessage(message);
        setFoe(getRandomFoe());
        setMerchantInventory(freshInventory);
      }
    }
  }

  function levelUp(hero) {
    hero.xp -= hero.levelXP;
    hero.levelXP += Math.floor(hero.levelXP / 5);
    hero.maxHP += 3;
    hero.hp = hero.maxHP;
    return hero.level++;
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
    setTrading(false);
    setInCombat(true);
    let message = `You encounter a ${foe.name}.`;
    if (rollDie(2) === 1) {
      message += ` It ambushes you!`;
      foeAttack(message);
      return;
    }
    setStatusMessage(message);
  }

  function handleAttack() {
    if (foe === null) return;

    const heroAtkDmg = rollDie(hero.damageDie);
    setFoe({ ...foe, hp: (foe.hp -= heroAtkDmg) });
    let message = `You strike the ${foe.name} for ${heroAtkDmg} damage.`;

    if (foe.hp > 0) {
      foeAttack(message);
    } else {
      let victoryMessage = `You strike the ${foe.name} for ${heroAtkDmg} damage, and it falls dead at your feet.`;
      hero.felledFoes++;
      hero.xp += foe.maxHP + foe.damageDie;
      hero.gold += rollDie(foe.maxHP + foe.damageDie);

      if (hero.xp > hero.levelXP) {
        levelUp(hero);
        victoryMessage += ` ${hero.name} reached level ${hero.level}!`;
      }
      setStatusMessage(victoryMessage);
      setHero({ ...hero });
      setInCombat(false);
      setFoe(getRandomFoe());
    }
  }

  function handleTrade() {
    setTrading(true);
    const message =
      merchantInventory.length > 0
        ? "Hello, weary traveler. See anything you like?"
        : "You've cleaned me out. I must head back to town to restock the caravan.";
    setStatusMessage(message);
  }

  function handlePurchase(selection) {
    if (hero.gold >= selection.price) {
      const newDmgDie = selection.damageDie ?? hero.damageDie;
      const newArmorDie = selection.armorDie ?? hero.armorDie;
      const newDeflectDie = selection.deflectDie ?? hero.deflectDie;
      const newIsCloaked = selection.isCloaked ?? hero.isCloaked;
      setHero({
        ...hero,
        gold: (hero.gold -= selection.price),
        damageDie: newDmgDie,
        armorDie: newArmorDie,
        deflectDie: newDeflectDie,
        isCloaked: newIsCloaked,
        equipment: [...hero.equipment, selection],
      });
      setMerchantInventory(
        merchantInventory.filter((item) => item.name !== selection.name)
      );
      setStatusMessage(selection.message);
    }
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
    setStatusMessage("Hello again, warrior.");
    setHero({ ...freshHero, name: hero.name });
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
            inventory={merchantInventory}
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
