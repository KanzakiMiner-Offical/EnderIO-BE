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

/*
function setSimpleAlloyRender() {
  var simpleAlloyRender = new ICRender.Model();
  BlockRenderer.setStaticICRender(BlockID.simpleAlloySmelter, 0, simpleAlloyRender);
  var model = BlockRenderer.createModel();
  //model.addBox(x, y, z, x, y, z, texture, 0);
  model.addBox(1 / 16, 12 / 16, 14.75 / 16, 15 / 16, 15 / 16, 15.75 / 16, "machineBottom", 0);
  model.addBox(9 / 16, 4 / 16, 0 / 16, 16 / 16, 16 / 16, 16 / 16, "machineBottom", 0);
  model.addBox(0 / 16, 4 / 16, 0 / 16, 7 / 16, 16 / 16, 16 / 16, "machineBottom", 0);
  model.addBox(7 / 16, 4 / 16, 4 / 16, 9 / 16, 11 / 16, 12 / 16, "machineBottom", 0);
  model.addBox(7 / 16, 8 / 16, 4 / 16, 9 / 16, 10 / 16, 18 / 16, "machineBottom", 0);
  model.addBox(7 / 16, 12 / 16, 4 / 16, 9 / 16, 14 / 16, 12 / 16, "machineBottom", 0);

  simpleAlloyRender.addEntry(model);
}

setSimpleAlloyRender();*/
let simpleAlloyUI = MachineRegistry.createInventoryWindow("Simple Alloy Smelter", {
  drawing: [
    { type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    // { type: "bitmap", x: 600, y: 170, bitmap: "bar_alloy", scale: 4.5 },
  ],
  elements: {
    progressScale0: {
      type: "scale",
      x: 527,
      y: 235,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
    },
    progressScale1: {
      type: "scale",
      x: 687,
      y: 235,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_alloy");
        },
      },
    },
    energyScale: {
      type: "scale",
      x: 335,
      y: 140,
      direction: 1,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    ingredient1: { type: "slot", x: 520, y: 170 },
    ingredient2: { type: "slot", x: 600, y: 140 },
    ingredient3: { type: "slot", x: 680, y: 170 },
    //"text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    slotResult: { type: "slot", x: 600, y: 320 },
  },
});

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.simpleAlloySmelter, count: 1, data: 0 },
    ["bbb", "fmf", "ici"],
    [
      "i",
      ItemID.stoneGear,
      0,
      "f",
      61,
      0,
      "m",
      BlockID.machineChassiSimple,
      0,
      "c",
      VanillaItemID.bucket,
      0,
      "b",
      VanillaItemID.iron_ingot,
      0,
    ],
  );
});

namespace Machine {
  export class AlloySmelter_Simple extends SimpleMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };

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
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.simpleAlloySmelter, new AlloySmelter_Simple());
}
