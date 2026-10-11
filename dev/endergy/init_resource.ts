EnderCore.createResourceItem("crudeSteel", "Crude Steel");
EnderCore.createResourceItem("crystalline", "Crystalline");
EnderCore.createResourceItem("melodic", "Melodic");
EnderCore.createResourceItem("stellar", "Stellar");
EnderCore.createResourceItem("crystallinePink", "Crystalline Pink Slime");
EnderCore.createResourceItem("energeticSilver", "Energetic Silver");
EnderCore.createResourceItem("vividAlloy", "Vivid Alloy");
EnderCore.createResourceBlock("crudeSteel", "Crude Steel");
EnderCore.createResourceBlock("crystalline", "Crystalline");
EnderCore.createResourceBlock("melodic", "Melodic");
EnderCore.createResourceBlock("stellar", "Stellar");
EnderCore.createResourceBlock("crystallinePink", "Crystalline Pink Slime");
EnderCore.createResourceBlock("energeticSilver", "Energetic Silver");
EnderCore.createResourceBlock("vividAlloy", "Vivid Alloy");

ItemRegistry.createItem("ingotSilver", {
  name: "Silver Ingot",
  icon: "ingot_silver",
});
ItemRegistry.createItem("ingotLead", {
  name: "Lead Ingot",
  icon: "ingot_lead",
});
ItemRegistry.createItem("nuggetSilver", {
  name: "Silver Ingot",
  icon: "nugget_silver",
});
ItemRegistry.createItem("nuggetLead", {
  name: "Lead Nugget",
  icon: "nugget_lead",
});
ItemRegistry.createItem("dustSilver", { name: "Silver Ingot", icon: "dust_silver" });
ItemRegistry.createItem("dustLead", { name: "Lead Dust", icon: "dust_lead" });

function addRecipeIngot(id: string, nug: string) {
  Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID[id], count: 1, data: 0 }, ["bbb", "bbb", "bbb"], ["b", ItemID[nug], 0]);
    Recipes.addShapeless({ id: ItemID[nug], count: 9, data: 0 }, [{ id: ItemID[id], data: 0 }]);
  });
}

addRecipeIngot("ingotSilver", "nuggetSilver");
addRecipeIngot("ingotLead", "nuggetLead");

Callback.addCallback("PreLoaded", function () {
  Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
  Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
  if (IC2Integration) {
    Recipes.addShaped(
      { id: ItemID.silverCapacitor, count: 1, data: 0 },
      [" ab", "aca", "ba"],
      ["b", ItemID.dustInfinity, 0, "a", ItemID.nuggetSilver, 0, "c", ItemID.ingotLead, 0],
    );
  } else {
    Recipes.addShaped(
      { id: ItemID.silverCapacitor, count: 1, data: 0 },
      [" ab", "aca", "ba"],
      ["b", ItemID.dustInfinity, 0, "a", ItemID.nuggetSilver, 0, "c", ItemID.electricalSteel, 0],
    );
  }

  SmelterRecipe.addRecipe({
    ingredient1: { id: 13, data: 0, count: 1 },
    ingredient2: { id: 318, data: 0, count: 1 },
    ingredient3: { id: 4, data: 0, count: 1 },
    result: { id: ItemID.crudeSteel, count: 1, data: 0 },
    energy: 5000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.dustPulsating, data: 0, count: 1 },
    ingredient2: { id: VanillaItemID.gold_ingot, data: 0, count: 1 },
    // ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.crystalline, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.redstone, data: 0, count: 1 },
    ingredient2: { id: ItemID.ingotSilver, data: 0, count: 1 },
    ingredient3: { id: VanillaItemID.glowstone_dust, data: 0, count: 1 },
    result: { id: ItemID.energeticSilver, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.ender_pearl, data: 0, count: 1 },
    ingredient2: { id: ItemID.energeticSilver, data: 0, count: 1 },
    result: { id: ItemID.vividAlloy, count: 1, data: 0 },
    energy: 10000,
  });
});
