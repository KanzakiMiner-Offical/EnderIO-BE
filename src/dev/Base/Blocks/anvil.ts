// BlockRegistry.createBlockType("BLOCK_TYPE_ANVIL", {
//   destroyTime: 20,
//   explosionResistance: 999999999,
//   baseBlock: 7,
//   sound: "anvil"
// });


// BlockRegistry.createBlock("darkSteelAnvil", [
//   { name: "Dark Stell Anvil", texture: [["darkSteelBlock", 0]], inCreative: true },
// ], "BLOCK_TYPE_ANVIL");

// function setDarkAnvilRender(id, tex) {
//   let anvilRender = new ICRender.Model();
//   BlockRenderer.setStaticICRender(id, 0, anvilRender);
//   let model = BlockRenderer.createModel();
//   model.addBox(2 / 16, 0 / 16, 1 / 16, 14 / 16, 4 / 16, 15 / 16, tex, 0);
//   model.addBox(4 / 16, 4 / 16, 2 / 16, 12 / 16, 5 / 16, 14 / 16, tex, 0);
//   model.addBox(7 / 16, 5 / 16, 3 / 16, 10 / 16, 10 / 16, 13 / 16, tex, 0);
//   model.addBox(3 / 16, 10 / 16, 0 / 16, 13 / 16, 16 / 16, 16 / 16, tex, 0);
//   anvilRender.addEntry(model);
// }

// setDarkAnvilRender(BlockID.darkSteelAnvil, "darkSteelBlock");

// let darkAnvilGUI = MachineRegistry.createInventoryWindow("Dark Anvil", {
//   drawing: [
//     { type: "bitmap", x: 500, y: 180, bitmap: "anvil_plus", scale: 3.2 },
//     { type: "bitmap", x: 700, y: 180, bitmap: "bar_progress1", scale: 3.2 }
// 	],
//   elements: {
//     "slotItem": { type: "slot", x: 400, y: 180 },
//     "slotSecond": { type: "slot", x: 600, y: 180 },
//     "slotOutput": { type: "slot", x: 800, y: 180 },
//   }
// });

// namespace Anvil {
//   export let repairValues = {};
//   export let toolMaterials = {};
//   export let recipes = {};
//   export function addRepairItem(id, data, value, material) {
//     repairValues[id + ":" + data] = { value: value, material: material }
//   }
//   export function getRepairValue(id, data) {
//     return repairValues[id + ":" + data]
//   }
//   export function registerToolMaterial(id, material) {
//     toolMaterials[id] = material
//   }
//   export function getToolMaterial(id) {
//     return toolMaterials[id]
//   }
//   export function addRecipe(input: string, item: number, result: number, data) {
//     let new_input = Item.getNumericId(input);
//     recipes[new_input] = { item: item, result: result, data: data }
//   }
//   export function getRecipe(id) {
//     return recipes[id]
//   }
// };

// Anvil.addRepairItem(280, 0, 5, "wood");
// Anvil.addRepairItem(264, 0, 80, "diamond");
// Anvil.addRepairItem(265, 0, 70, "iron");
// Anvil.addRepairItem(266, 0, 30, "gold");
// Anvil.addRepairItem(ItemID.darkSteel, 0, 200, "dark_steel");
// Anvil.addRecipe("pickaxeDarkSteel", ItemID.vibrantCrystal, ItemID.pickaxeDarkSteelEmpowered1, Item.getMaxDamage(ItemID.pickaxeDarkSteelEmpowered) - 1);
// let woodenTools = [268, 269, 270, 271, 290];

// for (let i in woodenTools) {
//   Anvil.registerToolMaterial(woodenTools[i], "wood");
// }

// let stoneTools = [272, 273, 274, 275, 291];

// for (let i in stoneTools) {
//   Anvil.registerToolMaterial(stoneTools[i], "stone");
// }

// let ironTools = [256, 257, 258, 267, 292];

// for (let i in ironTools) {
//   Anvil.registerToolMaterial(ironTools[i], "iron");
// }

// let goldenTools = [283, 284, 285, 286, 294];

// for (let i in goldenTools) {
//   Anvil.registerToolMaterial(goldenTools[i], "gold");
// }

// let diamondTools = [276, 277, 278, 279, 293];

// for (let i in diamondTools) {
//   Anvil.registerToolMaterial(diamondTools[i], "diamond");
// }


// namespace Machine {
//   export class DarkSteelAnvil extends MachineBase {
//     canTake = false

//     getScreenByName(): UI.IWindow {
//       return darkAnvilGUI;
//     }

//     onTick(): void {
//       let slotItem = this.container.getSlot("slotItem");
//       let slotSecond = this.container.getSlot("slotSecond");
//       let slotOutput = this.container.getSlot("slotOutput");
//       let toolMaterial = Anvil.getToolMaterial(slotItem.id);
//       let repair = Anvil.getRepairValue(slotSecond.id, slotSecond.data);
//       // repair...

//       if (toolMaterial && repair && slotOutput.id == 0 && slotItem.count > 0 && slotItem.data + repair.value <= Item.getMaxDamage(slotItem.id) && toolMaterial == repair.material && !this.canTake) {
//         slotOutput.id = slotItem.id
//         slotOutput.count = 1;
//         slotOutput.data = slotItem.data - repair.value
//         this.canTake = true;
//       } else {
//         slotOutput.id = 0;
//         slotOutput.count = 0;
//         slotOutput.data = 0;
//         this.container.validateAll();
//       }

//       if (toolMaterial && repair && slotOutput.count == 0 && this.canTake) {
//         slotItem.id = 0;
//         slotSecond.count--;
//         this.container.validateAll();
//         this.canTake = false;
//       }
//       // recipe
//       let recipe = Anvil.getRecipe(slotItem)
//       if (recipe) {
//         if (slotSecond.id == recipe.item && slotOutput.id == 0 && !this.canTake) {
//           this.canTake = true
//           slotOutput.id = recipe.id
//           slotOutput.count = 1
//           slotOutput.data = recipe.data
//         }
//         if (World.getThreadTime() % 2 == 0 && (slotOutput.id != recipe.id || slotOutput.id == 0) && this.canTake) {
//           slotItem.id = 0;
//           slotSecond.count--;
//           this.container.validateAll();
//           this.canTake = false;
//         }
//       } else {
//         slotOutput.id = 0;
//         slotOutput.count = 0;
//         slotOutput.data = 0;
//         this.container.validateAll();
//       }
//       //
//       if (slotOutput.data < 0) {
//         slotOutput.data = 0
//       }
//     }

//     destroyBlock(coords, player): void {
//       let region = BlockSource.getDefaultForActor(player)
//       this.container.clearSlot("slotOutput");
//       region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.darkSteelAnvil, 1, 0);
//     }
//   }
//   MachineRegistry.registerPrototype(BlockID.darkSteelAnvil, new DarkSteelAnvil());
// }