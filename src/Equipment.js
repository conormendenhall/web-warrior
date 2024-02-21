import { ItemDescription } from "./items";

import "./Equipment.scss";

export const Equipment = ({ equipment }) => {
  return (
    <div className="equipment">
      {equipment.map((item) => {
        const description = ItemDescription(item);

        return (
          <div
            key={item.name}
            className={"item" + (item.equipped ? " equipped" : "")}
          >
            <span>{item.name}</span>
            <span className="description">{description}</span>
          </div>
        );
      })}
    </div>
  );
};
