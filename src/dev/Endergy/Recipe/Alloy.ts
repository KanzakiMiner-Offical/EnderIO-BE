Callback.addCallback("PreLoaded", function() {
  SmelterRecipe.addRecipe({
    ingredient1: { id: 13, data: 0, count: 1 },
    ingredient2: { id: 318, data: 0, count: 1 },
    ingredient3: { id: 4, data: 0, count: 1 },
    result: { id: ItemID.crudeSteel, count: 1, data: 0 },
    energy: 5000
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.dustPulsating, data: 0, count: 1 },
    ingredient2: { id: VanillaItemID.gold_ingot, data: 0, count: 1 },
    // ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.crystalline, count: 1, data: 0 },
    energy: 10000
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.redstone, data: 0, count: 1 },
    ingredient2: { id: ItemID.ingotSilver, data: 0, count: 1 },
    ingredient3: { id: VanillaItemID.glowstone_dust, data: 0, count: 1 },
    result: { id: ItemID.energeticSilver, count: 1, data: 0 },
    energy: 10000
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.ender_pearl, data: 0, count: 1 },
    ingredient2: { id: ItemID.energeticSilver, data: 0, count: 1 },
    result: { id: ItemID.vividAlloy, count: 1, data: 0 },
    energy: 10000
  });
});