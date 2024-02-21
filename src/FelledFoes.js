import { Foes } from "./foes";

export const FelledFoes = ({ felledFoes }) => {
  return (
    <div className="felled-foes">
      Foes Felled: {felledFoes.length}
      <div className="foes-tooltip">
        {Foes.map((foeType) => {
          const count = felledFoes.filter(
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
