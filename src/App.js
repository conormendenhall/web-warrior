import { useState } from "react";

import { ActionButtons } from "./ActionButtons";
import { CharacterSheet } from "./CharacterSheet";
import { MerchantInventory } from "./MerchantInventory";
import { Foes } from "./foes";
import { FreshHero } from "./hero";
import { FreshInventory } from "./items";
import { FoesFelled } from "./FoesFelled";

import "./App.scss";

const App = () => {
  const [statusMessage, setStatusMessage] = useState("What is your name?");
  const [isNamed, setIsNamed] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [trading, setTrading] = useState(false);
  const [merchantInventory, setMerchantInventory] = useState(FreshInventory);
  const [hero, setHero] = useState(FreshHero);
  const [foe, setFoe] = useState(Foes[1]);
  const [isRested, setIsRested] = useState(true);
  const [isDead, setIsDead] = useState(false);
  const [isUnseen, setIsUnseen] = useState(hero.isCloaked);

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function getRandomFoe(heroLevel) {
    const foesInRange = Foes.filter(
      (foe) => Math.abs(foe.level - heroLevel) < 2
    );
    let randomFoe = Foes[Foes.length - 1];
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
        setHero({ ...hero, hp: hero.hp - foeAtkDmg });

        if (hero.hp - foeAtkDmg < hero.maxHP) setIsRested(false);
      } else {
        setHero({ ...hero, hp: 0 });
        setIsDead(true);
        setInCombat(false);
        message += ` You fall dead before the ${foe.name}. Rest in Peace, ${hero.name}`;
        setStatusMessage(message);
        setFoe(getRandomFoe(1));
        setMerchantInventory(FreshInventory);
      }
    }
  }

  function handleSubmitName(e) {
    e.preventDefault();
    setIsNamed(true);
    setStatusMessage(`Well met, ${hero.name}.`);
  }

  function handleChangeName(e) {
    setHero({ ...hero, name: e.target.value });
  }

  function handleEmbark() {
    setTrading(false);
    setInCombat(true);
    let message = `You encounter a ${foe.name}.`;

    if (rollDie(3) === 1) {
      if (hero.isCloaked) {
        message += ` It waits in ambush, but in your cloak you go unnoticed.`;
        setStatusMessage(message);

        return;
      }
      message += ` It ambushes you!`;
      setStatusMessage(message);
      foeAttack(message);

      return;
    }
    if (isUnseen) message += ` In your cloak you go unnoticed.`;
    setStatusMessage(message);
  }

  const handleSneak = () => {
    setStatusMessage(`You sneak past the ${foe.name}.`);
    setInCombat(false);
    setFoe(getRandomFoe(hero.level));

    if (hero.hp < hero.maxHP) setIsRested(false);
  };

  function handleAttack() {
    setIsUnseen(false);
    const heroAtkDmg = rollDie(hero.damageDie);
    const newFoeHP = foe.hp - heroAtkDmg;
    setFoe({ ...foe, hp: newFoeHP });
    let message = `You strike the ${foe.name} for ${heroAtkDmg} damage.`;

    if (newFoeHP > 0) {
      foeAttack(message);
    } else {
      let victoryMessage = `You strike the ${foe.name} for ${heroAtkDmg} damage, and it falls dead at your feet.`;
      let newXP = hero.xp + foe.maxHP + foe.damageDie;
      let newLevelXP = hero.levelXP;
      let newMaxHP = hero.maxHP;
      let newHP = hero.hp;
      let newLevel = hero.level;
      const loot = rollDie(foe.maxHP + foe.damageDie);
      victoryMessage += ` You loot it for ${loot} gold.`;

      if (newXP >= hero.levelXP) {
        newXP -= hero.levelXP;
        newLevelXP = hero.levelXP + Math.floor(hero.levelXP / 3);
        newMaxHP = hero.maxHP + 3;
        newHP = newMaxHP;
        newLevel = hero.level + 1;
        victoryMessage += ` ${hero.name} reached level ${hero.level + 1}!`;
        setIsRested(true);
      }
      hero.foesFelled.push(foe);

      setHero({
        ...hero,
        foesFelled: hero.foesFelled,
        xp: newXP,
        levelXP: newLevelXP,
        maxHP: newMaxHP,
        hp: newHP,
        level: newLevel,
        gold: hero.gold + loot,
      });
      setStatusMessage(victoryMessage);
      setInCombat(false);
      setFoe(getRandomFoe(newLevel));

      if (hero.isCloaked) setIsUnseen(true);
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
      selection.equipped = true;
      hero.equipment.forEach((item) => {
        if (
          (item.armorDie && selection.armorDie) ||
          (item.damageDie && selection.damageDie) ||
          (item.deflectDie && selection.deflectDie)
        ) {
          item.equipped = false;
        }
      });
      setHero({
        ...hero,
        gold: hero.gold - selection.price,
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
    });
    setIsRested(true);
    setStatusMessage(`You rest for ${restPoints} HP.`);
  }

  function handleResurrection() {
    setStatusMessage("Hello again, warrior.");
    setHero({ ...FreshHero, foesFelled: [], name: hero.name });
    setIsDead(false);
    setIsRested(true);
  }

  return (
    <div className="App">
      <div className="header">
        {isNamed && <CharacterSheet creature={hero} />}
        <p className="status-message">{statusMessage}</p>
        {!isNamed && (
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
        {isDead && (
          <div className="button-section">
            <div className="button" onClick={handleResurrection}>
              Rise Again
            </div>
          </div>
        )}
        {trading && (
          <MerchantInventory
            inventory={merchantInventory}
            hero={hero}
            handlePurchase={handlePurchase}
          />
        )}
      </div>
      {inCombat && <CharacterSheet creature={foe} />}
      <ActionButtons
        isDead={isDead}
        inCombat={inCombat}
        isRested={isRested}
        named={isNamed}
        trading={trading}
        unseen={isUnseen}
        handleAttack={handleAttack}
        handleEmbark={handleEmbark}
        handleRest={handleRest}
        handleTrade={handleTrade}
        handleSneak={handleSneak}
      />
      {isDead && <FoesFelled foesFelled={hero.foesFelled} />}
    </div>
  );
};

export default App;
