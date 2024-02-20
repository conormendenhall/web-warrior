import { ItemDescription } from "./items";

import "./MerchantInventory.scss";

export const MerchantInventory = ({ inventory, heroGold, handlePurchase }) => {
  const inventoryItems = inventory.map((item) => {
    const description = ItemDescription(item);

    return (
      <div
        key={item.name}
        onClick={() => handlePurchase(item)}
        role="button"
        className={"item" + (heroGold < item.price ? " disabled" : "")}
      >
        <span>{item.name}</span>
        <div className="info">
          <div>{item.price} GP</div>
          <div className="description">{description}</div>
        </div>
      </div>
    );
  });

  return <div className="merchant-inventory">{inventoryItems}</div>;
};
