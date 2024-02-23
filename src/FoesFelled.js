import { Foes } from "./foes";

import "./FoesFelled.scss";

export const FoesFelled = ({ foesFelled, showFoes }) => {
  return (
    <div className={"foes-felled"}>
      Foes Felled: {foesFelled.length}
      <div className={`foes-list${showFoes ? " show" : ""}`}>
        {Foes.map((foeType) => {
          const count = foesFelled.filter(
            (foe) => foe.name === foeType.name
          ).length;

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
