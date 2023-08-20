BlockRegistry.createBlock("stirlingGen", [
  {
    name: "tile.block_stirling_generator.name",
    texture: [
	["machineBottom", 0], ["machineTop", 0], ["machineSide", 0],
	["stirlingGenFront", 0], ["machineSide", 0], ["machineSide", 0]],
    inCreative: true
  }
], "machine")

TileRenderer.setStandardModelWithRotation(BlockID.stirlingGen, 2, [["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["stirlingGenFront", 0], ["machineSide", 0], ["machineSide", 0]])
TileRenderer.registerModelWithRotation(BlockID.stirlingGen, 2, [["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["stirlingGenFrontOn", 0], ["machineSide", 0], ["machineSide", 0]])

TileRenderer.setRotationFunction(BlockID.stirlingGen)

Callback.addCallback("PreLoaded", function() {
  Recipes.addShaped({ id: BlockID.stirlingGen, count: 1, data: 0 },
    ["   ",
     "sfs",
     "gpg"],
    ['s', ItemID.darkSteel, 0, 'f', BlockID.machineChassi, 0, 'g', ItemID.darkSteelGear, 0, "p", BlockID.simpleStirlingGen, 0])

})

let stirlingGenGUI = MachineRegistry.createInventoryWindow("tile.block_stirling_generator.name", {
  drawing: [
    { type: "bitmap", x: 450, y: 135, bitmap: "fire_scale0", scale: 3.2 },
    { type: "bitmap", x: 335, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
	],

  elements: {
    "energyScale": { type: "scale", x: 335, y: 140, direction: 1, value: 0.5, bitmap: "redflux_bar1", scale: 3.2 },
    "textInstall": { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 50, height: 30, text: "" },
    "burningScale": {
      type: "scale",
      x: 450,
      y: 135,
      direction: 1,
      bitmap: "fire_scale1",
      scale: 3.2
    },
    "slotFuel": { type: "slot", x: 441, y: 160 },
    //"text": { type: "text", x: 400, y: 100, width: 100, height: 30, text: "RF" },
    "slotCapacitor": { type: "slot", x: 325, y: 320 }
  }
})

namespace Machine {
  export class StirlingGenerator extends Generator {
    defaultValues = {
      energy: 0,
      burn: 0,
      burnMax: 0
    }

    defaultBonus = 1
    defaultEnergyStorage = 100000

    upgrades: ["capacitor"]

    getScreenByName(): UI.IWindow {
      return stirlingGenGUI
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return !!CapacitorAPI.isValidCapacitor(id, this)
        return false
      })
      StorageInterface.setSlotValidatePolicy(this.container, "slotFuel", (name, id, count, data) => {
        return Recipes.getFuelBurnDuration(id, data) > 0
      })
    }

    consumeFuel(slotName: string): number {
      let fuelSlot = this.container.getSlot(slotName)
      if (fuelSlot.id > 0) {
        let burn = Recipes.getFuelBurnDuration(fuelSlot.id, fuelSlot.data)
        if (burn && !LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data)) {
          this.decreaseSlot(fuelSlot, 1)
          return burn
        }
      }
      return 0
    }

    run(): void {
      let newActive = false
      let energyStorage = this.getEnergyStorage()
      if (this.data.energy + 60 <= energyStorage) {
        if (this.data.burn <= 0) {
          this.data.burn = this.data.burnMax = this.consumeFuel("slotFuel") / 4
        }
        if (this.data.burn > 0) {
          this.data.energy = Math.min(this.data.energy + 60, energyStorage)
          this.data.burn--
          newActive = true
        }
      }
      this.setActive(newActive)
    }

    onTick(): void {
      this.useCapacitor();
      StorageInterface.checkHoppers(this)

      let capacitor = this.container.getSlot("slotCapacitor")
      if (!!CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed")
        this.run()
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine")
      }

      this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0)
      this.container.setScale("energyScale", this.getRelativeEnergy())
      //this.container.setText("text", "RF: " + this.data.energy + "/" + this.getEnergyStorage() + ". Produce " + this.bonus * 60 + " RF/t")
      this.container.sendChanges()
    }
    
    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, 60);
      this.data.energy += src.add(output) - output;
    }

    canRotate(side: number): boolean {
      return side > 1
    }
  }

  MachineRegistry.registerPrototype(BlockID.stirlingGen, new StirlingGenerator())

  StorageInterface.createInterface(BlockID.stirlingGen, {
    slots: {
      "slotFuel": { input: true }
    },
    isValidInput: (item: ItemInstance) => Recipes.getFuelBurnDuration(item.id, item.data) > 0
  })
}