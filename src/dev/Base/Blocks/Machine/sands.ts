BlockRegistry.createBlock("sliceAndSplice", [
  {
    name: "tile.block_slice.name",
    texture: [["blockSoulMachineBottom", 0], ["blockSoulMachineTop", 0], ["blockSoulMachineSide", 0], ["sliceAndSpliceFront", 0], ["blockSoulMachineSide", 0], ["blockSoulMachineSide", 0]],
    inCreative: true
  }
], "machine");

TileRenderer.setHandAndUiModel(BlockID.sliceAndSplice, 0, [["blockSoulMachineBottom", 0], ["blockSoulMachineTop", 0], ["blockSoulMachineSide", 0], ["sliceAndSpliceFront", 0], ["blockSoulMachineSide", 0], ["blockSoulMachineSide", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.sliceAndSplice, 2, [["blockSoulMachineBottom", 0], ["blockSoulMachineTop", 0], ["blockSoulMachineSide", 0], ["sliceAndSpliceFront", 0], ["blockSoulMachineSide", 0], ["blockSoulMachineSide", 0]]);
TileRenderer.registerModelWithRotation(BlockID.sliceAndSplice, 2, [["blockSoulMachineBottom", 0], ["blockSoulMachineTop", 0], ["blockSoulMachineSide", 0], ["sliceAndSpliceFrontOn", 0], ["blockSoulMachineSide", 0], ["blockSoulMachineSide", 0]]);

TileRenderer.setRotationFunction(BlockID.sliceAndSplice);

var SliceAndSpliceGUI = MachineRegistry.createInventoryWindow("Slice 'n' splice", {
  drawing: [
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    { type: "bitmap", x: 630, y: 235, bitmap: "bar_progress0", scale: 3.2 },
  ],
  elements: {
    "textInstall": { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 100, height: 30, text: "" },
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    "progressScale": {
      type: "scale",
      x: 630,
      y: 235,
      bitmap: "bar_progress2",
      scale: 3.2,
      clicker: {
        onClick: function () {
          RV && RV.RecipeTypeRegistry.openRecipePage("enderio_sas");
        }
      }
    },
    "slotInput0": { type: "slot", x: 400, y: 200 },
    "slotInput1": { type: "slot", x: 460, y: 200 },
    "slotInput2": { type: "slot", x: 520, y: 200 },
    "slotInput3": { type: "slot", x: 400, y: 260 },
    "slotInput4": { type: "slot", x: 460, y: 260 },
    "slotInput5": { type: "slot", x: 520, y: 260 },
    "slotOutput": { type: "slot", x: 720, y: 230 },
    "slotAxe": { type: "slot", x: 430, y: 140 },
    "slotShears": { type: "slot", x: 490, y: 140 },
    "slotCapacitor": { type: "slot", x: 325, y: 320 },
    "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
  }
});

let accept_axe = {};
let accept_shear = {};
Callback.addCallback("PreLoaded", function () {
  for (let id in VanillaItemID) {
    if (id.endsWith("_axe") && !id.startsWith("wooden") && !id.startsWith("stone")) {
      accept_axe[id] = true
    }
  }

  for (let id in ItemID) {
    if (id.endsWith("Axe")) {
      accept_axe[id] = true
    }
  }

  for (let id in ItemID) {
    if (id.endsWith("Shear")) {
      accept_shear[id] = true
    }
  }
  accept_shear[VanillaItemID.shears] = true;

  Recipes.addShaped({ id: BlockID.sliceAndSplice, count: 1, data: 0 }, [
    "shs",
    "amc",
    "sss"
  ], ['s', ItemID.soularium, 0, 'h', 397, -1, "a", 258, 0, "c", 359, 0, "m", BlockID.machineChassiSoul, 0]);

  RecipeRegistry.addSliceAndSplice({
    input0: { id: ItemID.soularium, data: 0, count: 1 },
    input1: { id: ItemID.zombieSkull, data: 0, count: 1 },
    input2: { id: ItemID.soularium, data: 0, count: 1 },
    input3: { id: ItemID.silicon, data: 0, count: 1 },
    input4: { id: 331, data: 0, count: 1 },
    input5: { id: ItemID.silicon, data: 0, count: 1 },
    result: { id: ItemID.skullZombieController, data: 0, count: 1 },
    energy: 20000
  });

  RecipeRegistry.addSliceAndSplice({
    input0: { id: ItemID.energeticAlloy, data: 0, count: 1 },
    input1: { id: ItemID.zombieSkull, data: 0, count: 1 },
    input2: { id: ItemID.energeticAlloy, data: 0, count: 1 },
    input3: { id: ItemID.silicon, data: 0, count: 1 },
    input4: { id: ItemID.basicCapacitor, data: 0, count: 1 },
    input5: { id: ItemID.silicon, data: 0, count: 1 },
    result: { id: ItemID.skullZombieElectrode, data: 0, count: 1 },
    energy: 20000
  });
  /*                   
  MachineRecipe.addSliceAndSpliceRecipe(
  [ItemID.soulariumIngot, , ItemID.soulariumIngot,
   ItemID.silicon, 331, ItemID.silicon], {}
  );*/
});


namespace Machine {
  export class SliceAndSplice extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0
    }

    defaultEnergyStorage = 100000;
    defaultEnergyConsume = 80;
    upgrades: ["capacitor"];

    processTime = 250;

    getScreenByName(): UI.IWindow {
      return SliceAndSpliceGUI;
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorAPI.isValidCapacitor(id, this)
        if (name == "slotInput")
          return SliceAndSpliceRecipe.getRecipeWithItem({ id: id, data: data, count: amount })
        if (name.startsWith("slotAxe")) return accept_axe[id];
        if (name.startsWith("slotShear")) return accept_shear[id];
        return false;
      });
    }

    getAxe(): boolean {
      let slotAxe = this.container.getSlot("slotAxe");
      if (accept_axe[slotAxe.id])
        return !!accept_axe[slotAxe.id];
    }

    getShears(): boolean {
      let slotShears = this.container.getSlot("slotShears");
      if (accept_shear[slotShears.id])
        return!!accept_shear[slotShears.id];
    }

    applyDamage(slot: ItemContainerSlot): void {
      var unbreakingLevel = slot.extra.getEnchantLevel(EEnchantment.UNBREAKING);
      if (Math.random() < (1 / (unbreakingLevel + 1))) {
        slot.data += 1;
      }
      if (slot.data >= Item.getMaxDamage(slot.id)) {
        slot.id = slot.data = slot.count = 0;
        slot.extra = null
      }
    }

    decreaseAllSlot(count: number): void {
      let slot0 = this.container.getSlot("slotInput0");
      let slot1 = this.container.getSlot("slotInput1");
      let slot2 = this.container.getSlot("slotInput2");
      let slot3 = this.container.getSlot("slotInput3");
      let slot4 = this.container.getSlot("slotInput4");
      let slot5 = this.container.getSlot("slotInput5");
      this.decreaseSlot(slot0, count);
      this.decreaseSlot(slot1, count);
      this.decreaseSlot(slot2, count);
      this.decreaseSlot(slot3, count);
      this.decreaseSlot(slot4, count);
      this.decreaseSlot(slot5, count);
    }
    run(): void {
      let newActive = false
      let output = this.container.getSlot("slotOutput");
      let slotShears = this.container.getSlot("slotShears");
      let recipe = SliceAndSpliceRecipe.getRecipe(this.container)
      let slotAxe = this.container.getSlot("slotAxe");

      if (recipe && this.getAxe() && this.getShears() && ((output.id == recipe.result.id && output.count < 64 + recipe.result.count && output.data == recipe.result.data) || output.id == 0)) {
        if (this.data.energy >= this.energyConsume) {
          this.data.progress += this.energyConsume;
          this.data.energy -= this.energyConsume
          this.processTime = recipe.energy;
          newActive = true;
          if (this.data.progress >= this.processTime) {
            this.decreaseAllSlot(1);
            output.id = recipe.result.id;
            output.data = recipe.result.data;
            output.count++;
            output.markDirty();
            newActive = false;
            this.applyDamage(slotShears);
            this.applyDamage(slotAxe);
            this.data.progress = 0;
            this.container.validateAll();
          }
        }
      } else {
        this.data.progress = 0;
      }
      this.setActive(newActive);
    }
    onTick(): void {
      this.useCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
      var energyStorage = this.getEnergyStorage();
      this.data.energy = Math.min(this.data.energy, energyStorage);
      this.container.setScale("energyScale", this.data.energy / energyStorage);
      this.container.setScale("progressScale", this.data.progress / this.processTime || 0)
      this.container.setText("text", "RF: " + this.data.energy + "/" + energyStorage);
      this.container.sendChanges();
    }

    getEnergyStorage(): number {
      return this.energyStorage;
    }
  }
}
