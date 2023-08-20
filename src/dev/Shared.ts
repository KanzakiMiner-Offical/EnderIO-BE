const EnderAPI = {
  Machine: MachineRegistry,
  Recipe: RecipeRegistry,
  Conduit: ConduitRegistry,
  Upgrade: CapacitorAPI,
  //Capacitor: regUpgrade,
  requireGlobal: function(command) {
    return eval(command);
  }
}

Logger.Log(`EnderIO loading finished in ${(Debug.sysTime() - startTime)} ms`, "INFO");

ModAPI.registerAPI("EnderCore", EnderAPI);

Logger.Log("EnderIO API was shared with name: EnderCore", "API");