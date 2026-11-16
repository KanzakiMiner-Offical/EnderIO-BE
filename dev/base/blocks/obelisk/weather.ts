BlockRegistry.createBlock(
  "weather_obelisk",
  [
    {
      name: "tile.block_weather_obelisk.name",
      texture: [["weather_obelisk", 0]],
      inCreative: true,
    },
  ],
  "other-machine",
);

Block.setShape(BlockID.weather_obelisk, 1 / 16, 0, 1 / 16, 15 / 16, 0.5, 15 / 16);
Block.setDestroyTime(BlockID.weather_obelisk, 5);
ToolAPI.registerBlockMaterial(BlockID.weather_obelisk, "stone");

ObeliskCore.registerModel("weather_obelisk", "experience_obelisk");

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped(
    { id: BlockID.weather_obelisk, count: 1, data: 0 },
    [" e ", "cac", "aba"],
    ["a", ItemID.soularium, 0, "e", ItemID.weatherCrystal, 0, "b", BlockID.bankBasic, 0, "c", ItemID.energeticAlloy, 0],
  );
});

let weatherObeliskGUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_weather_obelisk.name"), {
  drawing: [
    { type: "bitmap", x: 360, y: 140, bitmap: "redflux_bar0", scale: 3.2 },
    {
      type: "bitmap",
      x: 630,
      y: 230,
      bitmap: "bar_progress_down0",
      scale: 3.2,
    },
  ],
  elements: {
    energyScale: {
      type: "scale",
      x: 360,
      y: 140,
      direction: 1,
      bitmap: "redflux_bar1",
      scale: 3.2,
    },
    progressScale: {
      type: "scale",
      x: 630,
      y: 230,
      bitmap: "bar_progress_down1",
      direction: 3,
      scale: 3.2,
    },
    slot0: { type: "slot", x: 510, y: 140 },
    slot1: { type: "slot", x: 510, y: 290 },
    slotInput1: { type: "slot", x: 630, y: 140 },
    setWeather: {
      type: "button",
      x: 630,
      y: 330,
      scale: 3.0,
      bitmap: "RS_empty_button",
      bitmap2: "RS_empty_button_pressed",
      clicker: {
        onClick: function (_, container: ItemContainer) {
          container.sendEvent("activeObelisk", {});
        },
      },
    },
    liquidScale: {
      type: "scale",
      x: 430,
      y: 140,
      direction: 1,
      bitmap: "tankOverlay",
      overlay: "tankOverlay",
      scale: 3.2,
      value: 1,
    },
  },
});

namespace Machine {
  export class WeatherObelisk extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
      activeObelisk: false,
    };
    x: number;
    y: number;
    z: number;
    anim: Animation.Item;
    liquidTank: BlockEngine.LiquidTank;

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 6000, ["sunshine", "cloudSeedConcentrated", "cloudSeed"]);

      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data, extra) => {
        if (name == "slot0") return !!LiquidItemRegistry.getItemLiquid(id, data, extra);
        if (name.startsWith("slotInput")) return id == VanillaItemID.firework_rocket;
        return false;
      });
    }

    getScreenByName(): UI.IWindow {
      return weatherObeliskGUI;
    }

    clientLoad() {
      this.anim = new Animation.Item(this.x + 0.5, this.y + 1, this.z + 0.5);
      this.anim.setSkylightMode();
      this.anim.describeItem({
        id: Network.serverToLocalId(VanillaItemID.firework_rocket),
        count: 1,
        data: 0,
      });
      this.anim.loadCustom(function () {
        let transform = this.transform();
        transform && transform.rotate(0, Math.PI / 60, 0);
      });
    }

    clientUnload() {
      this.anim && this.anim.destroy();
    }

    onTick(): void {
      let newActive = false;
      let slot0 = this.container.getSlot("slot0");
      let slot1 = this.container.getSlot("slot1");
      let input1 = this.container.getSlot("slotInput1");
      if (this.data.activeObelisk) {
        let weather_type = ObeliskCore.getTypeWeather(this.liquidTank);
        let cur_weather = World.getWeather();
        if (
          input1.id == VanillaItemID.firework_rocket &&
          input1.count >= 1 &&
          (input1.data == 0 || input1.data == -1) &&
          !!weather_type &&
          this.liquidTank.getAmount() >= 1000 &&
          !(weather_type.rain == cur_weather.rain && weather_type.thunder == cur_weather.thunder)
        ) {
          if (this.data.energy >= 50) {
            newActive = true;
            this.data.progress += 50;
            this.data.energy -= 50;
          }
          if (this.data.progress >= 5000) {
            input1.count--;
            input1.markDirty();
            World.setWeather(weather_type);
            this.liquidTank.getLiquid(1000);
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
      this.container.sendChanges();
    }

    getEnergyStorage(): number {
      return 100000;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }

    energyReceive(type: string, amount: number, power: number): number {
      amount = Math.min(amount, 55);
      let add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
      this.data.energy += add;
      return add;
    }

    @ContainerEvent(Side.Server)
    activeObelisk(): void {
      this.data.activeObelisk = this.data.activeObelisk ? false : true;
    }
  }
  MachineRegistry.registerPrototype(BlockID.weather_obelisk, new WeatherObelisk());

  StorageInterface.createInterface(BlockID.weather_obelisk, {
    slots: {
      slotInput1: {
        input: true,
        isValid: (item, side, tileEntity) => {
          return item.id == VanillaItemID.firework_rocket;
        },
      },
      slot0: {
        input: true,
        isValid: (item, side, tileEntity: WeatherObelisk) => {
          let liquid = LiquidItemRegistry.getItemLiquid(item.id, item.data, item.extra);
          if (tileEntity.liquidTank.getLiquidStored()) return liquid == tileEntity.liquidTank.getLiquidStored();
          else return ["sunshine", "cloudSeedConcentrated", "cloudSeed"].indexOf(liquid) !== -1;
        },
      },
    },
    canReceiveLiquid: (liquid: string, side: number, tileEntity: TileEntity) => {
      return ["sunshine", "cloudSeedConcentrated", "cloudSeed"].indexOf(liquid) !== -1;
    },
    canTransportLiquid: () => true,
  });
}
