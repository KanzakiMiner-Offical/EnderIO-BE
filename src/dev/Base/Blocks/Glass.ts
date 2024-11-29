var GLASS_TYPE_ANTI_EXPLO = Block.createSpecialType({
  destroytime: 1,
  explosionres: 3600000.8,
  sound: "glass",
});

IDRegistry.genBlockID("fusedGlass");
Block.createBlock(
  "fusedGlass",
  [
    {
      name: "Quite Clear Glass",
      texture: [["fusedGlass", 0]],
      inCreative: true,
    },
  ],
  GLASS_TYPE_ANTI_EXPLO,
);

ConnectedTexture.setModelForGlass(BlockID.fusedGlass, -1, "fusedGlass");

IDRegistry.genBlockID("fusedQuartz");
Block.createBlock(
  "fusedQuartz",
  [
    {
      name: "Fused Quartz",
      texture: [["fusedQuartzItem", 0]],
      inCreative: true,
    },
  ],
  GLASS_TYPE_ANTI_EXPLO,
);

ConnectedTexture.setModelForGlass(BlockID.fusedQuartz, -1, "fusedQuartzItem");

Item.addCreativeGroup("glass_modded", Translation.translate("Glass"), [BlockID.fusedGlass, BlockID.fusedQuartz]);

Callback.addCallback("PreLoaded", function () {
  SmelterRecipe.addRecipe({
    ingredient1: { id: 12, data: 0, count: 1 },
    ingredient2: { id: 12, data: 0, count: 1 },
    ingredient3: { id: 12, data: 0, count: 1 },
    result: { id: BlockID.fusedGlass, count: 3, data: 0 },
    energy: 5000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: 406, data: 0, count: 1 },
    ingredient2: { id: 406, data: 0, count: 1 },
    ingredient3: { id: 406, data: 0, count: 1 },
    result: { id: BlockID.fusedQuartz, count: 3, data: 0 },
    energy: 5000,
  });
});
