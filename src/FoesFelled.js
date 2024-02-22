import { Foes } from "./foes";

import "./FoesFelled.scss";

export const FoesFelled = ({ foesFelled, hidden }) => {
  return (
    <div className={`foes-felled${hidden ? " hidden" : ""}`}>
      Foes Felled: {foesFelled.length}
      <div className="foes-list">
        {Foes.map((foeType) => {
          const count = foesFelled.filter(
            (foe) => foe.name === foeType.name
          ).length;
          if (count > 0) console.log(`${foeType.name}: ${count}`);

          return (
            count > 0 && (
              <div className="foe-type" key={foeType.name}>
                <span>{foeType.name}: </span>
                <span>{count}</span>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};
