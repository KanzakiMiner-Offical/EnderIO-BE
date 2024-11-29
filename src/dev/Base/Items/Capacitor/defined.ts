// ItemRegistry.registerItem(
//   new CapacitorCraft("basicCapacitor1", "Basic", {
//     consume: 1,
//     storage: 1,
//     bonus: 1,
//     range: 2,
//   }),
// );

// ItemRegistry.registerItem(
//   new CapacitorCraft("doublelayerCapacitor2", "Double-layer", {
//     consume: 3,
//     storage: 3,
//     bonus: 1.5,
//     range: 6,
//   }),
// );

ItemRegistry.registerItem(
  new CapacitorCraft("octadicCapacitor3", "Octadic", {
    consume: 5,
    storage: 5,
    bonus: 2,
    range: 10,
  }),
);

ItemRegistry.registerItem(new DefaultCapacitor("basicCapacitor", "item.item_basic_capacitor.basic.name", "basicCapacitor", 1));
ItemRegistry.registerItem(new DefaultCapacitor("doublelayerCapacitor", "item.item_basic_capacitor.activated.name", "activatedCapacitor", 2));
ItemRegistry.registerItem(new DefaultCapacitor("octadicCapacitor", "item.item_basic_capacitor.ender.name", "enderCapacitor", 3));

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: ItemID.basicCapacitor, count: 1, data: 0 },
    [" rn", "rir", "nr "],
    ["r", VanillaItemID.gold_nugget, 0, "n", ItemID.dustInfinity, 0, "i", VanillaItemID.redstone, 0],
  );

  Recipes.addShaped({ id: ItemID.doublelayerCapacitor, count: 1, data: 0 }, [" a ", "cpc", " a "], ["a", ItemID.energeticAlloy, 0, "c", ItemID.basicCapacitor, 0, "p", ItemID.dustCoal, 0]);

  Recipes.addShaped({ id: ItemID.octadicCapacitor, count: 1, data: 0 }, [" a ", "cpc", " a "], ["a", ItemID.vibrantAlloy, 0, "c", ItemID.doublelayerCapacitor, 0, "p", 89, 0]);
});
