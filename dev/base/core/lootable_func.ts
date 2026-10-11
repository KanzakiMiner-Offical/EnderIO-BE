// namespace Loot_Func {
//   type ItemInstanceWithRate = {
//     /** Item ID. */
//     id: number;
//     /** Item Count Range, min to max */
//     count: { min: number; max: number };
//     /** Item data value. In many cases `-1` means "any data value".*/
//     data: number;
//     /** Item spawn rate. Range: 0 - 1 */
//     rate: number;
//     /** Item extra data. Contains some additional item data such as enchants*/
//     extra?: ItemExtraData;
//   };
//   let loot_table: { [key: string]: ItemInstanceWithRate[] } = {};
//   export function addLoottable(name: string, id?: number, count?: { min: number; max: number }, data?: number, rate?: number, extra?: ItemExtraData) {
//     let cur_loottable = loot_table[name] || [];
//     if (id) {
//       cur_loottable.push({
//         id: id,
//         data: data,
//         count: count,
//         rate: rate,
//         extra: extra || null
//       });
//     } else return;
//     loot_table[name] = cur_loottable;
//   }
//   export function getLoottable(name: string) {
//     return loot_table[name];
//   }
//   export function findChest(region: WorldRegion, coords: Vector): boolean {
//     return region.getBlock(coords).id == VanillaBlockID.chest;
//   }

//   export function isEmptyNativeContainer(container: NativeTileEntity) {
//     return !!getEmptyNativeContainer(container);
//   }

//   export function getEmptyNativeContainer(container: NativeTileEntity) {
//     let storage = StorageInterface.getContainerSlots(container);
//     let storage_size = storage[storage.length - 1] as number;
//     let empty_map: number[] = [];

//     for (let i = 0; i == storage_size; i++) {
//       let slot = (container as NativeTileEntity).getSlot(i);
//       if (slot.count == 0) empty_map.push(i);
//     }

//     return empty_map;
//   }

//   export function fillChest(name: string, region: WorldRegion, coords: Vector, extra?: ItemExtraData): void {
//     let isChest = findChest(region, coords);
//     if (!isChest) return;
//     let container = region.getContainer(coords);
//     let storage = StorageInterface.getContainerSlots(container);
//     if (typeof storage[storage.length - 1] == "number") {
//       const nativeContainer = container as NativeTileEntity;
//       Game.message("x: " + coords.x + " y: " + coords.y + " z: " + coords.z + "is nativeContainer:" + !!nativeContainer);
//       if (isEmptyNativeContainer(nativeContainer)) {
//         Game.message("x: " + coords.x + " y: " + coords.y + " z: " + coords.z + "isEmptyNativeContainer:" + !!isEmptyNativeContainer);
//         let empty_map = getEmptyNativeContainer(nativeContainer);
//         let loottable = getLoottable(name);
//         for (const slot_index of empty_map) {
//           for (const item of loottable) {
//             const count = MathHelper.randomInt(item.count.min, item.count.max);
//             extra = extra || item.extra;
//             if (Math.random() <= item.rate) {
//               nativeContainer.setSlot(slot_index, item.id, count, item.data, extra);
//               break;
//             }
//           }
//         }
//       }
//     } else if (typeof storage[storage.length - 1] == "string") {
//       // i don't have idea now :))
//     }
//   }
// }
