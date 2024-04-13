// @ts-nocheck
ModAPI.addAPICallback("ENR", function (Ex) {
 Ex.Sieve.addSieved(13, ItemID.dustInfinity, 0, 1, 3, 10);
 Ex.Sieve.addSieved(13, ItemID.dustPulsating, 0, 1, 2, 1);
 Ex.Crucible.dataSet("energy", {
    "BloclID.blockEndSteel": {
        energy: 15
    },
     "BloclID.blockSoularium": {
        energy: 10
    }
});

 
Callback.addCallback("PreLoaded", function() {
	/*
    RecipeRegistry.addCrusher({
    	isGrinding: false,
      ingredient: { id: 13, data: 0 },
      result0: { id: 12, data: 0, chance: 1 },
      result1: { id: BlockID.ex_dust, data: 0, chance: 0.5 },
      result2: { id: 0, data: 0, chance: 0 },
      result3: { id: 0, data: 0, chance: 0 },
      time: 180,
      by: "Ex Nihilo Origin"
    });
    
    RecipeRegistry.addCrusher({
    	isGrinding: false,
      ingredient: { id: 12, data: 0 },
      result0: { id: BlockID.ex_dust, data: 0, chance: 1 },
      result1: { id: 0, data: 0, chance: 0 },
      result2: { id: 0, data: 0, chance: 0 },
      result3: { id: 0, data: 0, chance: 0 },
      time: 180,
      by: "Ex Nihilo Origin"
    });
    */
    RecipeRegistry.addCrusher({
    	isGrinding: false,
      ingredient: { id: 87, data: 0 },
      result0: { id: BlockID.ex_gravelNether, data: 0, chance: 1 },
      result1: { id: 0, data: 0, chance: 0 },
      result2: { id: 0, data: 0, chance: 0 },
      result3: { id: 0, data: 0, chance: 0 },
      energy: 1800,
      by: "Ex Nihilo Origin"
    });
    
    RecipeRegistry.addCrusher({
    	isGrinding: false,
      ingredient: { id: 121, data: 0 },
      result0: { id: BlockID.ex_gravelEnder, data: 0, chance: 1 },
      result1: { id: 0, data: 0, chance: 0 },
      result2: { id: 0, data: 0, chance: 0 },
      result3: { id: 0, data: 0, chance: 0 },
      energy: 1800,
      by: "Ex Nihilo Origin"
    });

  });
});