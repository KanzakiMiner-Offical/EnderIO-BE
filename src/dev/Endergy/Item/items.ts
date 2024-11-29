EnderCore.createResourceItem("crudeSteel", "Crude Steel");
EnderCore.createResourceItem("crystalline", "Crystalline");
EnderCore.createResourceItem("melodic", "Melodic");
EnderCore.createResourceItem("stellar", "Stellar");
EnderCore.createResourceItem("crystallinePink", "Crystalline Pink Slime");
EnderCore.createResourceItem("energeticSilver", "Energetic Silver");
EnderCore.createResourceItem("vividAlloy", "Vivid Alloy");
/*
endergy_tip(ItemID.crudeSteel);
endergy_tip(ItemID.crudeSteelNugget);
endergy_tip(ItemID.vividAlloy);
endergy_tip(ItemID.vividAlloyNugget)
*/
ItemRegistry.createItem("ingotSilver", {
  name: "Silver Ingot",
  icon: "ingot_silver",
});
ItemRegistry.createItem("ingotLead", {
  name: "Lead Ingot",
  icon: "ingot_lead",
});
ItemRegistry.createItem("nuggetSilver", {
  name: "Silver Ingot",
  icon: "nugget_silver",
});
ItemRegistry.createItem("nuggetLead", {
  name: "Lead Nugget",
  icon: "nugget_lead",
});
ItemRegistry.createItem("dustSilver", {
  name: "Silver Ingot",
  icon: "dust_silver",
});
ItemRegistry.createItem("dustLead", { name: "Lead Dust", icon: "dust_lead" });

function addRecipeIngot(id, nug) {
  Callback.addCallback("PreLoaded", function () {
    Recipes.addShaped({ id: ItemID[id], count: 1, data: 0 }, ["bbb", "bbb", "bbb"], ["b", ItemID[nug], 0]);
    Recipes.addShapeless({ id: ItemID[nug], count: 9, data: 0 }, [{ id: ItemID[id], data: 0 }]);
  });
}

addRecipeIngot("ingotSilver", "nuggetSilver");
addRecipeIngot("ingotLead", "nuggetLead");
let IC2Integration = false;
Callback.addCallback("PreLoaded", function () {
  Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
  Recipes.addFurnace(ItemID.dustSilver, ItemID.ingotSilver, 0);
  ModAPI.addAPICallback("ICore", function (api) {
    IC2Integration = true;
  });
  if (IC2Integration) {
    Recipes.addShaped(
      { id: ItemID.silverCapacitor, count: 1, data: 0 },
      [" ab", "aca", "ba"],
      ["b", ItemID.dustInfinity, 0, "a", ItemID.nuggetSilver, 0, "c", ItemID.ingotLead, 0],
    );
  } else {
    Recipes.addShaped(
      { id: ItemID.silverCapacitor, count: 1, data: 0 },
      [" ab", "aca", "ba"],
      ["b", ItemID.dustInfinity, 0, "a", ItemID.nuggetSilver, 0, "c", ItemID.electricalSteel, 0],
    );
  }
});
