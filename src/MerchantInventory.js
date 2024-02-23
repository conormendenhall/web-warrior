import { ItemDescription } from "./items";

import "./MerchantInventory.scss";

export const MerchantInventory = ({ inventory, hero, handlePurchase }) => {
  const inventoryItems = inventory.map((item) => {
    const inferiorArmor = item.armorDie && item.armorDie < hero.armorDie;
    const inferiorDmg = item.damageDie && item.damageDie < hero.damageDie;
    const inferiorDeflect =
      item.deflectDie && item.deflectDie < hero.deflectDie;
    const inferiorItem = inferiorArmor || inferiorDmg || inferiorDeflect;
    const disabled = hero.gold < item.price || inferiorItem;
    const description = inferiorItem ? "inferior item" : ItemDescription(item);

    return (
      <div
        key={item.name}
        onClick={() => handlePurchase(item)}
        role="button"
        className={
          "item" +
          (disabled ? " disabled" : "") +
          (inferiorItem ? " inferior" : "")
        }
      >
        <span>{item.name}</span>
        <div className="info">
          <div>{item.price} GP</div>
          <div className="description">{description}</div>
        </div>
      </div>
    );
  });

  const message =
    inventory.length > 0
      ? "Hello, weary traveler. See anything you like?"
      : "You've cleaned me out. I must head back to town to restock the caravan.";

  return (
    <>
      <p className="status-message">{message}</p>
      <div className="merchant-inventory">{inventoryItems}</div>
    </>
  );
};
