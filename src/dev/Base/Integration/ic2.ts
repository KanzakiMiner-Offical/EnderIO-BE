ModAPI.addAPICallback("ICore", function (api) {
  CombustionFuel.addFuel("biogas", 16, 1000 * 10 * 10);
  //CombustionFuel.addFuel("ethanol", 16, 1000 * 10 * 10)
  //CombustionFuel.addFuel("oil", 8, 1000 * 10 * 10)
  //CombustionFuel.addFuel("biomass", 8, 1000 * 20 * 10)

  Callback.addCallback("PreLoaded", function () {
    ICRender.getGroup("liquid_pipe").add(BlockID.semifluidGenerator, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.icFermenter, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.oreWasher, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.pump, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.solidCanner, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.canner, -1);
    ICRender.getGroup("liquid_pipe").add(BlockID.tank, -1);

    SmelterRecipe.addRecipe({
      ingredient1: { id: ItemID.ingotCopper, data: 0, count: 3 },
      ingredient2: { id: ItemID.ingotTin, data: 0, count: 1 },
      result: { id: ItemID.ingotBronze, count: 4, data: 0 },
      energy: 4000,
    });
    SmelterRecipe.addRecipe({
      ingredient1: { id: VanillaItemID.iron_ingot, data: 0, count: 1 },
      ingredient2: { id: VanillaItemID.coal, data: 0, count: 1 },
      ingredient3: { id: ItemID.dustCoal, data: 0, count: 1 },
      result: { id: ItemID.ingotSteel, count: 1, data: 0 },
      energy: 10000,
    });

    RecipeRegistry.addCrusher({
      isGrinding: true,
      ingredient: { id: BlockID.oreCopper, data: 0 },
      result0: { id: ItemID.dustCopper, data: 0, chance: 1 },
      result1: { id: ItemID.dustCopper, data: 0, chance: 1 },
      result2: { id: ItemID.dustGold, data: 0, chance: 0.1 },
      result3: { id: 4, data: 0, chance: 0.15 },
      energy: 3600,
      by: "IC2",
    });
    /*
        RecipeRegistry.addCrusher({
          isGrinding: true,
          ingredient: { id: BlockID.oreUranium, data: 0 },
          result0: { id: ItemID.uranium238, data: 0, chance: 1 },
          result1: { id: ItemID.smallUranium235, data: 0, chance: 1 },
          result2: { id: ItemID.dustLead, data: 0, chance: 0.1 },
          result3: { id: 4, data: 0, chance: 0.15 },
          energy: 3600,
          by: "IC2"
        });
    */

    RecipeRegistry.addCrusher({
      isGrinding: true,
      ingredient: { id: BlockID.oreTin, data: 0 },
      result0: { id: ItemID.dustTin, data: 0, chance: 1, count: 2 },
      result1: { id: ItemID.dustSilver, data: 0, chance: 0.1 },
      result2: { id: 4, data: 0, chance: 0.15 },
      energy: 3600,
      by: "IC2",
    });

    RecipeRegistry.addCrusher({
      isGrinding: true,
      ingredient: { id: BlockID.oreLead, data: 0 },
      result0: { id: ItemID.dustLead, data: 0, chance: 1, count: 2 },
      result1: { id: ItemID.dustSilver, data: 0, chance: 0.1 },
      result2: { id: 4, data: 0, chance: 0.15 },
      energy: 3600,
      by: "IC2",
    });
  });
});
