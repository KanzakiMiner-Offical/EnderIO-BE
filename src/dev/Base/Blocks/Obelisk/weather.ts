BlockRegistry.createBlock("weather_obelisk", [
  {
    name: "tile.block_weather_obelisk.name",
    texture: [["weather_obelisk", 0]],
    inCreative: true
  }
], "machine")

Block.setShape(BlockID.weather_obelisk, 1 / 16, 0, 1 / 16, 15 / 16, 0.5, 15 / 16)
Block.setDestroyTime(BlockID.weather_obelisk, 5)
ToolAPI.registerBlockMaterial(BlockID.weather_obelisk, "stone")

ObeliskCore.registerModel("weather_obelisk", "experience_obelisk");

let weatherObeliskGUI = MachineRegistry.createInventoryWindow("Weather Obelisk", {
  drawing: [
    { type: "bitmap", x: 360, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    { type: "bitmap", x: 630, y: 230, bitmap: "bar_progress_down0", scale: 3.2 }
  ],
  elements: {
    "energyScale": { type: "scale", x: 360, y: 140, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    "progressScale": { type: "scale", x: 630, y: 230, bitmap: "bar_progress_down1", direction: 3, scale: 3.2 },
    "slot0": { type: "slot", x: 510, y: 140 },
    "slot1": { type: "slot", x: 510, y: 290 },
    "slotInput1": { type: "slot", x: 630, y: 140 },
    "setWeather": {
      type: "button",
      x: 630,
      y: 330,
      scale: 3.0,
      bitmap: "RS_empty_button",
      bitmap2: "RS_empty_button_pressed",
      clicker: {
        onClick: function (_, container: ItemContainer) {
          container.sendEvent("activeObelisk", {})
        }
      }
    },
    "liquidScale": {
      type: "scale",
      x: 430,
      y: 140,
      direction: 1,
      bitmap: "tankOverlay",
      overlay: "tankOverlay",
      scale: 3.2,
      value: 1
    },
  }
});

namespace Machine {
  export class WeatherObelisk extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      activeObelisk: false
    }
    x: number
    y: number
    z: number
    anim: Animation.Item
    liquidTank: BlockEngine.LiquidTank

    tier: 2;
    energyConsume: 50;
    processTime: 5000;

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 6000, ["sunshine", "cloudSeedConcentrated", "cloudSeed"])
    }

    getScreenByName(): UI.IWindow {
      return weatherObeliskGUI
    }

    clientLoad() {
      this.anim = new Animation.Item(this.x + 0.5, this.y + 1, this.z + 0.5)
      this.anim.setSkylightMode()
      this.anim.describeItem({ id: Network.serverToLocalId(VanillaItemID.firework_rocket), count: 1, data: 0 })
      this.anim.loadCustom(function () {
        let transform = this.transform()
        transform && transform.rotate(0, Math.PI / 60, 0)
      })
    }

    clientUnload() {
      this.anim && this.anim.destroy()
    }

    getTier(): number {
      return 2;
    }

    onTick(): void {
      let newActive = false
      let slot0 = this.container.getSlot("slot0");
      let slot1 = this.container.getSlot("slot1");
      let input1 = this.container.getSlot("slotInput1");
      if (this.data.activeObelisk) {
        let weather_type = ObeliskCore.getTypeWeather(this.liquidTank)
        if (input1.id == VanillaItemID.firework_rocket && input1.count >= 1 && (input1.data == 0 || input1.data == -1) && !!weather_type && this.liquidTank.getAmount() >= 1000) {
          if (this.data.energy >= 50) {
            newActive = true;
            this.data.progress += 50;
            this.data.energy -= 50;
          }
          if (this.data.progress >= 5000) {
            input1.count--;
            input1.markDirty();
            World.setWeather(weather_type)
            this.liquidTank.getLiquid(1000)
            this.container.validateAll();
            this.data.progress = 0;
            this.data.activeObelisk = false;
          }
        }
      }
      this.setActive(newActive);
      this.liquidTank.getLiquidFromItem(slot0, slot1);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.setScale("progressScale", this.data.progress / 5000 || 0);
      this.liquidTank.updateUiScale("liquidScale");
      this.container.sendChanges()
    }

    getEnergyStorage(): number {
      return 100000;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      let extra: ItemExtraData
      let region = BlockSource.getDefaultForActor(player)
      let liquid = this.liquidTank.getLiquidStored()
      if (liquid) {
        extra = new ItemExtraData()
        extra.putString("fluid", liquid)
        extra.putInt("amount", this.liquidTank.getAmount(liquid))
      }
      region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.experience_obelisk, 1, 0, extra)
    }

    @ContainerEvent(Side.Server)
    activeObelisk(): void {
      this.data.activeObelisk = this.data.activeObelisk ? false : true;
    }
  }
  MachineRegistry.registerPrototype(BlockID.weather_obelisk, new WeatherObelisk())

  MachineRegistry.setTankPlaceFunction("weather_obelisk");
  StorageInterface.createInterface(BlockID.weather_obelisk, {
    canReceiveLiquid: () => true,
    canTransportLiquid: () => true,
  })
}