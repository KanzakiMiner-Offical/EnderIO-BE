/*

ModAPI.addAPICallback("SkyOrchard", function(api) {
  const IntegrationSO = {
    crushSap: function(key, c1, c2, c3) {
      let Input1 = "ore_sapling_" + key;
      let Output1 = "ore_leaf_" + key;
      let Output2 = "ore_acorn_" + key;
      let Output3 = "ore_resin_" + key;
      RecipeRegistry.addCrusher({
        ingredient: { id: Input1, data: 0 },
        result0: { id: Output1, data: 0, chance: c1 },
        result1: { id: Output2, data: 0, chance: c2 },
        result2: { id: Output3, data: 0, chance: c3 },
        result3: { id: 0, data: 0, chance: 0 },
        time: 180
      });

    },

    crushLeave: function(key, c1, c2) {
      let Input1 = "ore_leaf_" + key;
      let Output1 = "ore_sapling_" + key;
      let Output2 = "ore_acorn_" + key;
      RecipeRegistry.addCrusher({
        ingredient: { id: Input1, data: 0 },
        result0: { id: Output1, data: 0, chance: c1 }, // Max: 0.75
        result1: { id: Output2, data: 0, chance: c2 }, // Min: 0.95
        result2: { id: 0, data: 0, chance: 0 },
        result3: { id: 0, data: 0, chance: 0 },
        time: 180
      });

    },
    crushLog: function(key, c2) {
      let Input1 = "log_ore_" + key;
      let Output1 = "ore_resin_" + key;
      RecipeRegistry.addCrusher({
        ingredient: { id: Input1, data: 0 },
        result0: { id: Output1, data: 0, chance: 1 },
        result1: { id: 16, data: 0, chance: c2 }, // Max: 0.8
        result2: { id: 0, data: 0, chance: 0 },
        result3: { id: 0, data: 0, chance: 0 },
        time: 180
      });

    }

  }
  Callback.addCallback("PreLoaded", function() {
    IntegrationSO.crushSap("dirt", 0.75, 1, 1);
    IntegrationSO.crushLeave("dirt", 0.7, 0.99);
    IntegrationSO.crushLog("dirt", 0.7);
    IntegrationSO.crushSap("petrified", 0.7, 1, 1);
    IntegrationSO.crushLeave("petrified", 0.5, 0.99);
    IntegrationSO.crushLog("petrified", 0.7);
    IntegrationSO.crushSap("gravel", 0.5, 1, 1)
    IntegrationSO.crushLeave("gravel", 0.5, 1)
    IntegrationSO.crushLog("gravel", 0.8);
  });
});
*/