/*ModAPI.addAPICallback("TConAPI", function(Tcon) {
  var MeltingRecipe = Tcon.MeltingRecipe;
  var AlloyRecipe = Tcon.AlloyRecipe;
  var MatValue = Tcon.MatValue
  Callback.addCallback("PreLoaded", function() {
    Tcon.MoltenLiquid.createAndRegister("molten_redstone", "Molten Redstone", 340, "#ff0808");
    Tcon.MoltenLiquid.createAndRegister("molten_pulsating_iron", "Molten Pulsating Iron", 769, "#ff9e9e");
    MeltingRecipe.addRecipe(331, "molten_redstone", MatValue.INGOT);
    MeltingRecipe.addRecipe(152, "molten_redstone", MatValue.BLOCK);
    MeltingRecipe.addRecipe(VanillaBlockID.redstone_ore, "molten_redstone", MatValue.INGOT * 5);
    AlloyRecipe.addRecipe({ liquid: "molten_pulsating_iron", amount: 4 }, { liquid: "molten_redstone", amount: 2 }, { liquid: "molten_iron", amount: 2 });
  });
});
*/