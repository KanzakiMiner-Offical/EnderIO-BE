BlockRegistry.createBlock(
  "simpleAlloySmelter",
  [
    {
      name: "tile.block_simple_alloy_smelter.name",
      texture: [
        ["simple_machine_bottom", 0],
        ["simple_machine_top", 0],
        ["simple_machine_side", 0],
        ["alloy_smelter_simple_front", 0],
        ["simple_machine_side", 0],
        ["simple_machine_side", 0],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.simpleAlloySmelter, 0, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["alloy_smelter_simple_front", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.setStandardModelWithRotation(BlockID.simpleAlloySmelter, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["alloy_smelter_simple_front", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);
TileRenderer.registerModelWithRotation(BlockID.simpleAlloySmelter, 2, [
  ["simple_machine_bottom", 0],
  ["simple_machine_top", 0],
  ["simple_machine_side", 0],
  ["alloy_smelter_front_on_simple", 0],
  ["simple_machine_side", 0],
  ["simple_machine_side", 0],
]);

TileRenderer.setRotationFunction(BlockID.simpleAlloySmelter);

let simpleAlloyUI = MachineRegistry.createInventoryWindow("Simple Alloy Smelter", {
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
    slotResult: { type: "slot", x: 310, y: 285, size: 80 },
  },
});

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.simpleAlloySmelter, count: 1, data: 0 },
    ["bbb", "fmf", "ici"],
    ["i", ItemID.stoneGear, 0, "f", 61, 0, "m", BlockID.machineChassisSimple, 0, "c", VanillaItemID.bucket, 0, "b", VanillaItemID.iron_ingot, 0],
  );
});

namespace Machine {
  export class AlloySmelter_Simple extends SimpleMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };

    constructor() {
      super(
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_USE,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_BUFFER,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_INTAKE,
        CapacitorKey.SIMPLE_ALLOY_SMELTER_POWER_LOSS,
      );
    }

    getScreenByName(): UI.IWindow {
      return simpleAlloyUI;
    }

    onTick(): void {
      this.lossEnergy();
      StorageInterface.checkHoppers(this);

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
      this.container.setScale("energyScale", this.getRelativeEnergy() || 0);
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.simpleAlloySmelter, new AlloySmelter_Simple());
}
