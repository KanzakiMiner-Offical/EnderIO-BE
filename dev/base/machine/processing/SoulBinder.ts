BlockRegistry.createBlock(
  "soulBinder",
  [
    {
      name: "tile.block_soul_binder.name",
      texture: [
        ["blockSoulMachineBottom", 0],
        ["blockSoulMachineTop", 0],
        ["blockSoulBinder", 0],
        ["blockSoulBinder", 1],
        ["blockSoulBinder", 2],
        ["blockSoulBinder", 3],
      ],
      inCreative: true,
    },
  ],
  "machine",
);

TileRenderer.setHandAndUiModel(BlockID.soulBinder, 0, [
  ["blockSoulMachineBottom", 0],
  ["blockSoulMachineTop", 0],
  ["blockSoulBinder", 0],
  ["blockSoulBinder", 1],
  ["blockSoulBinder", 2],
  ["blockSoulBinder", 3],
]);
TileRenderer.setStandardModelWithRotation(BlockID.soulBinder, 2, [
  ["blockSoulMachineBottom", 0],
  ["blockSoulMachineTop", 0],
  ["blockSoulBinder", 0],
  ["blockSoulBinder", 1],
  ["blockSoulBinder", 2],
  ["blockSoulBinder", 3],
]);
TileRenderer.registerModelWithRotation(BlockID.soulBinder, 2, [
  ["blockSoulMachineBottom", 0],
  ["blockSoulMachineTop", 0],
  ["blockSoulBinder", 0],
  ["blockSoulBinder", 1],
  ["blockSoulBinder", 2],
  ["blockSoulBinder", 3],
]);

TileRenderer.setRotationFunction(BlockID.soulBinder);

let soulBinderGUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_soul_binder.name"), {
  drawing: [
    { type: "bitmap", x: 180, y: 74, bitmap: "redflux_bar0", scale: 4 },
    { type: "bitmap", x: 459, y: 190, bitmap: "bar_progress0", scale: 5 },
  ],
  elements: {
    textInstall: { type: "text", x: 325, y: 50, text: "", font: { color: Color.YELLOW, size: 30 } },
    energyScale: {
      type: "scale",
      x: 180,
      y: 74,
      bitmap: "redflux_bar1",
      direction: 1,
      scale: 4,
    },
    progressScale: {
      type: "scale",
      x: 465,
      y: 112,
      clicker: {
        onClick: function () {
          RV?.RecipeTypeRegistry.openRecipePage("ender_soulbinder");
        },
      },
      bitmap: "bar_progress2",
      scale: 5,
    },
    slotInput0: { type: "slot", x: 267, y: 185, size: 90 },
    slotInput1: { type: "slot", x: 357, y: 185, size: 90 },
    slotOutput0: { type: "slot", x: 604, y: 185, size: 90 },
    slotOutput1: { type: "slot", x: 694, y: 185, size: 90 },
    slotCapacitor: { type: "slot", x: 159, y: 287, size: 90, bitmap: "slot_capacitor", maxStackSize: 1 },
    // xp
    "xp-1": {
      type: "button",
      x: 293,
      y: 298,
      clicker: {
        onClick: function (_, container: ItemContainer) {
          container.sendEvent("addXP", {});
        },
      },
      bitmap: "RS_empty_button",
      bitmap2: "classic_button_down",
      scale: 3.2,
    },
    "xp-1_image": { type: "image", x: 293, y: 298, z: 10, bitmap: "ExperienceObelisk-1", scale: 3.2 },
    xp: { type: "text", x: 423, y: 308, z: 10, text: "0", font: { color: Color.GREEN, size: 40, shadow: 0.5 } },
  },
});
Callback.addCallback("PreLoaded", function () {
  RecipeRegistry.addSBinder({
    soul: "minecraft:enderman",
    lvl: 8,
    ingredient: { id: ItemID.vibrantCrystal, data: 0, count: 1 },
    result0: { id: ItemID.enderCrystal, data: 0, count: 1 },
    //result1 : { id: number, data: number, count: number },
    energy: 150000,
  });
});

namespace Machine {
  export class SoulBinder extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };
    liquidTank: BlockEngine.LiquidTank;

    capacitors = ["capacitor"];
    acceptType = ["tight", "buffer", "intake"];

    initCapacitor(): void {
      const capacitors = CapacitorData.useCapacitor(this);
      this.energyConsume = capacitors.getValue(CapacitorKey.SOUL_BINDER_USE);
      this.maxIntake = capacitors.getValue(CapacitorKey.SOUL_BINDER_INTAKE);
      this.energyStorage = this.updateEnergyStorage(capacitors.getValue(CapacitorKey.SOUL_BINDER_BUFFER));
    }

    setupContainer(): void {
      this.liquidTank = this.addLiquidTank("fluid", 2000000000, ["xpjuice"]);
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        if (name.startsWith("slotInput")) return true;
        return false;
      });
    }

    getScreenByName(): UI.IWindow {
      return soulBinderGUI;
    }

    run(): void {
      let newActive = false;
      let input0 = this.container.getSlot("slotInput0");
      let input1 = this.container.getSlot("slotInput1");
      let output0 = this.container.getSlot("slotOutput0");
      let output1 = this.container.getSlot("slotOutput1");
      let soul_type = SoulRecipe.getTypeSoul(input0);
      if (!!soul_type) {
        let cur_level = ObeliskCore.XPtoLVL(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice"))).lvl;
        let recipe = SoulRecipe.getRecipe(input1, soul_type, cur_level);
        if (recipe) {
          let r_soul = recipe.soul;
          let r_lvl = recipe.lvl;
          let r_ingredient = recipe.ingredient;
          let r_result = recipe.result0;
          let r_energy = recipe.energy;
          if (
            (output0.id == r_result.id && (output0.data == r_result.data || output0.data == -1) && output0.count + r_result.count <= 64) ||
            (!output0.id && ((output1.id == ItemID.soulVesselEmpty && output1.count < 64) || !output1.id))
          ) {
            this.processTime = r_energy;
            if (this.data.energy >= this.energyConsume) {
              newActive = true;
              this.data.progress += this.energyConsume;
              this.data.energy -= this.energyConsume;
            }
            if (this.data.progress >= this.processTime) {
              input0.count--;
              input0.markDirty();
              input1.count--;
              input1.markDirty();
              output0.id = r_result.id;
              output0.data = r_result.data;
              output0.count += r_result.count;
              output0.extra = r_result.extra ? r_result.extra : null;
              output0.markDirty();
              output1.id = ItemID.soulVesselEmpty;
              output1.data = 0;
              output1.count++;
              output1.extra = null;
              output1.markDirty();
              this.liquidTank.getLiquid("xpjuice", ObeliskCore.XPtoLiquid(ObeliskCore.LVLtoXP(r_lvl)));
              this.container.validateAll();
              this.data.progress = 0;
            }
          }
        } else {
          this.data.progress = 0;
        }
      }
      this.setActive(newActive);
    }

    onTick(): void {
      this.initCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorData.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }

      let xp_data = ObeliskCore.XPtoLVL(ObeliskCore.LiquidtoXP(this.liquidTank.getAmount("xpjuice")));
      this.container.setText("xp", "LV:" + xp_data.lvl + " |Remain XP: " + xp_data.rem);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.sendChanges();
    }

    @ContainerEvent(Side.Server)
    addXP(eventData, connectedClient: NetworkClient): void {
      let player = new PlayerActor(connectedClient.getPlayerUid());
      let player_lvl = player.getLevel();
      if (player_lvl == 0) return;
      let player_xp = player.getExperience();
      let xp = player_xp - ObeliskCore.LVLtoXP(player_lvl - 1);
      ObeliskCore.setPlayerXp(player, player_xp - xp);
      this.liquidTank.addLiquid("xpjuice", ObeliskCore.XPtoLiquid(xp));
    }
  }

  MachineRegistry.registerPrototype(BlockID.soulBinder, new SoulBinder());
}
