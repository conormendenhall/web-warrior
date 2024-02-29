import { useState } from "react";

import { Foes } from "./foes";
import { FreshHero } from "./hero";
import { FreshInventory } from "./items";

import { Messages } from "./Messages";
import { CharacterSheet } from "./CharacterSheet";
import { MerchantInventory } from "./MerchantInventory";
import { Toast } from "./Toast";

import "./App.scss";
import { Combat } from "./Combat";

const App = () => {
  const [hero, setHero] = useState(FreshHero);
  const [heroStatus, setHeroStatus] = useState({});
  const [foe, setFoe] = useState(Foes[0]);
  const [showFoes, setShowFoes] = useState(false);
  const [merchantInventory, setMerchantInventory] = useState(FreshInventory);
  const [messages, setMessages] = useState([""]);
  const [toast, setToast] = useState("");
  const [isNamed, setIsNamed] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [isRested, setIsRested] = useState(true);
  const [isVisitingShrine, setIsVisitingShrine] = useState(false);
  const [isComingFromShrine, setIsComingFromShrine] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);
  const [isTurn, setIsTurn] = useState(true);
  const [isUnseen, setIsUnseen] = useState(hero.isCloaked);
  const [isDead, setIsDead] = useState(false);

  function addMessage(message) {
    const prunedMessages = [...messages, message];
    if (prunedMessages.length > 3) prunedMessages.shift();
    setMessages(prunedMessages);
  }

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

  function combat() {
    setIsInCombat(true);
    let message = `You encounter a ${foe.name}.`;

    if (rollDie(3) === 1) {
      if (hero.isCloaked) {
        message += ` It waits in ambush, but in your cloak you go unnoticed.`;
      } else {
        message += ` It ambushes you!`;
        setIsTurn(false);
      }
    } else if (isUnseen) message += ` In your cloak you go unnoticed.`;

    addMessage(message);
  }

  function handleSubmitName(e) {
    e.preventDefault();
    const trimmedName = hero.name.trim();
    setHero({ ...hero, name: trimmedName });
    setIsNamed(true);
    addMessage(`Well met, ${trimmedName}.`);
  }

  function handleChangeName(e) {
    setHero({ ...hero, name: e.target.value });
  }

  function handleEmbark() {
    setIsTrading(false);

    if (!isComingFromShrine && rollDie(3) === 1) {
      setIsVisitingShrine(true);
      setIsComingFromShrine(true);
      addMessage(
        " You stumble upon a moss-covered statue" +
          " of an angel embracing a demon."
      );
      return;
    }
    setIsComingFromShrine(false);
    combat();
  }

  const handleSneak = () => {
    addMessage(`You sneak past the ${foe.name}.`);
    setIsInCombat(false);
    setFoe(getRandomFoe(hero.level));
  };

  function handleAttack() {
    setIsUnseen(false);
    let heroAtkDmg = rollDie(hero.damageDie);
    let message = "";

    if (rollDie(5) === 1) {
      setToast("CRITICAL HIT!");
      heroAtkDmg = hero.damageDie;
      message += "Critical hit! ";
    }

    if (heroStatus.demonRounds > 0) {
      heroAtkDmg *= 2;
      message += "Demonic energy surges through you. ";
      setHeroStatus({ ...heroStatus, demonRounds: heroStatus.demonRounds - 1 });
    }
    message += `You strike the ${foe.name} for ${heroAtkDmg} damage. `;

    const newFoeHP = foe.hp - heroAtkDmg;
    setFoe({ ...foe, hp: newFoeHP });

    if (newFoeHP > 0) {
      message += `It still stands, sneering at you.`;
      addMessage(message);
      setIsTurn(false);
    } else {
      defeatFoe(hero, foe, message);
    }
  }

  function defeatFoe(hero, foe, message) {
    message += "It falls dead at your feet. ";
    let newXP = hero.xp + foe.maxHP + foe.damageDie;
    let newLevelXP = hero.levelXP;
    let newMaxHP = hero.maxHP;
    let newHP = hero.hp;
    let newLevel = hero.level;
    const loot = rollDie(foe.maxHP + foe.damageDie);
    message += `You loot it for ${loot} gold.`;

    if (newXP >= hero.levelXP) {
      newXP -= hero.levelXP;
      newLevelXP = hero.levelXP + Math.floor(hero.levelXP / 3);
      newMaxHP = hero.maxHP + 3;
      newHP = newMaxHP;
      newLevel = hero.level + 1;
      setToast("LEVEL UP!");
      message += ` ${hero.name} reached level ${newLevel}!`;
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
    setIsInCombat(false);
    setFoe(getRandomFoe(newLevel));
    addMessage(message);

    if (hero.isCloaked) setIsUnseen(true);
  }

  function handleDefend() {
    let message = "";
    let foeAtkDmg = rollDie(foe.damageDie);

    if (hero.reflectDie > 0 && rollDie(hero.reflectDie) === 1) {
      message +=
        ` The ${foe.name} attacks, ` +
        `but ${foeAtkDmg} damage reflects off your shield back at it.`;
      if (foe.hp - foeAtkDmg < 0) {
        defeatFoe(hero, foe, message);

        return;
      }
      setFoe({ ...foe, hp: foe.hp - foeAtkDmg });
      addMessage(message);
    } else if (hero.deflectDie > 0 && rollDie(hero.deflectDie) === 1) {
      message += ` The ${foe.name} attacks, but you deflect it with your shield.`;
      addMessage(message);
    } else {
      if (heroStatus.angelRounds > 0) {
        foeAtkDmg = Math.floor(foeAtkDmg / 2);
        message += " A guardian angel protects you.";
        setHeroStatus({
          ...heroStatus,
          angelRounds: heroStatus.angelRounds - 1,
        });
      }
      let dmgReduction = 0;

      if (hero.armorDie > 0) {
        dmgReduction = rollDie(hero.armorDie);
        foeAtkDmg = Math.max(foeAtkDmg - dmgReduction, 0);
        message +=
          ` The ${foe.name}'s strike deals you ${foeAtkDmg} damage.` +
          ` Your armor negated ${dmgReduction} damage.`;
      } else {
        message += ` The ${foe.name}'s strike deals you ${foeAtkDmg} damage.`;
      }
      addMessage(message);

      if (hero.hp - foeAtkDmg > 0) {
        setHero({ ...hero, hp: hero.hp - foeAtkDmg });

        if (hero.hp - foeAtkDmg < hero.maxHP) setIsRested(false);
      } else {
        setHero({ ...hero, hp: 0 });
        setIsDead(true);
        setIsInCombat(false);
        message += ` You fall dead before the ${foe.name}.`;
        const rip = `Rest in Peace, ${hero.name}`;
        setMessages([message, rip]);
        setFoe(getRandomFoe(1));
        setMerchantInventory(FreshInventory);
      }
    }
    setIsTurn(true);
  }

  function handleTrade() {
    setIsTrading(true);
  }

  function handlePurchase(selection) {
    if (hero.gold >= selection.price) {
      const newDmgDie = selection.damageDie ?? hero.damageDie;
      const newArmorDie = selection.armorDie ?? hero.armorDie;
      const newDeflectDie = selection.deflectDie ?? hero.deflectDie;
      const newReflectDie = selection.reflectDie ?? hero.reflectDie;
      const newIsCloaked = selection.isCloaked ?? hero.isCloaked;
      selection.equipped = true;
      hero.equipment.forEach((item) => {
        if (
          (item.armorDie && selection.armorDie) ||
          (item.damageDie && selection.damageDie) ||
          (item.deflectDie && selection.deflectDie) ||
          (item.reflectDie && selection.reflectDie)
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
        reflectDie: newReflectDie,
        isCloaked: newIsCloaked,
        equipment: [...hero.equipment, selection],
      });
      setMerchantInventory(
        merchantInventory.filter((item) => item.name !== selection.name)
      );
      addMessage(selection.message);
    }
  }

  function handleRest() {
    const restPoints = rollDie(4);
    setHero({
      ...hero,
      hp: Math.min(hero.hp + restPoints, hero.maxHP),
    });
    setIsRested(true);
    addMessage(`You rest for ${restPoints} HP.`);
  }

  function handleAngel() {
    addMessage("A feeling of peace washes over you.");
    setIsVisitingShrine(false);
    setHeroStatus({ ...heroStatus, angelRounds: 3 });
  }

  function handleDemon() {
    addMessage("A wicked smirk curls across your lips.");
    setIsVisitingShrine(false);
    setHeroStatus({ ...heroStatus, demonRounds: 3 });
  }

  function handleShowDeath() {
    setShowFoes(true);
    setMessages([]);
  }

  function handleResurrection() {
    setMessages(["Hello again, warrior."]);
    setHero({ ...FreshHero, foesFelled: [], name: hero.name });
    setShowFoes(false);
    setIsDead(false);
    setIsRested(true);
  }

  const packageVersion = require("../package.json")?.version;

  return (
    <div className="App">
      <div className="header">
        {!isNamed ? (
          <form
            onSubmit={handleSubmitName}
            value={hero.name}
            className="name-form"
          >
            {packageVersion && <h1>v{packageVersion}</h1>}
            <h2>What is your name?</h2>
            <input
              placeholder="Nameless Warrior"
              onChange={handleChangeName}
              maxLength={18}
              autoFocus={true}
            />
            <button className="button" disabled={hero.name.trim().length === 0}>
              Submit
            </button>
          </form>
        ) : (
          <CharacterSheet
            creature={hero}
            heroStatus={heroStatus}
            showFoes={showFoes}
          />
        )}
        {isTrading ? (
          <MerchantInventory
            inventory={merchantInventory}
            hero={hero}
            handlePurchase={handlePurchase}
          />
        ) : (
          <Messages messages={messages} />
        )}
        <Toast toast={toast} setToast={setToast} />
        {isDead && (
          <div className="button-section">
            <button className="button" onClick={handleResurrection}>
              Rise Again
            </button>
            {!showFoes && hero.foesFelled?.length > 0 && (
              <button className="button" onClick={handleShowDeath}>
                Show Felled Foes
              </button>
            )}
          </div>
        )}
      </div>
      {isInCombat ? (
        <Combat
          foe={foe}
          isTurn={isTurn}
          handleAttack={handleAttack}
          handleDefend={handleDefend}
          isUnseen={isUnseen}
          handleSneak={handleSneak}
        />
      ) : (
        <>
          {isNamed && !isDead && (
            <>
              {isVisitingShrine ? (
                <div className="button-section">
                  <button className="button" onClick={handleAngel}>
                    Touch the Angel
                  </button>
                  <button className="button" onClick={handleDemon}>
                    Touch the Demon
                  </button>
                </div>
              ) : (
                <div className="button-section">
                  {isRested ? (
                    <button className="button" onClick={handleEmbark}>
                      Embark
                    </button>
                  ) : (
                    <button className="button" onClick={handleRest}>
                      Rest
                    </button>
                  )}
                  {!isTrading && (
                    <button className="button" onClick={handleTrade}>
                      Trade
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
