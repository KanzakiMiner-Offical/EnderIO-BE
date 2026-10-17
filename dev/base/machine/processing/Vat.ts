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
    scale: [1, 1, 1],
    invertV: false,
    noRebuild: false,
  },
  [0, 0, 0],
);
ModelHelper.setHandModel(new ItemStack(BlockID.theVat, 1, 0), "vat/theVat", "vat/theVat", {
  scale: [1, 1, 1],
  invertV: false,
  noRebuild: false,
});

ModelHelper.registerModelWithRotation(BlockID.theVat, "resources/res/models/vat/theVat", ["theVat", 0], {
  translate: [0, 0, 0],
  scale: [1, 1, 1],
  invertV: false,
  noRebuild: false,
});
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
    "minecraft:poisonous_potato": 8.0,
    "minecraft:potato": 4.0,
    "minecraft:apple": 3.5,
    "minecraft:wheat": 3.0,
    "ItemID.dustWheat": 3.0,
    "minecraft:wheat_seeds": 2.0,
    "minecraft:pumpkin_seeds": 1.6,
    "minecraft:melon_seeds": 1.6,
    "minecraft:beetroot_seeds": 1.4,
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
    ["i", ItemID.electricalSteel, 0, "c", 380, 0, "r", BlockID.eioTank, 0, "f", VanillaBlockID.furnace, 0, "m", BlockID.machineChassis, 0, "g", ItemID.darkSteel, 0],
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

      let result = VatRecipe.getResult(VatRecipe.getInput(this.container), this.inputTank);
      if (result) {
        let time = result.energy;
        let outputID = result.liquidOut;
        let outputAmount = result.amount;
        this.processTime = time;
        if (
          (this.outputTank.getLiquidStored() == outputID && this.outputTank.getAmount(outputID) <= this.outputTank.getLimit() - outputAmount) ||
          !this.outputTank.getLiquidStored()
        ) {
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
