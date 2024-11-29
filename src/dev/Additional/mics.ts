ItemRegistry.createItem("blackhole", {
  name: "Black Hole",
  icon: "black_hole",
});
Item.registerNameOverrideFunction("blackhole", (item: ItemInstance, name: string): string => {
  if (item.extra) {
    let quantity = item.extra.getInt("quantity");
    return name + "\n§7" + "Weight: " + quantity;
  }
  return name;
});

ItemRegistry.createItem("oreChip", {
  name: "Void Ore Processor",
  icon: "ore_chip",
});
ItemRegistry.createItem("resourceChip", {
  name: "Void Resource Processor",
  icon: "resource_chip",
});
