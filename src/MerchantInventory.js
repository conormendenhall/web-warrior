export const MerchantInventory = ({ heroGold }) => {
  let inventory = [
    { name: "Shield", price: 8 },
    { name: "Leather Armor", price: 10 },
    { name: "Morning Star", price: 12 },
    { name: "Chain Mail", price: 14 },
    { name: "Claymore", price: 16 },
    { name: "Scale Armor", price: 16 },
    { name: "Lucerne", price: 18 },
    { name: "Plate Armor", price: 20 },
    { name: "Cloak of Invisibility", price: 40 },
  ];
  const inventoryItems = inventory.map((item) => (
    <tr key={item.name} className={heroGold < item.price ? "disabled" : ""}>
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
