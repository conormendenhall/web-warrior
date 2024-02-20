export const FreshInventory = [
  {
    name: "Shield",
    price: 8,
    deflectDie: 5,
    message: "Ah, the trusty shield. May it guard you well.",
  },
  {
    name: "Leather Armor",
    price: 10,
    armorDie: 4,
    message: "You think this will protect you? Good luck.",
  },
  {
    name: "Morning Star",
    price: 12,
    damageDie: 8,
    message: "So, you lust for blood. Heh heh...",
  },
  {
    name: "Chain Mail",
    price: 14,
    armorDie: 6,
    message: "See these links? They may save your hide.",
  },
  {
    name: "Claymore",
    price: 16,
    damageDie: 10,
    message: "Strike true, warrior.",
  },
  {
    name: "Scale Armor",
    price: 16,
    armorDie: 8,
    message: "Ah, look how it shimmers. Heh...",
  },
  {
    name: "Lucerne",
    price: 18,
    damageDie: 12,
    message: "Be careful where you swing that thing.",
  },
  {
    name: "Plate Armor",
    price: 20,
    armorDie: 10,
    message: "This steel is nigh impenetrable.",
  },
  {
    name: "Cloak of Invisibility",
    price: 40,
    isCloaked: true,
    message: "I wonder, what will you do when no one can see you?",
  },
];

export function ItemDescription(item) {
  let tooltipText = "";

  if (item.damageDie) {
    tooltipText = `d${item.damageDie} damage`;
  } else if (item.armorDie) {
    tooltipText = `d${item.armorDie} armor`;
  } else if (item.deflectDie) {
    tooltipText = `d${item.deflectDie} deflect`;
  } else if (item.isCloaked) {
    tooltipText = "stealth";
  }
  return tooltipText;
}
