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
        onClick: function() {
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

Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.sliceAndSplice, count: 1, data: 0 }, [
    	"shs",
    	"amc",
	   "sss"
  ], ['s', ItemID.soularium, 0, 'h', 397, -1, "a", 258, 0, "c", 359, 0, "m", BlockID.machineChassiSoul, 0]);

  RecipeRegistry.addSliceAndSplice({
    input0: { id: ItemID.soularium, data: 0 },
    input1: { id: ItemID.zombieSkull, data: 0 },
    input2: { id: ItemID.soularium, data: 0 },
    input3: { id: ItemID.silicon, data: 0 },
    input4: { id: 331, data: 0 },
    input5: { id: ItemID.silicon, data: 0 },
    output: { id: ItemID.skullZombieController, data: 0 },
    time: 250
  });

  RecipeRegistry.addSliceAndSplice({
    input0: { id: ItemID.energeticAlloy, data: 0 },
    input1: { id: ItemID.zombieSkull, data: 0 },
    input2: { id: ItemID.energeticAlloy, data: 0 },
    input3: { id: ItemID.silicon, data: 0 },
    input4: { id: ItemID.basicCapacitor, data: 0 },
    input5: { id: ItemID.silicon, data: 0 },
    output: { id: ItemID.skullZombieElectrode, data: 0 },
    time: 250
  });
  /*                   
  MachineRecipe.addSliceAndSpliceRecipe(
  [ItemID.soulariumIngot, , ItemID.soulariumIngot,
   ItemID.silicon, 331, ItemID.silicon], {}
  );*/
});


let accept_axe = {};
for (let id in VanillaItemID) {
  if (id.endsWith("_axe")) {
    accept_axe[id] = true
  }
}

MachineRegistry.registerElectricMachine(BlockID.sliceAndSplice, {
  defaultValues: {
    power_tier: 2,
    progress: 0,
    work_time: 250,
    speed: 1,
    energy_consumption: 80,
    energy_storage: 100000,
    isActive: false
  },
  oldValues: {
    speed: 1,
    energy_consumption: 80,
    energy_storage: 100000,
  },

  getScreenByName: function() {
    return SliceAndSpliceGUI;
  },

  upgrades: ["capacitor"],

  getAxe: function() {
    let slotAxe = this.container.getSlot("slotAxe");
    if (accept_axe[slotAxe])
      return !!accept_axe[slotAxe];
  },

  decreaseSlot: function() {
    let slot0 = this.container.getSlot("slotInput0");
    let slot1 = this.container.getSlot("slotInput1");
    let slot2 = this.container.getSlot("slotInput2");
    let slot3 = this.container.getSlot("slotInput3");
    let slot4 = this.container.getSlot("slotInput4");
    let slot5 = this.container.getSlot("slotInput5");
    input0.count--;
    input1.count--;
    input2.count--;
    input3.count--;
    input4.count--;
    input5.count--;
    this.container.validateAll(); //
  },

  applyDamage: function(slot) {
    var unbreakingLevel = slot.extra.getEnchantLevel(Native.Enchantment.UNBREAKING);
    if (Math.random() < (1 / (unbreakingLevel + 1))) {
      slot.data += damage;
    }
    if (slot.data >= Item.getMaxDamage(slot.id)) {
      slot.id = slot.data = slot.count = 0;
      slot.extra = null
    }
  },

  machineRun: function() {
    let newActive = false;
    let output = this.container.getSlot("slotOutput");
    let slotShears = this.container.getSlot("slotShears");
    let recipe = SliceAndSpliceRecipes.getRecipe(this.container)
    let slotAxe = this.container.getSlot("slotAxe");

    if (recipe && this.getAxe() && slotShears.id == 359 && ((output.id == recipe.output.id && output.count < 64 && output.data == recipe.output.data) || output.id == 0)) {
      if (this.data.energy >= this.data.energy_consumption) {
        this.data.progress += this.data.speed;
        this.data.energy -= this.data.energy_consumption;
        newActive = true;
        this.data.work_time = time;
        if (this.data.progress >= this.data.work_time) {
          this.decreaseSlot();
          output.id = recipe.output.id;
          output.data = recipe.output.data;
          output.count++;
          this.applyDamage(slotShears);
          this.applyDamage(slotAxe);
          this.data.progress = 0;
          this.container.validateAll();
        }
      }
    } else {
      this.data.progress = 0;
    }

    if (!newActive)
      // this.stopPlaySound(true);
      this.setActive(newActive);
  },

  useCapacitor: function() {
    var upgrades = CapacitorAPI.useCapacitor(this);
    this.data.energy_consumption = upgrades.getEnergyConsume(this.oldValues.energy_consumption);
    this.data.energy_storage = upgrades.getEnergyStorage(this.oldValues.energy_storage);
    this.data.speed = upgrades.getSpeed(this.oldValues.speed)

    return upgrades;
  },

  onTick: function() {
    this.useCapacitor();
    let capacitor = this.container.getSlot("slotCapacitor");
    if (CapacitorAPI.getCapacitor(capacitor.id)) {
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.machineRun();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
    }
    
    var energyStorage = this.getEnergyStorage();
    this.data.energy = Math.min(this.data.energy, energyStorage);
    this.container.setScale("energyScale", this.data.energy / energyStorage);
    this.container.setScale("progressScale", this.data.progress / this.data.work_time || 0)
    this.container.setText("text", "RF: " + this.data.energy + "/" + energyStorage);
    this.container.sendChanges();
  },
  getEnergyStorage: function() {
    return this.data.energy_storage;
  }
});