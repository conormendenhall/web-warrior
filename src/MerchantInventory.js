import "./MerchantInventory.scss";

export const MerchantInventory = ({ inventory, heroGold, handlePurchase }) => {
  const inventoryItems = inventory.map((item) => (
    <div
      key={item.name}
      onClick={() => handlePurchase(item)}
      role="button"
      className={"item" + (heroGold < item.price ? " disabled" : "")}
    >
      <span>{item.name}</span>
      <span>{item.price} GP</span>
    </div>
  ));

  return <div className="merchant-inventory">{inventoryItems}</div>;
};
