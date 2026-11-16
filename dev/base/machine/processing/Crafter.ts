BlockRegistry.createBlock(
  "crafter",
  [
    {
      name: "tile.block_crafter.name",
      texture: [
        ["machineBottom", 0],
        ["crafterTop", 0],
        ["crafterSide", 0],
        ["block_crafter_solid", 0],
        ["crafterSide", 0],
        ["crafterSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.crafter, 0, [
  ["machineBottom", 0],
  ["crafterTop", 0],
  ["crafterSide", 0],
  ["block_crafter_solid", 0],
  ["crafterSide", 0],
  ["crafterSide", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.crafter, 2, [
  ["machineBottom", 0],
  ["crafterTop", 0],
  ["crafterSide", 0],
  ["block_crafter_solid", 0],
  ["crafterSide", 0],
  ["crafterSide", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.crafter, 2, [
  ["machineBottom", 0],
  ["crafterTop", 0],
  ["crafterSide", 0],
  ["block_crafter_solid", 0],
  ["crafterSide", 0],
  ["crafterSide", 0],
]);
TileRenderer.setRotationFunction(BlockID.crafter);

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.crafter, count: 1, data: 0 },
    ["iai", "imi", "ici"],
    ["i", VanillaItemID.iron_ingot, 0, "m", BlockID.machineChassis, 0, "c", ItemID.skullZombieController, 0, "a", VanillaBlockID.crafting_table, 0],
  );
});

let craftUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_crafter.name"), {
  drawing: [{ type: "bitmap", x: 370, y: 60, bitmap: "redflux_bar0", scale: 3.2 }],
  elements: {
    textInstall: { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 100, height: 30, text: "" },
    energyScale: { type: "scale", x: 370, y: 60, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    slotCapacitor: { type: "slot", x: 370, y: 230, size: 60, maxStackSize: 1, bitmap: "slot_capacitor" },

    slotGrid1: { type: "slot", x: 470, y: 110, size: 60, maxStackSize: 1 },
    slotGrid2: { type: "slot", x: 530, y: 110, size: 60, maxStackSize: 1 },
    slotGrid3: { type: "slot", x: 590, y: 110, size: 60, maxStackSize: 1 },
    slotGrid4: { type: "slot", x: 470, y: 170, size: 60, maxStackSize: 1 },
    slotGrid5: { type: "slot", x: 530, y: 170, size: 60, maxStackSize: 1 },
    slotGrid6: { type: "slot", x: 590, y: 170, size: 60, maxStackSize: 1 },
    slotGrid7: { type: "slot", x: 470, y: 230, size: 60, maxStackSize: 1 },
    slotGrid8: { type: "slot", x: 530, y: 230, size: 60, maxStackSize: 1 },
    slotGrid9: { type: "slot", x: 590, y: 230, size: 60, maxStackSize: 1 },

    slotVisual: {
      type: "slot",
      x: 660,
      y: 170,
      size: 60,
      visual: true,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("workbench");
        },
      },
    },

    slot1: { type: "slot", x: 730, y: 110, size: 60 },
    slot2: { type: "slot", x: 790, y: 110, size: 60 },
    slot3: { type: "slot", x: 850, y: 110, size: 60 },
    slot4: { type: "slot", x: 730, y: 170, size: 60 },
    slot5: { type: "slot", x: 790, y: 170, size: 60 },
    slot6: { type: "slot", x: 850, y: 170, size: 60 },
    slot7: { type: "slot", x: 730, y: 230, size: 60 },
    slot8: { type: "slot", x: 790, y: 230, size: 60 },
    slot9: { type: "slot", x: 850, y: 230, size: 60 },

    slotResult: { type: "slot", x: 920, y: 170, size: 60 },
  },
});
// For you, who read this text, this crafter base from IC2 AutoCrafter
namespace Machine {
  export class Crafter extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      recipeChecked: false,
      inputChecked: false,
    };

    capacitors = ["capacitor"];
    acceptType = ["buffer", "intake"];
    speed: number = 1;
    energyConsumePerCraft: number = 0;
    BASE_TICK_RATE: number = 10;

    getScreenByName(): UI.IWindow {
      return craftUI;
    }

    setupContainer(): void {
      this.container.setWorkbenchFieldPrefix("slotGrid");

      this.container.setGlobalAddTransferPolicy((container, name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this) ? amount : 0;
        if (name.startsWith("slotResult") || name.startsWith("slotVisual")) return 0;
        if (name.match(/slotGrid[1-9]/)) {
          const slot = container.getSlot(name);
          if (slot.id == 0) {
            this.data.recipeChecked = false;
            return 1;
          }
          return 0;
        }
        return amount;
      });

      this.container.setGlobalGetTransferPolicy((container, name, id, amount, data) => {
        if (name.match(/slotGrid[1-9]/)) {
          this.data.recipeChecked = false;
        } else if (name.match(/slot[1-9]/)) {
          this.data.inputChecked = false;
        }
        return amount;
      });
    }

    initCapacitor(): void {
      const capacitors = CapacitorData.useCapacitor(this);
      this.energyConsume = capacitors.getValue(CapacitorKey.CRAFTER_POWER_USE);
      this.maxIntake = capacitors.getValue(CapacitorKey.CRAFTER_POWER_INTAKE);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.CRAFTER_POWER_BUFFER));
      this.speed = capacitors.getValue(CapacitorKey.CRAFTER_SPEED) || CapacitorKey.CRAFTER_SPEED.baseValue;
      this.energyConsumePerCraft = capacitors.getValue(CapacitorKey.CRAFTER_POWER_CRAFT) || CapacitorKey.CRAFTER_POWER_CRAFT.baseValue;
    }

    getTickPerCraft(): number {
      return this.BASE_TICK_RATE / this.speed;
    }
    validateResult(item: ItemInstance, slot: ItemContainerSlot): boolean {
      return item && (slot.id == 0 || (slot.id == item.id && slot.data == item.data && slot.count + item.count <= Item.getMaxStack(item.id, item.data)));
    }

    canStackBeReplaced(required: ItemInstance, slot: ItemInstance): boolean {
      if (slot.id !== required.id) return false;
      if (slot.data === required.data) return true;
      return required.data === -1 || Item.getMaxDamage(required.id) > 0;
    }

    hasRequiredIngredients(): boolean {
      const reqItem: ItemInstance[] = [];
      for (let i = 1; i <= 9; i++) {
        const slot = this.container.getSlot("slotGrid" + i);
        if (slot.id == 0) continue;
        const item = reqItem.find((item: ItemInstance) => this.canStackBeReplaced(item, slot)); // Find if this item exist in array
        if (item)
          item.count++; // Oh, found, increase req amout
        else reqItem.push({ id: slot.id, data: slot.data, count: 1, extra: slot.extra });
      }

      for (let i = 1; i <= 9; i++) {
        const slot = this.container.getSlot("slot" + i);
        if (slot.id == 0) continue;
        for (const item of reqItem) {
          // Find if this item exist in input slot
          if (this.canStackBeReplaced(item, slot)) {
            item.count -= slot.count; // decrease req amount equal slot amout
            break;
          }
        }
      }

      return reqItem.every((item: ItemInstance) => item.count <= 0); // all item count need be <= 0 <=> enough items
    }

    provideRecipe(recipe: Recipes.WorkbenchRecipe): boolean {
      let result = recipe.getResult();

      const resultSlot = this.container.getSlot("slotResult");
      if (!this.validateResult(result, resultSlot) || !this.hasRequiredIngredients()) return false;

      result = Recipes.provideRecipeForPlayer(this.container, "", -1); // get result that maybe have funcs
      if (result) {
        resultSlot.setSlot(result.id, resultSlot.count + result.count, Math.max(result.data, 0), result.extra);
        this.refillGrid();
        resultSlot.validate();
        resultSlot.markDirty();
        return true;
      }
      this.data.recipeChecked = false;
      return false;
    }

    refillGrid(): void {
      // refill grid bcs Recipe funcs will decrease grid.item count
      for (let i = 1; i <= 9; i++) {
        const inputSlot = this.container.getSlot("slotGrid" + i);
        if (inputSlot.id != 0 && inputSlot.count < Item.getMaxStack(inputSlot.id, inputSlot.data)) {
          for (let j = 1; j <= 9; j++) {
            const slot = this.container.getSlot("slot" + j);
            if (inputSlot.count == 0 && this.canStackBeReplaced(inputSlot, slot)) {
              inputSlot.setSlot(slot.id, inputSlot.count + 1, slot.data, slot.extra);
              this.consumeSlot(slot);
              break;
            }
          }
        }
        inputSlot.validate();
        inputSlot.markDirty();
      }
    }

    setVisual(item: ItemInstance): void {
      this.container.setSlot("slotVisual", item.id, item.count, item.data, item.extra);
    }

    resetGrid() {
      this.setVisual(new ItemStack(0, 0, 0, null));
      for (let i = 1; i <= 9; i++) {
        this.container.getSlot(`slotGrid${i}`).validate();
      }
    }

    run() {
      let newActive = false;
      if (!this.data.recipeChecked) {
        const result = Recipes.getRecipeResult(this.container);
        if (result.id != 0) {
          this.setVisual(result);
        } else {
          this.resetGrid();
          if (this.data.progress > 0) {
            this.data.progress = 0;
          }
        }
        this.data.recipeChecked = true;
      }
      if (this.data.energy >= this.energyConsumePerCraft) {
        if (!this.data.inputChecked) {
          const visualSlot = this.container.getSlot("slotVisual");
          const resultSlot = this.container.getSlot("slotResult");
          if (visualSlot.id != 0 && this.validateResult(visualSlot, resultSlot) && this.hasRequiredIngredients()) {
            this.data.inputChecked = true;
          } else if (this.data.progress > 0) {
            this.data.progress = 0;
          }
        }
        if (this.data.inputChecked) {
          newActive = true;
          this.data.energy -= this.energyConsumePerCraft;
          this.data.progress++;
          if (this.data.progress >= this.getTickPerCraft()) {
            const recipe = Recipes.getRecipeByField(this.container);
            if (recipe) {
              this.provideRecipe(recipe);
            }
            this.data.progress = 0;
            this.data.inputChecked = false;
          }
        }
      }
      this.setActive(newActive);
    }

    onTick(): void {
      this.initCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }

      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      this.resetGrid();
      super.destroyBlock(coords, player);
    }
  }

  MachineRegistry.registerPrototype(BlockID.crafter, new Crafter());

  export class CrafterStorageInterface extends StorageInterface.TileEntityInterface {
    container: ItemContainer;
    tileEntity: Crafter;

    isValidInput(item: ItemInstance): boolean {
      return this.getRecipeEntriesCount(item) > 0;
    }

    getRecipeEntriesCount(item: ItemInstance): number {
      let count = 0;
      for (let i = 1; i <= 9; i++) {
        const slot = this.container.getSlot("slotGrid" + i);
        if (slot.id > 0 && this.tileEntity.canStackBeReplaced(item, slot)) {
          count++;
        }
      }
      return count;
    }

    addItem(item: ItemInstance, side: number = -1, maxCount: number = 64): number {
      let maxItemSlots = this.getRecipeEntriesCount(item);
      if (maxItemSlots == 0) return 0;

      let count = 0;
      const slots = this.getInputSlots(side);
      for (let slotName of slots) {
        const slot = this.container.getSlot(slotName);
        if (slot.id > 0 && this.tileEntity.canStackBeReplaced(item, slot)) {
          count += this.addItemToSlot(slotName, item, maxCount - count);
          maxItemSlots--;
          if (item.count == 0 || count >= maxCount || maxItemSlots == 0) {
            break;
          }
        }
      }
      if (item.count > 0 && maxItemSlots > 0) {
        count += super.addItem(item, side, maxCount - count);
      }
      return count;
    }
  }
}

StorageInterface.createInterface(
  BlockID.crafter,
  {
    slots: {
      "slot^1-9": { input: true },
      slotResult: { output: true },
    },
  },
  Machine.CrafterStorageInterface,
);
