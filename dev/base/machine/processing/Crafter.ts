BlockRegistry.createBlock(
  "crafter",
  [
    {
      name: "tile.block_crafter.name",
      texture: [
        ["machineBottom", 0],
        ["machineTop", 0],
        ["machineSide", 0],
        ["block_crafter_solid", 0],
        ["machineSide", 0],
        ["machineSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.crafter, count: 1, data: 0 },
    ["iai", "imi", "ici"],
    ["i", VanillaItemID.iron_ingot, 0, "m", BlockID.machineChassis, 0, "c", ItemID.skullZombieController, 0, "a", VanillaBlockID.crafting_table, 0],
  );
});
// STILL W.I.P
// let craftUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_crafter.name"), {
//   drawing: [{ type: "bitmap", x: 370, y: 60, bitmap: "redflux_bar0", scale: 3.2 }],
// elements: {
//   textInstall: { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 100, height: 30, text: "" },
//   energyScale: { type: "scale", x: 370, y: 60, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
//   // Capacitor
//   slotCapacitor: { type: "slot", x: 370, y: 230, size: 60, maxStackSize: 1 },
//   // Input

//   slotGrid0: { type: "slot", x: 470, y: 110, size: 60, maxStackSize: 1 },
//   slotGrid1: { type: "slot", x: 530, y: 110, size: 60, maxStackSize: 1 },
//   slotGrid2: { type: "slot", x: 590, y: 110, size: 60, maxStackSize: 1 },

//   slotGrid3: { type: "slot", x: 470, y: 170, size: 60, maxStackSize: 1 },
//   slotGrid4: { type: "slot", x: 530, y: 170, size: 60, maxStackSize: 1 },
//   slotGrid5: { type: "slot", x: 590, y: 170, size: 60, maxStackSize: 1 },

//   slotGrid6: { type: "slot", x: 470, y: 230, size: 60, maxStackSize: 1 },
//   slotGrid7: { type: "slot", x: 530, y: 230, size: 60, maxStackSize: 1 },
//   slotGrid8: { type: "slot", x: 590, y: 230, size: 60, maxStackSize: 1 },

//   slotVisual: {
//     type: "slot",
//     x: 660,
//     y: 170,
//     size: 60,
//     visual: true,
//     clicker: {
//       onClick: function () {
//         RV?.RecipeTypeRegistry.openRecipePage("workbench");
//       },
//     },
//   },
//   // Output
//   slot1: { type: "slot", x: 730, y: 110, size: 60 },
//   slot2: { type: "slot", x: 790, y: 110, size: 60 },
//   slot3: { type: "slot", x: 850, y: 110, size: 60 },
//   slot4: { type: "slot", x: 730, y: 170, size: 60 },
//   slot5: { type: "slot", x: 790, y: 170, size: 60 },
//   slot6: { type: "slot", x: 850, y: 170, size: 60 },
//   slot7: { type: "slot", x: 730, y: 230, size: 60 },
//   slot8: { type: "slot", x: 790, y: 230, size: 60 },
//   slot9: { type: "slot", x: 850, y: 230, size: 60 },

//   slotResult: { type: "slot", x: 920, y: 170, size: 60 },
//   },
// });
// // Inspired of IC2
// namespace Machine {
//   export class Crafter extends BasicMachine {
//     defaultValues = {
//       energy: 0,
//       progress: 0,
//       recipeChecked: false,
//       inputChecked: false,
//     };
//     BASE_TICK_RATE = 10;

//     capacitors = ["capacitor"];
//     acceptType = ["buffer", "intake"];
//     speed = 0;
//     energyConsumePerCraft = 0;

//     getScreenByName(): UI.IWindow {
//       return craftUI;
//     }

//     setupContainer(): void {
//       this.container.setGlobalAddTransferPolicy(
//         (container: ItemContainer, str: string, id: number, count: number, data: number, extra: Nullable<ItemExtraData>, time: number): number => {
//           if (str.startsWith("slotCapacitor")) return 1;
//           if (str.startsWith("slotResult") || str.startsWith("slotVisual")) return 0;
//           if (str.match(/slotGrid[0-8]/)) {
//             return 0;
//           }
//           return count;
//         },
//       );
//       this.container.setGlobalGetTransferPolicy(
//         (container: ItemContainer, str: string, id: number, count: number, data: number, extra: Nullable<ItemExtraData>, time: number): number => {
//           if (str.match(/slotGrid[0-8]/)) {
//             this.data.recipeChecked = false;
//           }
//           if (str.match(/slot[0-8]/)) {
//             this.data.inputChecked = false;
//           }
//           return count;
//         },
//       );
//       this.container.setWorkbenchFieldPrefix("slotGrid");
//     }

//     initCapacitor(): void {
//       const capacitors = CapacitorData.useCapacitor(this);
//       this.energyConsume = capacitors.getValue(CapacitorKey.CRAFTER_POWER_USE);
//       this.maxIntake = capacitors.getValue(CapacitorKey.CRAFTER_POWER_INTAKE);
//       this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.CRAFTER_POWER_BUFFER));
//       this.speed = capacitors.getValue(CapacitorKey.CRAFTER_SPEED);
//       this.energyConsumePerCraft = capacitors.getValue(CapacitorKey.CRAFTER_POWER_CRAFT);
//     }

//     validateResult(item: ItemInstance, slot: ItemContainerSlot): boolean {
//       return item && (slot.id == 0 || (slot.id == item.id && slot.data == item.data && slot.count + item.count <= Item.getMaxStack(item.id, item.data)));
//     }
//     canStackBeReplaced(item: ItemInstance, slot: ItemContainerSlot) {
//       return slot.id == item.id && (slot.data == item.data || Item.getMaxDamage(item.id) > 0);
//     }
//     isEnoughItem(): boolean {
//       const reqItem = [];
//       for (let i = 0; i < 9; i++) {
//         const slot = this.container.getSlot("slotGrid" + i);
//         if (slot.id == 0) continue;
//         const item = reqItem.find((item: ItemInstance) => this.canStackBeReplaced(item, slot)); // Find if this item exist in array
//         if (item)
//           item.count++; // Oh, found, increase req amout
//         else reqItem.push({ id: slot.id, data: slot.data, count: 1, extra: slot.extra });
//       }

//       for (let i = 0; i < 9; i++) {
//         const slot = this.container.getSlot("slot" + i);
//         if (slot.id == 0) continue;
//         for (const item of reqItem) {
//           // Find if this item exist in input slot
//           if (this.canStackBeReplaced(item, slot)) {
//             item.count -= slot.count; // decrease req amount equal slot amout
//             break;
//           }
//         }
//       }

//       return reqItem.every((item: ItemInstance) => item.count <= 0); // all item count need be <= 0 <=> enough items
//     }
//     refillItem(): void {}
//     craft(recipe: Recipes.WorkbenchRecipe): boolean {
//       const result = recipe.getResult();
//       const resultSlot = this.container.getSlot("slotResult");
//       if (!this.validateResult(result, resultSlot)) return false;
//       return false;
//     }
//     resetGrid() {
//       this.container.getSlot("slotVisual").setSlot(0, 0, 0, null);
//       for (let i = 0; i < 9; i++) {
//         this.container.getSlot(`slotGrid${i}`).validate();
//       }
//     }
//     run(): void {}

//     onTick(): void {
//       this.initCapacitor();
//       StorageInterface.checkHoppers(this);
//       let capacitor = this.container.getSlot("slotCapacitor");
//       if (CapacitorData.isValidCapacitor(capacitor.id, this)) {
//         this.container.setText("textInstall", "Installed");
//         this.run();
//       } else {
//         this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
//       }
//       this.container.setScale("energyScale", this.getRelativeEnergy());
//       this.container.sendChanges();
//     }

//     destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
//       let region = BlockSource.getDefaultForActor(player);
//       this.container.clearSlot("slotInput");
//       region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.5, coords.z + 0.5, BlockID.crafter, 1, 0);
//     }
//   }

//   MachineRegistry.registerPrototype(BlockID.crafter, new Crafter());
// }
// StorageInterface.createInterface(BlockID.crafter, {
//   slots: {
//     slot1: { input: true },
//     slot2: { input: true },
//     slot3: { input: true },
//     slot4: { input: true },
//     slot5: { input: true },
//     slot6: { input: true },
//     slot7: { input: true },
//     slot8: { input: true },
//     slot9: { input: true },
//     slotResult: { output: true },
//   },
// });
