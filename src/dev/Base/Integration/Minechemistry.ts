// @ts-nocheck
ModAPI.addAPICallback("ChemCore", function(Chem) {
   var DecomposeRecipe = Chem.Decompose;
   var SynthesisRecipe = Chem.Synthesis;
   var MolID = Chem.MolID
  Callback.addCallback("PreLoaded", function() {

    DecomposeRecipe.add(ItemID.electricalSteel, [
      { id: "C", count: 1 },
      { id: "Si", count: 1 },
      { id: "Fe", count: 1 }
  ]);

    DecomposeRecipe.add(ItemID.conductiveIron, [
      { id: MolID.iron_oxide, count: 1 },
      { id: MolID.strontium_carbonate, count: 1 },
      { id: "Fe", count: 1 }
  ]);
  })
});