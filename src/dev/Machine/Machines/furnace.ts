BlockRegistry.createBlock("simplePoweredFurnace", [
  {
    name: "tile.block_simple_furnace.name",
    texture: [
	["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["furnace_simple_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]],
    inCreative: true
  }
], "machine");

TileRenderer.setHandAndUiModel(BlockID.simplePoweredFurnace, 0, [
	["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["furnace_simple_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);
TileRenderer.setStandardModelWithRotation(BlockID.simplePoweredFurnace, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["furnace_simple_front", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);
TileRenderer.registerModelWithRotation(BlockID.simplePoweredFurnace, 2, [["simple_machine_bottom", 0], ["simple_machine_top", 0], ["simple_machine_side", 0], ["furnace_simple_front_on", 0], ["simple_machine_side", 0], ["simple_machine_side", 0]]);

TileRenderer.setRotationFunction(BlockID.simplePoweredFurnace);

/*
function setSimpleAlloyRender() {
  let simpleAlloyRender = new ICRender.Model();
  BlockRenderer.setStaticICRender(BlockID.simplePoweredFurnace, 0, simpleAlloyRender);
  let model = BlockRenderer.createModel();
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

let simpleFurnaceUI = MachineRegistry.createInventoryWindow("Simple Powered Furnace", {
  drawing: [
    { type: "bitmap", x: 527, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 687, y: 235, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
        //{type: "bitmap", x: 600, y: 170, bitmap: "bar_alloy", scale: 4.5},
    ],
  elements: {
    "progressScale0": {
      type: "scale",
      x: 527,
      y: 235,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
      clicker: {
        onClick: function() {
          RV?.RecipeTypeRegistry.openRecipePage("furnace");
        }
      }
    },
    "progressScale1": {
      type: "scale",
      x: 687,
      y: 235,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2,
      clicker: {
        onClick: function() {
          RV?.RecipeTypeRegistry.openRecipePage("furnace");
        }
      }
    },
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    "sourceSlot": { type: "slot", x: 600, y: 140 },
    //"text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    "slotResult": { type: "slot", x: 600, y: 320 }
  }
});


Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.simplePoweredFurnace, count: 1, data: 0 }, [
    	"ibi",
    	"fmf",
	   "aca"
  ], ['i', 265, 0, 'f', 98, 0, "m", BlockID.machineChassiSimple, 0, "c", VanillaItemID.bucket, 0, "a", ItemID.stoneGear, 0, "b", 61, 0]);
});
namespace Machine {
  export class PoweredFurnace_Simple extends SimpleMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    }

    getScreenByName(): UI.IWindow {
      return simpleFurnaceUI;
    }

    onTick(): void {
      this.lossEnergy();
      StorageInterface.checkHoppers(this);
      let newActive = false;
      const slot = this.container.getSlot("sourceSlot");
      const result = Recipes.getFurnaceRecipeResult(slot.id, slot.data, "iron");
      if (result) {
        let resultSlot = this.container.getSlot("slotResult");
        if (resultSlot.id == result.id && resultSlot.count + result.count <= 64 || !resultSlot.id) {
          if (this.data.energy >= this.energyConsume) {
            this.data.energy -= this.energyConsume;
            this.data.progress += this.energyConsume;
            newActive = true;
          }
          if (this.data.progress >= 3000) {
            slot.setSlot(slot.id, slot.count - 1, slot.data);
            slot.validate();
            resultSlot.setSlot(result.id, resultSlot.count + 1, result.data);
            this.container.validateAll();
            this.data.progress = 0;
          }
        }
      } else {
        this.data.progress = 0;
      }

      this.setActive(newActive);
      this.container.setScale("progressScale0", this.data.progress / 3000 || 0);
      this.container.setScale("progressScale1", this.data.progress / 3000 || 0);
      this.container.setScale("energyScale", this.data.energy / 2000);
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.simplePoweredFurnace, new PoweredFurnace_Simple());
}