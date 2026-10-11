namespace EnderCore {
  export function createDyeItem(id: string, name: string, type: string): void {
    let res = "item_material_organic_" + type + "_dye";
    ItemRegistry.createItem(id, { name: name, icon: res });
  }

  export function createPowderItem(id: string, name: string, type: string) {
    let res = "item_material_powder_" + type;
    ItemRegistry.createItem(id, { name: name + " Powder", icon: res });
  }
}

EnderCore.createPowderItem("dustLapis", "Lapis Lazuli", "lapis_lazuli");
EnderCore.createPowderItem("dustQuarzt", "Quartz", "quartz");
EnderCore.createDyeItem("greenDye", "Organic Green Dye", "green");
EnderCore.createDyeItem("blackDye", "Organic Black Dye", "black");
EnderCore.createDyeItem("brownDye", "Organic Brown Dye", "brown");

ItemRegistry.createItem("clipAndTrim", {
  name: "Clippings and Trimmings",
  icon: "item_material_plantgreen",
});
ItemRegistry.createItem("twigAndPrun", {
  name: "Twigs and Prunings",
  icon: "item_material_plantbrown",
});
ItemRegistry.createItem("machineDye", {
  name: "Industrial Dye Blend",
  icon: "item_material_machine_dye",
});
ItemRegistry.createItem("soulMachineDye", {
  name: "Soul Attuned Powder Coating",
  icon: "item_material_soul_machine_dye",
});

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: ItemID.soulMachineDye, count: 6, data: 0 },
    [" pi", "pmp", "ip "],
    ["i", ItemID.brownDye, 0, "m", ItemID.blackDye, 0, "p", ItemID.dustQuarzt, 0],
  );

  Recipes.addShaped(
    { id: ItemID.machineDye, count: 6, data: 0 },
    ["fpi", "pmp", "ipf"],
    ["i", ItemID.greenDye, 0, "f", ItemID.dustLapis, 0, "m", ItemID.blackDye, 0, "p", ItemID.dustQuarzt, 0],
  );

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaTileID.tallgrass, data: 0 },
    result0: { id: ItemID.clipAndTrim, data: 0, chance: 0.6 },
    result1: { id: ItemID.clipAndTrim, data: 0, chance: 0.3 },
    result2: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    result3: { id: ItemID.twigAndPrun, data: 0, chance: 0.05 },
    energy: 1200,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaTileID.tallgrass, data: 2 },
    result0: { id: ItemID.clipAndTrim, data: 0, chance: 0.6 },
    result1: { id: ItemID.clipAndTrim, data: 0, chance: 0.3 },
    result2: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    result3: { id: ItemID.twigAndPrun, data: 0, chance: 0.05 },
    energy: 1200,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaTileID.double_plant, data: 0 },
    result0: { id: ItemID.clipAndTrim, data: 0, chance: 0.7 },

    result1: { id: ItemID.clipAndTrim, data: 0, chance: 0.3 },

    result2: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    result3: { id: ItemID.twigAndPrun, data: 0, chance: 0.05 },
    energy: 900,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: VanillaTileID.double_plant, data: 3 },
    result0: { id: ItemID.clipAndTrim, data: 0, chance: 0.7 },
    result1: { id: ItemID.clipAndTrim, data: 0, chance: 0.3 },
    result2: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    result3: { id: ItemID.twigAndPrun, data: 0, chance: 0.05 },
    energy: 900,
    by: "EnderIO",
  });

  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: 38, data: 0 },
    result0: { id: VanillaItemID.red_dye, data: 0, chance: 0.8 },
    result1: { id: VanillaItemID.red_dye, data: 0, chance: 0.6 },
    result2: { id: VanillaItemID.red_dye, data: 0, chance: 0.3 },
    result3: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    energy: 900,
    by: "EnderIO",
  });
  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: 37, data: 0 },
    result0: { id: VanillaItemID.yellow_dye, data: 0, chance: 0.8 },
    result1: { id: VanillaItemID.yellow_dye, data: 0, chance: 0.6 },
    result2: { id: VanillaItemID.yellow_dye, data: 0, chance: 0.3 },
    result3: { id: ItemID.clipAndTrim, data: 0, chance: 0.1 },
    energy: 900,
    by: "EnderIO",
  });
  RecipeRegistry.addCrusher({
    isGrinding: true,
    ingredient: { id: 32, data: 0 },
    result0: { id: ItemID.twigAndPrun, data: 0, chance: 0.7 },
    result1: { id: ItemID.twigAndPrun, data: 0, chance: 0.3 },
    result2: { id: ItemID.twigAndPrun, data: 0, chance: 0.1 },
    result3: { id: 0, data: 0, chance: 0 },
    energy: 900,
    by: "EnderIO",
  });
  // Green

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.green_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.greenDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.green_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.greenDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.clipAndTrim, data: 0, count: 12 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.greenDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.clipAndTrim, data: 0, count: 12 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.greenDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });
  // Brown

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.brown_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.brownDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.brown_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.brownDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.twigAndPrun, data: 0, count: 12 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.brownDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.twigAndPrun, data: 0, count: 12 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.brownDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.twigAndPrun, data: 0, count: 12 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.brownDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });

  // Black

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.dustCoal, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.blackDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.dustCoal, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.blackDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.black_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.slime_ball, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.blackDye, count: 2, data: 0 },
    energy: 2000,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.black_dye, data: 0, count: 6 },
    ingredient2: { id: VanillaItemID.egg, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: ItemID.blackDye, count: 2, data: 0 },
    energy: 1500,
    by: "EnderIO",
  });
  // chassis

  SmelterRecipe.addRecipe({
    ingredient1: { id: BlockID.machineChassiSimple, data: 0, count: 1 },
    ingredient2: { id: ItemID.machineDye, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: BlockID.machineChassi, count: 1, data: 0 },
    energy: 250,
    by: "EnderIO",
  });

  SmelterRecipe.addRecipe({
    ingredient1: { id: BlockID.machineChassiSimple, data: 0, count: 1 },
    ingredient2: { id: ItemID.soulMachineDye, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0 },
    result: { id: BlockID.machineChassiSoul, count: 1, data: 0 },
    energy: 250,
    by: "EnderIO",
  });
});
