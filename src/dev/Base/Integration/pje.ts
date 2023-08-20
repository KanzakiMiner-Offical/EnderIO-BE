ModAPI.addAPICallback("EquivalentAPI", function(api) {
let System = api.System; Callback.addCallback("PreLoaded", function() {
  //Other
  System.setValue(ItemID.silicon, 0, 2);
  System.setValue(ItemID.dustInfinity, 0, 4);
  System.setValue(ItemID.binderComposite, 0, 84);
  System.setValue(ItemID.conduitBinder, 0, 92);
  //Ingot
  //System.setValue(ItemID.conduitBinder, 0, 92);
  System.setValue(ItemID.conductiveIron, 0, 382);
});
});