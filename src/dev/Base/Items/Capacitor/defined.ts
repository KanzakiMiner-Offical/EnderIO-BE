ItemRegistry.registerItem(new CapacitorCraft("basicCapacitor1", "Basic", {
  consume: 1,
  storage: 1,
  bonus: 1,
  range: 2
}));

ItemRegistry.registerItem(new CapacitorCraft("doublelayerCapacitor2", "Double-layer", {
  consume: 3,
  storage: 3,
  bonus: 1.5,
  range: 6
}));

ItemRegistry.registerItem(new CapacitorCraft("octadicCapacitor3", "Octadic", {
  consume: 5,
  storage: 5,
  bonus: 2,
  range: 10
}));

ItemRegistry.registerItem(new DefaultCapacitor("basicCapacitor", "item.item_basic_capacitor.basic.name", "basicCapacitor", 1));
ItemRegistry.registerItem(new DefaultCapacitor("doublelayerCapacitor", "item.item_basic_capacitor.activated.name", "doublelayerCapacitor", 2));
