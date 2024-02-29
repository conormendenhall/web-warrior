import { useState } from "react";

import { ItemDescription } from "./items";

import "./MerchantInventory.scss";

export const MerchantInventory = ({ inventory, hero, handlePurchase }) => {
  const [message, setMessage] = useState(
    inventory.length > 0
      ? "Hello, weary traveler. See anything you like?"
      : "You've cleaned me out. I must head back to town to restock the caravan."
  );

  const inventoryItems = inventory.map((item) => {
    const inferiorArmor = item.armorDie && item.armorDie < hero.armorDie;
    const inferiorDmg = item.damageDie && item.damageDie < hero.damageDie;
    const inferiorDeflect =
      item.deflectDie && item.deflectDie < hero.deflectDie;
    const inferiorItem = inferiorArmor || inferiorDmg || inferiorDeflect;
    const disabled = hero.gold < item.price || inferiorItem;
    const description = inferiorItem ? "inferior" : ItemDescription(item);
    const onClick = () => {
      if (disabled) return;
      setMessage(item.message);
      handlePurchase(item);
    };

    return (
      <div
        key={item.name}
        onClick={onClick}
        role="button"
        tabIndex="0"
        className={"item" + (disabled ? " disabled" : "")}
      >
        <span>{item.name}</span>
        <div className="info">
          <div>{item.price} GP</div>
          <div className="description">{description}</div>
        </div>
      </div>
    );
  });

  return (
    <>
      <p className="message">{message}</p>
      <div className="merchant-inventory">{inventoryItems}</div>
    </>
  );
};
