namespace VoidMinerAPI {
  interface ItemInstanceWithChance extends ItemInstance {
    chance: number;
  }
  export let void_ore_random: ItemInstanceWithChance[] = [];
  export let void_resource_random: ItemInstanceWithChance[] = [];
  // export let void_ore_random: ItemInstanceWithChance[] = [];
  export function addVoidRandom(type: "ore" | "resource", id: number, data: number = -1, count: number = 1, chance: number = 1): void {
    switch (type) {
      case "ore":
        void_ore_random.push({
          id: id,
          data: data,
          count: count,
          chance: chance,
        });
        break;
      case "resource":
        void_resource_random.push({
          id: id,
          data: data,
          count: count,
          chance: chance,
        });
        break;
    }
  }
  export function randomResult(input_array: ItemInstanceWithChance[]): ItemInstance {
    var total = 0;
    for (var i in input_array) {
      total += input_array[i].chance;
    }
    var random = Math.random() * total * 1.4;
    var current = 0;
    for (var i in input_array) {
      var drop = input_array[i];
      if (current < random && current + drop.chance > random) {
        return {
          id: drop.id,
          data: drop.data,
          count: drop.count,
        };
      }
      current += drop.chance;
    }
    return {
      id: 0,
      data: 0,
      count: 0,
    };
  }
}
// Vanilla - Resource
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.stone, 0, 1, 60);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.stone, 1, 1, 60);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.stone, 2, 1, 60);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.stone, 3, 1, 60);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.end_stone, 0, 1, 55);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.packed_ice, 0, 1, 20);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.soul_sand, 0, 1, 40);
VoidMinerAPI.addVoidRandom("resource", VanillaBlockID.soul_soil, 0, 1, 40);
// Vanilla - Ore
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.coal_ore, 0, 1, 40);
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.iron_ore, 0, 1, 35);
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.gold_ore, 0, 1, 20);
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.diamond_ore, 0, 1, 15);
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.emerald_ore, 0, 1, 15);
VoidMinerAPI.addVoidRandom("ore", VanillaBlockID.ancient_debris, 0, 1, 5);
// Mod - Ore
VoidMinerAPI.addVoidRandom("ore", BlockID.oreCopper, 0, 1, 35);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreTin, 0, 1, 32);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreLead, 0, 1, 42);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreUranium, 0, 1, 10);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreThorium, 0, 1, 10);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreBoron, 0, 1, 10);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreLithium, 0, 1, 10);
VoidMinerAPI.addVoidRandom("ore", BlockID.oreMagnesium, 0, 1, 10);
