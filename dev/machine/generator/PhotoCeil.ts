BlockRegistry.registerBlock(
  new BlockPhotovoltaic("simplePhotovoltaicCell", "tile.block_solar_panel.simple.name", [
    ["solar_panel_simple_side", 0],
    ["solar_panel_simple_top", 0],
    ["solar_panel_simple_side", 0],
  ]),
);

namespace Machine {
  MachineRegistry.registerPrototype(BlockID.simplePhotovoltaicCell, new PhotovoltaicCellBase(20));
}

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.simplePhotovoltaicCell, count: 1, data: 0 },
    ["aga", "sss", "epe"],
    ["e", ItemID.dustInfinity, 0, "a", ItemID.electricalSteel, 0, "s", ItemID.platePhotovoltaic, 0, "p", ItemID.ironGear, 0, "g", BlockID.fusedQuartz, 0],
  );
});
