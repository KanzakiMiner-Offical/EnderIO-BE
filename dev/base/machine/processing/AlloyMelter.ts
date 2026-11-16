BlockRegistry.createBlock(
  "alloySmelter",
  [
    {
      name: "tile.block_alloy_smelter.name",
      texture: [
        ["machineBottom", 0],
        ["machineTop", 0],
        ["machineSide", 0],
        ["alloySmelterFront", 0],
        ["machineSide", 0],
        ["machineSide", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.alloySmelter, 0, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["alloySmelterFront", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.alloySmelter, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["alloySmelterFront", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.alloySmelter, 2, [
  ["machineBottom", 0],
  ["machineTop", 0],
  ["machineSide", 0],
  ["alloySmelterFrontOn", 0],
  ["machineSide", 0],
  ["machineSide", 0],
]);

TileRenderer.setRotationFunction(BlockID.alloySmelter);

let smelterGUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_alloy_smelter.name"), {
  drawing: [
    { type: "bitmap", x: 425, y: 235, bitmap: "fire_scale0", scale: 5 },
    { type: "bitmap", x: 205, y: 235, bitmap: "fire_scale0", scale: 5 },
    { type: "bitmap", x: 76, y: 96, bitmap: "redflux_bar0", scale: 4 },
  ],
  elements: {
    progressScale0: {
      type: "scale",
      x: 425,
      y: 235,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
      bitmap: "fire_scale1",
      direction: 1,
      scale: 5,
    },
    progressScale1: {
      type: "scale",
      x: 205,
      y: 235,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
      bitmap: "fire_scale1",
      direction: 1,
      scale: 5,
    },
    energyScale: { type: "scale", x: 76, y: 96, bitmap: "redflux_bar1", direction: 1, scale: 4 },
    ingredient1: { type: "slot", x: 200, y: 96, size: 80 },
    ingredient2: { type: "slot", x: 310, y: 44, size: 80 },
    ingredient3: { type: "slot", x: 420, y: 96, size: 80 },
    slotCapacitor: { type: "slot", x: 55, y: 305, size: 90, maxStackSize: 1, bitmap: "slot_capacitor" },
    textInstall: {
      type: "text",
      font: { size: 30, color: Color.YELLOW },
      x: 76,
      y: 50,
      width: 100,
      height: 30,
      text: "",
    },
    slotResult: { type: "slot", x: 310, y: 285, size: 80 },
    changeMode: {
      type: "button",
      x: 520,
      y: 325,
      bitmap: "alloy0",
      scale: 3,
      clicker: {
        onClick: function (_, container: ItemContainer) {
          container.sendEvent("switchMode", {});
        },
      },
    },
  },
});

Callback.addCallback("PreLoaded", function () {
  Recipes.addFurnace(ItemID.dustLapis, VanillaItemID.lapis_lazuli, 0);
  Recipes.addFurnace(ItemID.dustQuarzt, VanillaItemID.quartz, 0);
  SmelterRecipe.addRecipe({
    ingredient1: { id: 331, data: 0, count: 1 },
    ingredient2: { id: 265, data: 0, count: 1 },
    result: { id: ItemID.conductiveIron, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.gold_ingot, data: 0, count: 1 },
    ingredient2: { id: VanillaBlockID.soul_sand, data: 0, count: 1 },
    result: { id: ItemID.soularium, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: 266, data: 0, count: 1 },
    ingredient2: { id: 331, data: 0, count: 1 },
    ingredient3: { id: 348, data: 0, count: 1 },
    result: { id: ItemID.energeticAlloy, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: ItemID.energeticAlloy, data: 0, count: 1 },
    ingredient2: { id: 368, data: 0, count: 1 },
    result: { id: ItemID.vibrantAlloy, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: 265, data: 0, count: 1 },
    ingredient2: { id: 368, data: 0, count: 1 },
    result: { id: ItemID.pulsatingIron, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.iron_ingot, data: 0, count: 1 },
    ingredient2: { id: ItemID.dustCoal, data: 0, count: 1 },
    ingredient3: { id: 49, data: 0, count: 1 },
    result: { id: ItemID.darkSteel, count: 1, data: 0 },
    energy: 20000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: VanillaItemID.iron_ingot, data: 0, count: 1 },
    ingredient2: { id: ItemID.dustCoal, data: 0, count: 1 },
    ingredient3: { id: ItemID.silicon, data: 0, count: 1 },
    result: { id: ItemID.electricalSteel, count: 1, data: 0 },
    energy: 10000,
  });
  SmelterRecipe.addRecipe({
    ingredient1: { id: 331, data: 0, count: 1 },
    ingredient2: { id: ItemID.silicon, data: 0, count: 1 },
    //ingredient3: { id: 0, data: 0, count: 0, count: 1 },
    result: { id: ItemID.redstoneAlloy, count: 1, data: 0 },
    energy: 10000,
  });
  /*
  Recipes.addShaped({ id: BlockID.alloySmelter, count: 1, data: 0 }, [
        "ifi",
        "fmf",
       "ici"
    ], ['i', 265, 0, 'f', 61, 0, "m", BlockID.machineChassis, 0, "c", 380, 0])
   */
  // Machine Addon :>
  Recipes.addShaped(
    { id: BlockID.alloySmelter, count: 1, data: 0 },
    ["i i", "amf", "c c"],
    ["i", ItemID.darkSteel, 0, "f", BlockID.simpleAlloySmelter, 0, "m", BlockID.machineChassis, 0, "c", ItemID.darkSteelGear, 0, "a", BlockID.simplePoweredFurnace, 0],
  );
});

namespace Machine {
  export class AlloySmelter_Basic extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      mode: 0,
    };

    capacitors = ["capacitor"];
    acceptType = ["smelting", "buffer", "intake"];
    initCapacitor(): void {
      const capacitors = CapacitorData.useCapacitor(this);
      this.energyConsume = capacitors.getValue(CapacitorKey.ALLOY_SMELTER_POWER_USE);
      this.maxIntake = capacitors.getValue(CapacitorKey.ALLOY_SMELTER_POWER_INTAKE);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.ALLOY_SMELTER_POWER_BUFFER));
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        if (name.startsWith("ingredient")) return true;
        return false;
      });
    }
    onInit(): void {
      this.container.sendEvent("setModeIcon", { mode: this.data.mode });
      super.onInit;
    }
    getScreenByName(): UI.IWindow {
      return smelterGUI;
    }

    alloy(): void {
      let newActive = false;
      const input = SmelterRecipe.getInput(this.container);
      const recipe = SmelterRecipe.getRecipe(input);
      if (recipe) {
        let resultSlot = this.container.getSlot("slotResult");
        if ((resultSlot.id == recipe.result.id && resultSlot.count + recipe.result.count <= 64) || !resultSlot.id) {
          this.processTime = recipe.energy;
          if (this.data.energy >= this.energyConsume) {
            this.data.energy -= this.energyConsume;
            this.data.progress += this.energyConsume;
            newActive = true;
          }

          if (this.data.progress >= this.processTime) {
            SmelterRecipe.performRecipe(recipe, this.container);
            this.data.progress = 0;
          }
        }
      } else {
        this.data.progress = 0;
      }

      this.setActive(newActive);

      this.container.setScale("progressScale0", this.data.progress / this.processTime || 0);
      this.container.setScale("progressScale1", this.data.progress / this.processTime || 0);
      this.container.sendChanges();
    }

    furnace(): void {
      let newActive = false;
      let input = SmelterRecipe.getInputFurnace(this.container);
      let recipe = SmelterRecipe.getRecipeFurnace(input);
      let resultSlot = this.container.getSlot("slotResult");
      if (
        !!recipe.result &&
        !!recipe.ingredient &&
        ((resultSlot.id == recipe.result.id && resultSlot.data == recipe.result.data && resultSlot.count <= 64 - recipe.result.count) || !resultSlot.id)
      ) {
        if (this.data.energy >= this.energyConsume) {
          this.data.energy -= this.energyConsume;
          this.data.progress += this.energyConsume;
          newActive = true;
        }
        if (this.data.progress >= (Recipes.getFuelBurnDuration(VanillaItemID.coal, -1) * 10) / 8) {
          let inputSlot = this.container.getSlot(recipe.ingredient);
          let count = Math.min(inputSlot.count, 3);
          inputSlot.count -= count;
          inputSlot.validate();
          inputSlot.markDirty();
          resultSlot.setSlot(recipe.result.id, resultSlot.count + Math.min(count * recipe.result.count, 3 * recipe.result.count), recipe.result.data || 0);
          this.container.validateAll();
          this.data.progress = 0;
        }
      } else {
        this.data.progress = 0;
      }
      this.setActive(newActive);
      this.container.setScale("progressScale0", this.data.progress / 3000 || 0);
      this.container.setScale("progressScale1", this.data.progress / 3000 || 0);
      this.container.sendChanges();
    }

    run(): void {
      if (this.data.mode === 0) this.alloy();
      else if (this.data.mode === 1) this.furnace();
    }

    onTick(): void {
      this.initCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "");
        this.run();
      } else if (!CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }

      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }

    @ContainerEvent(Side.Server)
    switchMode(): void {
      this.data.mode = (this.data.mode + 1) % 2;
      this.data.progress = this.processTime = 0;
      this.container.sendEvent("setModeIcon", { mode: this.data.mode });
    }

    @ContainerEvent(Side.Client)
    setModeIcon(container: ItemContainer, window: any, content: any, data: { mode: number }): void {
      if (content) {
        let element = content.elements["changeMode"];
        let texture = "alloy" + data.mode;
        if (element.bitmap != texture) {
          element.bitmap = texture;
          element.visual = data.mode % 3 > 0;
        }
      }
    }
  }

  MachineRegistry.registerPrototype(BlockID.alloySmelter, new AlloySmelter_Basic());
  StorageInterface.createInterface(BlockID.alloySmelter, {
    slots: {
      ingredient1: { input: true },
      ingredient2: { input: true },
      ingredient3: { input: true },
      slotResult: { output: true },
    },
  });
}
