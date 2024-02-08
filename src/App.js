import { useState } from "react";

import "./App.css";

function App() {
  const [warriorName, setWarriorName] = useState("Nameless Warrior");
  const [status, setStatus] = useState("unsubmitted");

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitted");
  }
  function handleChange(e) {
    setWarriorName(e.target.value);
  }

  const [hero, setHero] = useState({});
  const [foe, setFoe] = useState({});

  let welcome = "What is your name?";
  if (status === "submitted") {
    welcome = `Well met, ${warriorName}.`;
    hero.name = warriorName;
    hero.hp = 5;
    hero.attackDie = 5;

    foe.name = "Goblin";
    foe.hp = 4;
    foe.attackDie = 3;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>{welcome}</p>
        {status !== "submitted" && (
          <form onSubmit={handleSubmit}>
            <input value={warriorName} onChange={handleChange} />
            <button disabled={warriorName.length === 0}>Submit</button>
          </form>
        )}
        <div>Hero: {JSON.stringify(hero)}</div>
        <div>Foe: {JSON.stringify(foe)}</div>
      </header>
    </div>
  );
}

export default App;
