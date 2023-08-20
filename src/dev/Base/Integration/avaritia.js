/*
let AvaritiaAPI;
ModAPI.addAPICallback("AvaritiaAPI", function(api) {
   AvaritiaAPI = api;
});
Callback.addCallback("PreLoaded", function() {
   AvaritiaAPI.addExtremeShapedRecipe("test", { id: VanillaBlockID.end_portal_frame, count: 1, data: 0 }, [
"iiddiddii",
"idsssssdi",
"dsssssssd",
"dsssnsssd",
"issnnnssi",
"dsssnsssd",
"dsssssssd",
"idsssssdi",
"iiddiddii",
], ["i", ItemID.infinity_ingot, 0, "n", ItemID.neutronium_ingot, 0, "s", VanillaBlockID.sand, 0, "d", BlockID.dmBlock, 0]);
});

ModAPI.addAPICallback("AvaritiaAPI", function(api) {
   api.addExtremeShapedRecipe("neutronium_capacitor", {
      id: ItemID.neutroniumCapacitor,
      count: 1,
      data: 0
   }, [
        " NNNNNNN ",
        "NVNNNNNVN",
        "NVNNONNVN",
        "NVNNNNNVN",
        "NVNNONNVN",
        "  V   V  ",
        "  C   C  ",
        "  C   C  ",
        "  I   I  "
    ], [
        'I', ItemID.infinityIngot, 0,
        'V', ItemID.vibrantAlloy, 0,
        'N', ItemID.neutroniumIngot, 0,
        'O', ItemID.octadicCapacitor, 0,
        'C', ItemID.infinityCatalyst, 0
    ]);
});

// neutroniumCapacitor.png

IDRegistry.genItemID("neutroniumCapacitor");
Item.createItem("neutroniumCapacitor", "Neutronium Capacitor", { name: "neutroniumCapacitor" }, { stack: 64 });
regUpgrade(ItemID.neutroniumCapacitor, "capacitor", 700000, 320, 8, 8, 16);

IDRegistry.genItemID("infinityCapacitor");
Item.createItem("infinityCapacitor", "Infinity Capacitor", { name: "infinityCapacitor.png" }, { stack: 64 });
regUpgrade(ItemID.infinityCapacitor, "capacitor", 1400000, 480, 15, 10, 32);

ModAPI.addAPICallback("AvaritiaAPI", function(api) {
    api.addExtremeShapedRecipe("infinity_capacitor", {
        id: ItemID.infinityCapacitor, count: 1, data: 0
    }, [
        " IIIIIII ",
        "IVNNNNNVI",
        "IVNNONNVI",
        "IVNNNNNVI",
        "IVNNONNVI",
        "  VVVVV  ",
        "  C   C  ",
        "  C   C  ",
        "  I   I  "
    ], [
        'I', ItemID.infinityIngot, 0,
        'V', ItemID.vibrantAlloy, 0,
        'N', ItemID.neutroniumIngot, 0,
        'O', ItemID.octadicCapacitor, 0,
        'C', ItemID.infinityCatalyst, 0
    ]);
});
*/