class ChassisBlock extends BlockBase {
  constructor(id: string, name: string, texture: [string, number][], miningLevel: number = 1) {
    super(id, "other-machine");
    this.addVariation(name, texture, true);
    this.setBlockMaterial("stone", miningLevel);
    this.setDestroyTime(3);
  }
}

BlockRegistry.registerBlock(new ChassisBlock("machineChassis", "Industrial Machine Chassis", [["machineChassis", 0]]));
BlockRegistry.registerBlock(new ChassisBlock("machineChassisSimple", "Simple Machine Chassis", [["machineChassisSimple", 0]]));
BlockRegistry.registerBlock(new ChassisBlock("machineChassisSoul", "Soul Machine Chassis", [["machineChassisSoul", 0]]));

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.machineChassisSimple, count: 1, data: 0 },
    ["aba", "bcb", "aba"],
    ["a", VanillaBlockID.iron_bars, 0, "b", VanillaItemID.iron_ingot, 0, "c", ItemID.dustInfinity, 0],
  );
});

ModAPI.addAPICallback("ICore", function (api) {
  Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped(
      { id: BlockID.machineChassisSimple, count: 1, data: 0 },
      ["aba", "bcb", "aba"],
      ["a", VanillaBlockID.iron_bars, 0, "b", ItemID.ingotCopper, 0, "c", ItemID.dustInfinity, 0],
    );
  });
});
