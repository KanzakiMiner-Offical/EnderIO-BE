ItemRegistry.registerItem(new CapacitorLoot("specialCapacitor", "Loot Capacitor", "item_basic_capacitor_special"));
ItemRegistry.registerItem(new CapacitorLoot("specialCapacitor2", "Loot Capacitor", "item_basic_capacitor_special2"));

namespace CapacitorData {
  export function initData(random: java.util.Random): ItemExtraData {
    let extra = new ItemExtraData();

    extra.putInt("base_level", MathHelper.random(0.5, 4.5));

    let machine_level = {};

    if (random.nextFloat() < 0.45) {
      let type = CapacitorKey.Key[CapacitorKey.Type[MathHelper.randomInt(0, CapacitorKey.Type.length - 1)]];
      machine_level[type] = MathHelper.random(0.5, 4.5);
    }

    if (random.nextFloat() < 0.15) {
      let type = CapacitorKey.Key[CapacitorKey.Type[MathHelper.randomInt(0, CapacitorKey.Type.length - 1)]];
      machine_level[type] = MathHelper.random(0.5, 4.5);
    }

    if (random.nextFloat() < 0.02) {
      let type = CapacitorKey.Key[CapacitorKey.Type[MathHelper.randomInt(0, CapacitorKey.Type.length - 1)]];
      machine_level[type] = MathHelper.random(0.5, 4.5);
    }

    extra.putSerializable("machine_level", machine_level || null); //0.05FF

    return extra;
  }
}
// Loot_Func.addLoottable("eio_lootable_capacitor", ItemID.basicCapacitor, { min: 1, max: 1 }, 0, 0.95, null);
// Loot_Func.addLoottable("eio_lootable_capacitor", ItemID["specialCapacitor"], { min: 1, max: 1 }, 0, 0.9, null);
// Loot_Func.addLoottable("eio_lootable_capacitor", ItemID["specialCapacitor2"], { min: 1, max: 1 }, 0, 0.9, null);

// Loot_Func.addLoottable("eio_lootable_stuff", ItemID.endSteel, { min: 1, max: 2 }, 0, 0.95, null);
// Loot_Func.addLoottable("eio_lootable_stuff", VanillaItemID.ender_pearl, { min: 1, max: 3 }, 0, 0.95, null);

// Callback.addCallback(
//   "PostProcessChunk",
//   (chunkX: number, chunkZ: number, random: java.util.Random, dimensionId: number, chunkSeed: number, worldSeed: number, dimensionSeed: number): void => {
//     let region = WorldRegion.getCurrentWorldGenRegion() || null;
//     if (region) {
//       FileTools.mkdir(__dir__ + `debug_${worldSeed.toFixed(5)}`);
//       for (let yy = 50; yy <= 70; yy++) {
//         let debugLayer = {};
//         for (let i = 0; i < 16; i++) {
//           for (let e = 0; e < 16; e++) {
//             let coords = { x: chunkX * 16 + i, y: yy, z: chunkZ * 16 + e };
//             let isChest = Loot_Func.findChest(region, coords);
//             let block = region.getBlock(coords);
//             if (block.id != 0)
//               debugLayer[`${i}:${e}`] = {
//                 [`${chunkX}:${chunkZ}`]: {
//                   x: coords.x,
//                   y: coords.y,
//                   z: coords.z,
//                   block: block.id
//                 }
//               };
//             if (!!isChest) {
//               Game.message("x: " + coords.x + " y: " + coords.y + " z: " + coords.z + "isChest:" + isChest);
//               alert("x: " + coords.x + " y: " + coords.y + " z: " + coords.z);
//             }
//             if (!isChest) continue;
//             // fill chest
//             Loot_Func.fillChest("eio_lootable_capacitor", region, coords, CapacitorData.initData(random));
//             Loot_Func.fillChest("eio_lootable_stuff", region, coords);
//           }
//         }
//         FileTools.WriteJSON(__dir__ + `debug_${worldSeed.toFixed(5)}/debug_${chunkX}_${chunkZ}_y${yy}.txt`, debugLayer, true);
//       }
//     }
//   }
// );
