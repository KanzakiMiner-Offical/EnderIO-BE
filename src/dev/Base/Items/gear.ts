namespace EnderCore {
  export function createGearItem(id: string, name: string, type: string): void {
    let res = "item_material_gear_" + type;
    ItemRegistry.createItem(id, { name: name, icon: res });
  }
}

let GearName = {
  gear_energized: "Energized Bimetal Gear",
  gear_iron: "Infinity Bimetal Gear",
  gear_stone: "Stone Compound Gear",
  gear_vibrant: "Vibrant Bimetal Gear",
  gear_wood: "Wooden Gear",
  gear_darksteel: "Dark Bimetal Gear",
};

EnderCore.createGearItem("woodGear", GearName.gear_wood, "wood");
EnderCore.createGearItem("stoneGear", GearName.gear_stone, "stone");
EnderCore.createGearItem("ironGear", GearName.gear_iron, "iron");
EnderCore.createGearItem("darkSteelGear", GearName.gear_darksteel, "darksteel");

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: ItemID.darkSteelGear, count: 1, data: 0 },
    ["bbb", "bab", "bbb"],
    ["b", ItemID.darkSteelNugget, 0, "a", ItemID.ironGear, 0],
  );
  // Iron
  Recipes.addShaped(
    { id: ItemID.ironGear, count: 1, data: 0 },
    ["cbc", "bab", "cbc"],
    ["b", VanillaItemID.iron_ingot, 0, "a", ItemID.stoneGear, 0, "c", VanillaItemID.iron_nugget, 0],
  );
  Recipes.addShaped(
    { id: ItemID.ironGear, count: 1, data: 0 },
    ["cbc", "bab", "cbc"],
    ["b", VanillaItemID.iron_ingot, 0, "a", ItemID.dustInfinity, 0, "c", VanillaItemID.iron_nugget, 0],
  );
  // Stone
  Recipes.addShaped({ id: ItemID.stoneGear, count: 1, data: 0 }, [" b ", "bab", " b "], ["b", 4, 0, "a", ItemID.woodGear, 0]);
  Recipes.addShaped({ id: ItemID.stoneGear, count: 1, data: 0 }, ["cbc", "b b", "cbc"], ["b", 4, 0, "c", VanillaItemID.stick, 0]);
  // Wooden
  Recipes.addShaped({ id: ItemID.woodGear, count: 1, data: 0 }, [" b ", "b b", " b "], ["b", VanillaItemID.stick, 0]);
});
