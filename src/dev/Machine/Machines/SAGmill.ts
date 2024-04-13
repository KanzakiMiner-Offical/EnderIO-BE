BlockRegistry.createBlock("simplesagmill", [
  {
    name: "tile.block_simple_sag_mill.name",
    texture: [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_simple_sagmill_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]
    ],
    inCreative: true
  }
], "machine");

TileRenderer.setHandAndUiModel(BlockID.simplesagmill, 0, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_simple_sagmill_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]
]);
TileRenderer.setStandardModelWithRotation(BlockID.simplesagmill, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_simple_sagmill_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]
]);
TileRenderer.registerModelWithRotation(BlockID.simplesagmill, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["block_simple_sagmill_front_on", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);

TileRenderer.setRotationFunction(BlockID.simplesagmill);


Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id: BlockID.simplesagmill, count: 1, data: 0 }, [
    "fff",
    "ipi",
    "ama"
  ], ['i', VanillaItemID.iron_ingot, 0, 'f', VanillaItemID.flint, 0, "m", VanillaBlockID.piston, 0, "p", BlockID.machineChassiSimple, 0, 'a', ItemID.woodGear, 0 ]);

})
let simpleSAGGui = MachineRegistry.createInventoryWindow("Simple SAG Mill", {
  drawing: [
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    { type: "bitmap", x: 595, y: 250, bitmap: "bar_progress_down0", scale: 4.2 },
  ],
  elements: {
    "progressScale": {
      type: "scale",
      x: 595,
      y: 250,
      direction: 3,
      bitmap: "bar_progress_down1",
      scale: 4.2,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("enderio_sag");
        }
      }
    },
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    "ingredient": { type: "slot", x: 602, y: 170 },
    "result0": { type: "slot", x: 505, y: 340 },
    "result1": { type: "slot", x: 570, y: 340 },
    "result2": { type: "slot", x: 635, y: 340 },
    "result3": { type: "slot", x: 700, y: 340 }
  }
});

namespace Machine {
  export class SagMill_Simple extends SimpleMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    }

    getScreenByName(): UI.IWindow {
      return simpleSAGGui;
    }

    onTick(): void {

      this.lossEnergy();
      StorageInterface.checkHoppers(this);
      let newActive = false;

      let input = this.container.getSlot("ingredient");
      let res0 = this.container.getSlot("result0");
      let res1 = this.container.getSlot("result1");
      let res2 = this.container.getSlot("result2");
      let res3 = this.container.getSlot("result3");
      let recipe = CrusherRecipe.getRecipe(input);
      if (recipe) {
        let isGrinding = recipe.isGrinding;
        let ingredient = recipe.ingredient;
        let result0 = recipe.result0;
        let result1 = recipe.result1;
        let result2 = recipe.result2;
        let result3 = recipe.result3;
        let time = recipe.energy;
        if (((res0.id == result0.id && res0.data == result0.data && res0.count + result0.count <= 64) || (res0.id == 0)) &&
          ((res1.id == result1.id && res1.data == result1.data && res1.count < 64) || (res1.id == 0)) &&
          ((res2.id == result2.id && res2.data == result2.data && res2.count < 64) || (res2.id == 0)) &&
          ((res3.id == result3.id && res3.data == result3.data && res3.count < 64) || (res3.id == 0))) {
          this.processTime = time;
          if (this.data.energy >= this.energyConsume) {
            newActive = true;
            this.data.progress += this.energyConsume;
            this.data.energy -= this.energyConsume;
          }
          if (this.data.progress >= this.processTime) {
            input.count--;
            input.markDirty();
            let outputRandom = Math.random();
            if (outputRandom <= result0.chance) {
              res0.id = result0.id;
              res0.data = result0.data;
              res0.count += result0.count;
              res0.markDirty();
            }
            if (outputRandom <= result1.chance) {
              res1.id = result1.id;
              res1.data = result1.data;
              res1.count += 1;
              res1.markDirty();
            }
            if (outputRandom <= result2.chance) {
              res2.id = result2.id;
              res2.data = result2.data;
              res2.count += 1;
              res2.markDirty();
            }
            if (outputRandom <= result3.chance) {
              res3.id = result3.id;
              res3.data = result3.data;
              res3.count += 1;
              res3.markDirty();
            }
            this.container.validateAll();
            this.data.progress = 0;
          }
        }
      }

      this.setActive(newActive);
      this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.setScale("energyScale", this.data.energy / 2000);
      this.container.sendChanges();

    }
  }

  MachineRegistry.registerPrototype(BlockID.simplesagmill, new SagMill_Simple());
}