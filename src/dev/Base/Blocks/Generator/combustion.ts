BlockRegistry.createBlock("combustionGenerator", [
  {
    name: "tile.block_combustion_generator.name",
    texture: [
      ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0],
      ["combustion_gen_front", 0], ["machineSide", 0], ["machineSide", 0]],
    inCreative: true
  }
], "other-machine");

Block.setBlockShape(BlockID.combustionGenerator, { x: 0.1, y: 0, z: 0 }, { x: 0.95, y: 0.95, z: 0.95 });

ModelHelper.setInventoryModel(new ItemStack(BlockID["combustionGenerator"], 1, 0), "combustion/combustion", "combustion/combustion", {
  translate: [0.25, 0, 0], scale: [1, 1, 1], invertV: false, noRebuild: false
}, [0, 0, 0])
ModelHelper.setHandModel(new ItemStack(BlockID["combustionGenerator"], 1, 0), "combustion/combustion", "combustion/combustion", {
  translate: [0.25, 0, 0], scale: [1, 1, 1], invertV: false, noRebuild: false
})


ModelHelper.registerModelWithRotation(BlockID["combustionGenerator"], "resources/res/models/combustion/combustion")


/*
 * ```js 
 * texture: [
 *   ["название1", индекс1], // bottom (Y: -1)
 *   ["название2", индекс2], // top (Y: +1)
 *   ["название3", индекс3], // back (X: -1) West
 *   ["название4", индекс4], // front (X: +1) East
 *   ["название5", индекс5], // left (Z: -1) North
 *   ["название6", индекс6]  // right (Z: +1) South
 * ]
 * ```
 */



Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id: BlockID.combustionGenerator, count: 1, data: 0 }, [
    "ici",
    "rmr",
    "gfg"
  ], ['i', ItemID.electricalSteel, 0, 'c', ItemID.darkSteel, 0, "r", BlockID.eioTank, 0, 'm', BlockID.machineChassi, 0, "f", VanillaBlockID.piston, 0, "g", ItemID.darkSteelGear, 0
  ]);
});

let combustionGenUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_combustion_generator.name"), {
  drawing: [
    { type: "bitmap", x: 520, y: 230, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 330, y: 110, bitmap: "redflux_bar0", scale: 3.2 },
  ],
  elements: {
    "textInstall": { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 100, height: 30, text: "" },
    "text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    // in
    "slot3": { type: "slot", x: 600, y: 300, bitmap: "slot_fluid_full" },
    "slot1": { type: "slot", x: 430, y: 300, bitmap: "slot_fluid_full" },
    // out
    "slot4": { type: "slot", x: 600, y: 360, bitmap: "slot_fluid_empty" },
    "slot2": { type: "slot", x: 430, y: 360, bitmap: "slot_fluid_empty" },

    // slot capacitor
    "slotCapacitor": { type: "slot", x: 330, y: 290 },

    // scale
    "energyScale": { type: "scale", x: 330, y: 110, direction: 1, bitmap: "redflux_bar1", scale: 3.2, value: 1 },
    "burningScale": { type: "scale", x: 520, y: 230, direction: 1, bitmap: "fire_scale1", scale: 3.2, value: 1 },

    "liquidCool": {
      type: "scale",
      x: 600,
      y: 120,
      direction: 1,
      bitmap: "tankOverlay",
      overlay: "tankOverlay",
      scale: 3.2,
      value: 1
    },
    "liquidHeat": {
      type: "scale",
      x: 430,
      y: 120,
      direction: 1,
      bitmap: "tankOverlay",
      overlay: "tankOverlay",
      scale: 3.2,
      value: 1
    },
  }
});


namespace Machine {
  export class CombustionGenerator extends Generator {

    coolTank: BlockEngine.LiquidTank;
    heatTank: BlockEngine.LiquidTank;

    defaultValues = {
      energy: 0,
      burn_time: 0,
      cool_time: 0
    };

    max_output = 0;
    defaultBonus = 1;
    defaultEnergyStorage = 100000;
    // from original mod
    inPause: boolean;
    generated = 0;
    upgrades: ["capacitor"];

    getScreenByName(): UI.IWindow {
      return combustionGenUI;
    };

    setupContainer(): void {
      this.coolTank = this.addLiquidTank("coolTank", 5000, CombustionFuel.getCoolArray());
      this.heatTank = this.addLiquidTank("heatTank", 5000, CombustionFuel.getHeatArray());
    };

    @ContainerEvent(Side.Server)
    rotateInterface(): void {
      let _interface = StorageInterface.getInterface(this)
      let facing = this.networkData.getInt("facing")
      switch (facing) {
        case 2:
          _interface.getInputTank = function (side: number) {
            if (side == EBlockSide.EAST) return this.tileEntity.coolTank;
            else if (side == EBlockSide.WEST) return this.tileEntity.heatTank;
            return;
          }
          break
        // case 3:
        // case 0:
        case 4:
          _interface.getInputTank = function (side: number) {
            if (side == EBlockSide.SOUTH) return this.tileEntity.coolTank;
            else if (side == EBlockSide.NORTH) return this.tileEntity.heatTank;
            return;
          }
          break
        case 5:
          _interface.getInputTank = function (side: number) {
            if (side == EBlockSide.NORTH) return this.tileEntity.coolTank;
            else if (side == EBlockSide.SOUTH) return this.tileEntity.heatTank;
            return;
          }
          break
        default:
          _interface.getInputTank = function (side: number) {
            if (side == EBlockSide.WEST) return this.tileEntity.coolTank;
            else if (side == EBlockSide.EAST) return this.tileEntity.heatTank;
            return;
          }
          break
      }
    };

    useCapacitor(): CapacitorAPI.CapacitorSet {
      var upgrades = CapacitorAPI.useCapacitor(this);
      this.bonus = upgrades.getBonusGenerator(this.defaultBonus);
      this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
      return upgrades;
    }

    generateEnergy(): boolean {
      this.generated = 0;
      // Check: We have no ticks remaining and cannot refill or We are full?
      if ((this.data.cool_time <= 0 && this.coolTank.isEmpty()) || (this.data.burn_time <= 0 && this.heatTank.isEmpty()) || this.data.energy >= this.getEnergyStorage()) {
        return false;
      }
      let math = new CombustionMath(new CombustionFuel.CoolantImpl(this.coolTank.getLiquidStored()), new CombustionFuel.FuelImpl(this.heatTank.getLiquidStored()), this.bonus, 2)
      if (this.inPause) {
        let powerPerCycle = math.getEnergyPerTick();
        if (this.data.energy >= (this.getEnergyStorage() - (powerPerCycle * 200)) && this.data.energy > (this.getEnergyStorage() / 8)) {
          return false;
        }
      }
      this.inPause = false;
      // Use old ticks
      if (this.data.cool_time > 0 && this.data.burn_time > 0 && math.getEnergyPerTick()) {
        let powerPerCycle = math.getEnergyPerTick();
        this.data.burn_time--;
        this.data.cool_time--;
        this.data.energy += powerPerCycle;
        this.max_output = powerPerCycle;
        return true
      }
      // re-fill
      if (this.data.cool_time <= 0 && math.getTicksPerCoolant(this.coolTank.getLiquid(this.coolTank.getLiquidStored(), 100)) > 0) {
        this.data.cool_time += math.getTicksPerCoolant(this.coolTank.getLiquid(this.coolTank.getLiquidStored(), 100));
      }
      if (this.data.burn_time <= 0 && math.getTicksPerFuel(this.heatTank.getLiquid(this.heatTank.getLiquidStored(), 100)) > 0) {
        this.data.burn_time += math.getTicksPerFuel(this.heatTank.getLiquid(this.heatTank.getLiquidStored(), 100));
      }
      math = new CombustionMath(new CombustionFuel.CoolantImpl(this.coolTank.getLiquidStored()), new CombustionFuel.FuelImpl(this.heatTank.getLiquidStored()), this.bonus, 1)
      // last sanity check, then generate energy
      if (this.data.cool_time > 0 && this.data.burn_time > 0) {
        this.data.burn_time--;
        this.data.cool_time--;
        this.generated = math.getEnergyPerTick();
        this.data.energy += this.generated
        return true;
      }
      return false;
    }

    run(): void {
      let newActive = false;
      newActive = this.generateEnergy();
      if (this.data.energy >= this.getEnergyStorage()) {
        this.inPause = true;
      }
      this.setActive(newActive);
    };

    onTick(): void {
      this.useCapacitor()
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }


      let slot1 = this.container.getSlot("slot1");
      let slot2 = this.container.getSlot("slot2");
      this.heatTank.getLiquidFromItem(slot1, slot2);

      let slot3 = this.container.getSlot("slot3");
      let slot4 = this.container.getSlot("slot4");
      this.coolTank.getLiquidFromItem(slot3, slot4);
      this.heatTank.updateUiScale("liquidHeat");
      this.coolTank.updateUiScale("liquidCool");
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    };

    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, this.max_output);
      this.data.energy += src.add(output) - output;
    };

  };

  MachineRegistry.registerPrototype(BlockID.combustionGenerator, new CombustionGenerator());
  MachineRegistry.createStorageInterface(BlockID.combustionGenerator, {
    slots: {
      "slot1": {
        input: true,
      },
      "slot2": {
        output: true,
        isValid: (item: ItemInstance) => {
          return item.id == VanillaItemID.bucket;
        }
      },
      "slot3": {
        input: true,
        isValid: (item: ItemInstance) => {
          return item.id == VanillaItemID.bucket;
        }
      },
      "slot4": {
        output: true
      },
    },
    canReceiveLiquid: () => true,
    canTransportLiquid: () => true,
    getInputTank: function (side: number) {
      if (side == EBlockSide.WEST) return this.tileEntity.coolTank;
      else if (side == EBlockSide.EAST) return this.tileEntity.heatTank;
      return;
    }
  });
};