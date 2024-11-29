const EnderAPI = {
  MachineRegistry: MachineRegistry,
  Recipe: RecipeRegistry,
  Conduit: ConduitRegistry,
  CapacitorAPI: CapacitorData,
  Machine: Machine,
  //Capacitor: regUpgrade,
  requireGlobal: function (command: any) {
    return eval(command);
  },
};

Logger.Log(`EnderIO loading finished in ${Debug.sysTime() - startTime} ms`, "INFO");

ModAPI.registerAPI("EnderAPI", EnderAPI);

Logger.Log("EnderIO API was shared with name: EnderAPI", "API");

// debug logging
BlockRegistry.createBlock("sky_debugid", [
  {
    name: "block.id.debug",
    texture: [["stone", 0]],
    inCreative: true,
  },
]);

TileEntity.registerPrototype(BlockID.sky_debugid, {
  click: function (id, count, data, croods, player) {
    Game.message(IDRegistry.getNameByID(id));
    Game.message(CapacitorData.getCapacitor(id) + "");
    Game.message(CapacitorData.isValidCapacitor(id, new Machine.AlloySmelter_Basic()) + "");
    alert(new PlayerEntity(player).getCarriedItem().extra);
  },
});
