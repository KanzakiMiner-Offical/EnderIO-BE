BlockRegistry.createBlock("energyConduit", [
  { name: "enderio.item_power_conduit.name", texture: [["powerConduitCore", 0]], inCreative: true }], "conduit");

BlockRegistry.createBlock("energyConduitAdv", [
  { name: "enderio.item_power_conduit_enhanced.name", texture: [["powerConduitCoreEnhanced", 0]], inCreative: true }], "conduit");

BlockRegistry.createBlock("energyConduitEnd", [
  { name: "enderio.item_power_conduit_ender.name", texture: [["powerConduitCoreEnder", 0]], inCreative: true }], "conduit");

Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.energyConduit, count: 8, data: 0 }, [
	  "bbb",
	  "ccc",
	  "bbb"
  ], ['b', ItemID.conduitBinder, 0, 'c', ItemID.conductiveIron, 0]);

  Recipes.addShaped({ id: BlockID.energyConduitAdv, count: 8, data: 0 }, [
	  "bbb",
	  "ccc",
	  "bbb"
  ], ['b', ItemID.conduitBinder, 0, 'c', ItemID.energeticAlloy, 0]);

  Recipes.addShaped({ id: BlockID.energyConduitEnd, count: 8, data: 0 }, [
	  "bbb",
	  "ccc",
	  "bbb"
  ], ['b', ItemID.conduitBinder, 0, 'c', ItemID.vibrantAlloy, 0]);

});

ConduitRegistry.registerCable("energyConduit", 1280);
ConduitRegistry.setupModel(BlockID.energyConduit, ConduitRegistry.ConduitWidth, "rf-wire");

ConduitRegistry.registerCable("energyConduitAdv", 5120);
ConduitRegistry.setupModel(BlockID.energyConduitAdv, ConduitRegistry.ConduitWidth, "rf-wire");

ConduitRegistry.registerCable("energyConduitEnd", 20480);
ConduitRegistry.setupModel(BlockID.energyConduitEnd, ConduitRegistry.ConduitWidth, "rf-wire");