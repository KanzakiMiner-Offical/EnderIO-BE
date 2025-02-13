IDRegistry.genBlockID("theVat");
Block.createBlock("theVat", [
  {
    name: "tile.block_vat.name",
    texture: [["machineBottom", 0]],
    inCreative: true,
  },
]);
ICRender.getGroup("liquid_pipe").add(BlockID.theVat, -1);

ModelHelper.setInventoryModel(
  new ItemStack(BlockID.theVat, 1, 0),
  "vat/theVat",
  "vat/theVat",
  {
    translate: [0.25, 0, 0],
    scale: [1, 1, 1],
    invertV: false,
    noRebuild: false,
  },
  [0, 0, -15],
);
ModelHelper.setHandModel(new ItemStack(BlockID.theVat, 1, 0), "vat/theVat", "vat/theVat", {
  translate: [0.25, 0, 0],
  scale: [1, 1, 1],
  invertV: false,
  noRebuild: false,
});

ModelHelper.registerModelWithRotation(BlockID.theVat, "resources/assets/models/vat/theVat", ["theVat", 0], {
  translate: [0.5, 0.5, 0.5],
  scale: [1, 1, 1],
  invertV: false,
  noRebuild: false,
});

// function setVatRender() {
//   var vatRender = new ICRender.Model();
//   BlockRenderer.setStaticICRender(BlockID.theVat, 0, vatRender);
//   var model = BlockRenderer.createModel();

//   model.addBox(0.25 / 16, 0.25 / 16, 0.25 / 16, 15.75 / 16, 4 / 16, 15.75 / 16, [["machineBottom", 0], ["machineBottom", 0], ["base", 0], ["base", 0], ["base", 0], ["base", 0]]); //base
//   model.addBox(0.25 / 16, 4 / 16, 0.25 / 16, 6.75 / 16, 15.75 / 16, 15.75 / 16, [["machineBottom", 0], ["tank_top_front", 0], ["machineBottom", 0], ["tank_top_front", 1], ["vat_tank_side", 0], ["vat_tank_side", 0]]); //rightTank
//   model.addBox(9.25 / 16, 4 / 16, 0.25 / 16, 15.75 / 16, 15.75 / 16, 15.75 / 16, [["machineBottom", 0], ["tank_top_front", 0], ["machineBottom", 0], ["tank_top_front", 1], ["vat_tank_side", 0], ["vat_tank_side", 0]]); //leftTank
//   model.addBox(6.75 / 16, 5 / 16, 4 / 16, 9.25 / 16, 12 / 16, 12 / 16, "machineBottom", 0); //center
//   model.addBox(6.75 / 16, 13 / 16, 4 / 16, 9.25 / 16, 15 / 16, 12 / 16, "machineBottom", 0); //centerTop
//   model.addBox(7.5 / 16, 12 / 16, 1.5 / 16, 8.5 / 16, 13 / 16, 5.5 / 16, "machineBottom", 0); //spout
//   model.addBox(7.5 / 16, 12 / 16, 0.4 / 16, 8.5 / 16, 13 / 16, 2.4 / 16, "machineBottom", 0); //spoutTip
//   model.addBox(0 / 16, 0 / 16, 0 / 16, 1 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(15 / 16, 0 / 16, 0 / 16, 16 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(15 / 16, 0 / 16, 15 / 16, 16 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(0 / 16, 0 / 16, 15 / 16, 1 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(1 / 16, 0 / 16, 0 / 16, 15 / 16, 1 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(10 / 16, 15 / 16, 0 / 16, 15 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(1 / 16, 0 / 16, 15 / 16, 15 / 16, 1 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(10 / 16, 15 / 16, 15 / 16, 15 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(0 / 16, 0 / 16, 1 / 16, 1 / 16, 1 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(0 / 16, 15 / 16, 1 / 16, 1 / 16, 16 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(15 / 16, 0 / 16, 1 / 16, 16 / 16, 1 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(15 / 16, 15 / 16, 1 / 16, 16 / 16, 16 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(1 / 16, 15 / 16, 15 / 16, 6 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(1 / 16, 15 / 16, 0 / 16, 6 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(9 / 16, 4.5 / 16, 0 / 16, 10 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(6 / 16, 4.5 / 16, 0 / 16, 7 / 16, 16 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(6 / 16, 4.5 / 16, 15 / 16, 7 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(9 / 16, 4.5 / 16, 15 / 16, 10 / 16, 16 / 16, 16 / 16, "machineBottom", 0); //undefined
//   model.addBox(6 / 16, 15 / 16, 1 / 16, 7 / 16, 16 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(9 / 16, 15 / 16, 1 / 16, 10 / 16, 16 / 16, 15 / 16, "machineBottom", 0); //undefined
//   model.addBox(6 / 16, 3.5 / 16, 0 / 16, 10 / 16, 4.5 / 16, 1 / 16, "machineBottom", 0); //undefined
//   model.addBox(6 / 16, 3.5 / 16, 15 / 16, 10 / 16, 4.5 / 16, 16 / 16, "machineBottom", 0); //undefined

//   vatRender.addEntry(model);
// }

// Block.setBlockShape(BlockID.theVat, { "x": 0, "y": 0, "z": 0 }, { "x": 1, "y": 1, "z": 1 });

// setVatRender();

var VatGUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_vat.name"), {
  drawing: [{ type: "bitmap", x: 350, y: -80, bitmap: "backgroundVat", scale: 3.4 }],
  elements: {
    energyScale: {
      type: "scale",
      x: 412,
      y: 143,
      direction: 1,
      bitmap: "redflux_bar1",
      scale: 2.8,
    },
    slotCapacitor: {
      type: "slot",
      x: 398,
      y: 302,
      size: 60,
      bitmap: "empty",
    },
    slotInput0: {
      type: "slot",
      x: 560,
      y: 140,
      size: 60,
      bitmap: "empty",
      isTransparentBackground: true,
    },
    slotInput1: {
      type: "slot",
      x: 728,
      y: 140,
      size: 60,
      bitmap: "empty",
      isTransparentBackground: true,
    },
    textInstall: {
      type: "text",
      font: { size: 20, color: Color.YELLOW },
      x: 325,
      y: 50,
      width: 100,
      height: 30,
      text: "",
    },
    liquidScale1: {
      type: "scale",
      x: 473,
      y: 132,
      direction: 1,
      bitmap: "fluid_scale",
      scale: 2.9,
    },
    liquidScale2: {
      type: "scale",
      x: 824,
      y: 132,
      direction: 1,
      bitmap: "fluid_scale",
      scale: 2.9,
    },
    progressScale: {
      type: "scale",
      x: 646,
      y: 317,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.3,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("ender_vat");
        },
      },
    },
    slot1: {
      type: "slot",
      x: 470,
      y: 320,
      size: 60,
      bitmap: "slot_fluid_full",
    },
    slot3: {
      type: "slot",
      x: 820,
      y: 320,
      size: 60,
      bitmap: "slot_fluid_empty",
    },
    slot2: {
      type: "slot",
      x: 470,
      y: 380,
      size: 60,
      bitmap: "slot_fluid_empty",
    },
    slot4: {
      type: "slot",
      x: 820,
      y: 380,
      size: 60,
      bitmap: "slot_fluid_full",
    },
  },
});

/*
Vat recipes take two item inputs and one fluid input, and output a fluid.
The various values are calculated like this:
  For:
  ingredient multiplier(IM) = slot0.multiplier * slot1.multiplier;
input fluid volume(mb) = IM * 1000
Produce:
  output fluid volume(mb) = IM * inputFluid.multiplier * 1000.
*/
VatRecipe.add({
  // RecipeRegistry.addVat
  input1: {
    "minecraft:rotten_flesh": 1.5,
    "minecraft:chicken": 0.75,
    "minecraft:beef": 0.75,
    "minecraft:porkchop": 0.75,
    "minecraft:rabbit": 0.75,
    "minecraft:mutton": 0.75,
  },
  input2: {
    "minecraft:sugar": 1,
    "minecraft:brown_mushroom": 1.5,
    "minecraft:red_mushroom": 1.5,
    "minecraft:nether_wart": 1.5,
    "minecraft:fermented_spider_eye": 2,
  },
  inputLiquid: "water",
  inputMutilplier: 0.25,
  outputLiquid: "nutrientDistillation",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "ItemID.dustPulsating": 2,
  },
  input2: {
    "ItemID.dustEnderCrystal": 2,
  },
  inputLiquid: "nutrientDistillation",
  inputMutilplier: 0.25,
  outputLiquid: "enderDistillation",
  energy: 15000,
});

VatRecipe.add({
  input1: {
    "minecraft:poisonous_potato": "8.0",
    "minecraft:potato": "4.0",
    "minecraft:apple": "3.5",
    "minecraft:wheat": "3.0",
    "ItemID.dustWheat": "3.0",
    "minecraft:wheat_seeds": "2.0",
    "minecraft:pumpkin_seeds": "1.6",
    "minecraft:melon_seeds": "1.6",
    "minecraft:beetroot_seeds": "1.4",
  },
  input2: {
    "minecraft:melon": 0.2,
    "minecraft:sugar": 1,
  },
  inputLiquid: "water",
  inputMutilplier: 0.25,
  outputLiquid: "hootch",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "minecraft:gunpowder": 1,
  },
  input2: {
    "minecraft:redstone": 1,
  },
  inputLiquid: "hootch",
  inputMutilplier: 1,
  outputLiquid: "rocketFuel",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "minecraft:gunpowder": 1,
  },
  input2: {
    "minecraft:blaze_powder": 1,
  },
  inputLiquid: "hootch",
  inputMutilplier: 1,
  outputLiquid: "fireWater",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "minecraft:glowstone_dust": 0.25,
    "minecraft:glowstone": 1,
  },
  input2: {
    "minecraft:double_plant:0": 1,
  },
  inputLiquid: "fireWater",
  inputMutilplier: 1,
  outputLiquid: "sunshine",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "ItemID.dustSilver": 2.5,
    "ItemID.dustSalt": 1.5,
    "ItemID.dustElectrum": 3.5,
    "minecraft:clay_ball": 0.25,
    "minecraft:clay": 1,
  },
  input2: {},
  inputLiquid: "cloudSeed",
  inputMutilplier: 0.5,
  outputLiquid: "cloudSeedConcentrated",
  energy: 10000,
});

VatRecipe.add({
  input1: {
    "ItemID.dustSilver": 3.5,
    "ItemID.dustSalt": 2.5,
    "minecraft:clay_ball": 0.5,
    "minecraft:clay": 2,
  },
  input2: {
    "minecraft:packed_ice": 1.5,
    "minecraft:ice": 1,
    "minecraft:snowball": 0.1,
    "minecraft:snow": 0.5,
  },
  inputLiquid: "water",
  inputMutilplier: 1,
  outputLiquid: "cloudSeed",
  energy: 10000,
});

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.theVat, count: 1, data: 0 },
    ["ici", "rmr", "gfg"],
    ["i", ItemID.electricalSteel, 0, "c", 380, 0, "r", BlockID.eioTank, 0, "f", VanillaBlockID.furnace, 0, "m", BlockID.machineChassi, 0, "g", ItemID.darkSteel, 0],
  );
});

namespace Machine {
  export class TheVat_Basic extends BasicMachine {
    inputTank: BlockEngine.LiquidTank;
    outputTank: BlockEngine.LiquidTank;

    defaultValues = {
      energy: 0,
      progress: 0,
      mode: 0,
    };

    capacitors = ["capacitor"];
    acceptType = ["wet", "buffer", "intake"];

    initCapacitor(): void {
      const capacitors = CapacitorData.useCapacitor(this);
      this.energyConsume = capacitors.getValue(CapacitorKey.VAT_POWER_USE);
      this.maxIntake = capacitors.getValue(CapacitorKey.VAT_POWER_INTAKE);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.VAT_POWER_BUFFER));
    }

    getScreenByName(): UI.IWindow {
      return VatGUI;
    }

    setupContainer(): void {
      this.inputTank = this.addLiquidTank("inputTank", 5000, VatRecipe.getLiquidInput());
      this.outputTank = this.addLiquidTank("outputTank", 5000, VatRecipe.getLiquidOutput());
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        if (name.startsWith("slot")) return true;
        return false;
      });
    }

    run(): void {
      let newActive = false;
      let ingredient1 = this.container.getSlot("slotInput0");
      let ingredient2 = this.container.getSlot("slotInput1");

      let result = VatRecipe.getResult(ingredient1, ingredient2, this.inputTank);
      if (result) {
        let time = result.energy;
        let outputID = result.liquidOut;
        let outputAmount = result.amount;
        this.processTime = time;
        if ((this.outputTank.getLiquidStored() == outputID && this.outputTank.getAmount(outputID) <= this.outputTank.getLimit() - outputAmount) || !this.outputTank.getLiquidStored()) {
          if (this.data.energy >= this.energyConsume) {
            this.data.progress += this.energyConsume;
            this.data.energy -= this.energyConsume;
            newActive = true;
            if (this.data.progress >= this.processTime) {
              VatRecipe.performRecipe(result, this);
            }
          }
        }
      } else {
        this.data.progress = 0;
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
      let slot1 = this.container.getSlot("slot1");
      let slot2 = this.container.getSlot("slot2");
      this.inputTank.getLiquidFromItem(slot1, slot2);

      let slot3 = this.container.getSlot("slot3");
      let slot4 = this.container.getSlot("slot4");
      this.outputTank.addLiquidToItem(slot3, slot4);

      this.inputTank.updateUiScale("liquidScale1");
      this.outputTank.updateUiScale("liquidScale2");

      this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }
  }

  MachineRegistry.registerPrototype(BlockID.theVat, new TheVat_Basic());
  MachineRegistry.createStorageInterface(BlockID.theVat, {
    slots: {
      slotInput0: {
        input: true,
      },
      slotInput1: {
        input: true,
      },
      slot1: {
        input: true,
      },
      slot2: {
        output: true,
        isValid: (item: ItemInstance) => {
          return item.id == VanillaItemID.bucket;
        },
      },
      slot3: {
        input: true,
        isValid: (item: ItemInstance) => {
          return item.id == VanillaItemID.bucket;
        },
      },
      slot4: {
        output: true,
      },
    },
    canReceiveLiquid: () => true,
    canTransportLiquid: () => true,
    getInputTank: function (side: number) {
      return this.tileEntity.inputTank;
    },
    getOutputTank: function () {
      return this.tileEntity.outputTank;
    },
  });
}
