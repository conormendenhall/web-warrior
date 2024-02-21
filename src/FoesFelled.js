import { Foes } from "./foes";

export const FoesFelled = ({ foesFelled }) => {
  return (
    <div className="foes-felled">
      Foes Felled: {foesFelled.length}
      <div className="foes-tooltip">
        {Foes.map((foeType) => {
          const count = foesFelled.filter(
            (foe) => foe.name === foeType.name
          ).length;
          if (count > 0) console.log(`${foeType.name}: ${count}`);

          return (
            count > 0 && (
              <div key={foeType.name}>
                {foeType.name}: {count}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};
