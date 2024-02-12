export const MerchantInventory = ({ inventory, heroGold, handlePurchase }) => {
  const inventoryItems = inventory.map((item) => (
    <tr
      key={item.name}
      onClick={() => handlePurchase(item.name, item.price)}
      className={heroGold < item.price ? "disabled" : ""}
    >
      <td>{item.name}</td>
      <td>{item.price} GP</td>
    </tr>
  ));

  return (
    <table className="inventory">
      <tbody>{inventoryItems}</tbody>
    </table>
  );
};