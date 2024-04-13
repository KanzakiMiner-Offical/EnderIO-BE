// @ts-nocheck
BlockRegistry.createBlock("crafter", [
  {
    name: "tile.block_crafter.name",
    texture: [
      ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["block_crafter_solid", 0], ["machineSide", 0], ["machineSide", 0]],
    inCreative: true
  }
], "machine");

Callback.addCallback("PreLoaded", function () {
  Recipes.addShaped({ id: BlockID.crafter, count: 1, data: 0 }, [
    "iai",
    "imi",
    "ici"
  ], ['i', VanillaItemID.iron_ingot, 0, "m", BlockID.machineChassi, 0, "c", ItemID.skullZombieController, 0, "a", VanillaBlockID.crafting_table, 0]);
});

let craftUI = MachineRegistry.createInventoryWindow(Translation.translate("tile.block_crafter.name"), {
  drawing: [
    { type: "bitmap", x: 370, y: 60, bitmap: "redflux_bar0", scale: 3.2 },
  ],

  elements: {

    "textInstall": { type: "text", font: { size: 20, color: Color.YELLOW }, x: 325, y: 50, width: 100, height: 30, text: "" },
    "energyScale": { type: "scale", x: 370, y: 60, direction: 1, bitmap: "redflux_bar1", scale: 3.2 },
    // Capacitor
    "slotCapacitor": { type: "slot", x: 370, y: 230, size: 60 },
    // Input

    "slot0": { type: "slot", x: 470, y: 110, size: 60 },
    "slot1": { type: "slot", x: 530, y: 110, size: 60 },
    "slot2": { type: "slot", x: 590, y: 110, size: 60 },

    "slot3": { type: "slot", x: 470, y: 170, size: 60 },
    "slot4": { type: "slot", x: 530, y: 170, size: 60 },
    "slot5": { type: "slot", x: 590, y: 170, size: 60 },

    "slot6": { type: "slot", x: 470, y: 230, size: 60 },
    "slot7": { type: "slot", x: 530, y: 230, size: 60 },
    "slot8": { type: "slot", x: 590, y: 230, size: 60 },

    "slotInput": {
      type: "slot",
      x: 660,
      y: 170,
      size: 60,

      clicker: {
        onClick: function (position, container, tileEntity) {
          return;
        },
        onLongClick: function (position, container, tileEntity) {
          this.onClick(position, container, tileEntity);
        }
      }
    },
    /*
    "iconResult": {
      type: "button",
      x: 575,
      y: 207,
       
      scale: 3.2,
      clicker: {
        onClick: function(_, container: ItemContainer) {}
      }
    },
    "textResult": { type: "text", font: { size: 20, color: Color.YELLOW }, x: 570, y: 214, width: 100, height: 30, text: "" },
*/
    // Output
    "slotI1": { type: "slot", x: 730, y: 110, size: 60 },
    "slotI2": { type: "slot", x: 790, y: 110, size: 60 },
    "slotI3": { type: "slot", x: 850, y: 110, size: 60 },
    "slotI4": { type: "slot", x: 730, y: 170, size: 60 },
    "slotI5": { type: "slot", x: 790, y: 170, size: 60 },
    "slotI6": { type: "slot", x: 850, y: 170, size: 60 },
    "slotI7": { type: "slot", x: 730, y: 230, size: 60 },
    "slotI8": { type: "slot", x: 790, y: 230, size: 60 },
    "slotI9": { type: "slot", x: 850, y: 230, size: 60 },

    "slotResult": { type: "slot", x: 920, y: 170, size: 60 },
  }
})



namespace Machine {
  export class Crafter extends BasicMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    }

    defaultEnergyConsume = 125;
    upgrades: ["capacitor"];
    processTime: 2500;

    getScreenByName(): UI.IWindow {
      return craftUI;
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorAPI.isValidCapacitor(id, this)
        if (name.startsWith("slot")) return true
        return false
      })
    }

    isProgress(res, slot) {
      return this.data.progress <= 2500 && res && this.data.energy >= this.energyConsume && ((slot.id == res.id && slot.data == res.data && slot.count + res.count <= Item.getMaxStack(res.id)) || slot.count <= 0) && this.isInventoryInRecipe();
    }
    getPattern() {
      let obj = {};
      for (let i = 0; i < 9; i++) {
        let item = this.container.getSlot("slot" + i);
        if (item.id != 0)
          obj[item.id + ":" + item.data] = (obj[item.id + ":" + item.data] || 0) + 1;
      }
      return obj;
    }
    getInventory() {
      let obj = {};
      for (let i = 1; i <= 9; i++) {
        let item = this.container.getSlot("slotI" + i);
        if (item.id != 0)
          obj[item.id + ":" + item.data] = (obj[item.id + ":" + item.data] || 0) + item.count;
      }
      return obj;
    }
    isInventoryInRecipe() {
      let recipe = this.getPattern();
      let inventory = this.getInventory();
      let keys = Object.keys(recipe);
      for (let i in keys) {
        if (!inventory[keys[i]] || recipe[keys[i]] > inventory[keys[i]]) return false;
      }
      return true;
    }
    craft() {
      let recipe = this.getPattern();
      let keys = Object.keys(recipe);
      for (let a in keys) {
        let count = recipe[keys[a]];
        for (let i = 1; i <= 10; i++) {
          let item = this.container.getSlot("slotI" + i);
          let keys__ = keys[a].split(":")
          if (count <= 0 || (item.id != parseInt(keys__[0]) && item.data != parseInt(keys__[1])))
            continue;
          item.count -= count;
          count = 0;
          if (item.count < 0)
            count -= item.count;
          this.container.setSlot("slotI" + i, item.id, item.count, item.data, item.extra);
        }
      }
    }
    run(): void {
      let newActive = false;
      this.container.setWorkbenchFieldPrefix("slot");
      let res = Recipes.getRecipeResult(this.container);
      if (res) {
        // this.container.setSlot("slotInput", res.id, res.count, res.data);
        this.container.sendEvent("setIcon", { item: res })
      } else {
        // this.container.setSlot("slotInput", 0, 0, 0);
        this.container.sendEvent("setIcon", { item: null })
      }
      let resultSlot = this.container.getSlot("slotResult");
      if (this.isProgress(res, resultSlot)) {
        this.data.progress += this.energyConsume
        this.data.energy -= this.energyConsume;
        newActive = true;
        if (this.data.progress >= 2500) {
          resultSlot.id = res.id;
          resultSlot.data = res.data;
          resultSlot.count += res.count;
          this.container.setSlot("slotResult", resultSlot.id, resultSlot.count, resultSlot.data);
          this.craft();
          this.data.progress = 0;
          this.container.validateAll();
        }
      } else
        this.data.progress = 0;
      this.setActive(newActive);
    }

    onTick(): void {
      this.useCapacitor();
      StorageInterface.checkHoppers(this);
      let capacitor = this.container.getSlot("slotCapacitor");
      if (CapacitorAPI.isValidCapacitor(capacitor.id, this)) {
        this.container.setText("textInstall", "Installed");
        this.run();
      } else {
        this.container.setText("textInstall", "Please put Capacitor in slot capacitor to install function for machine");
      }
      //this.container.setScale("progressScale", this.data.progress / this.processTime || 0);
      this.container.setScale("energyScale", this.getRelativeEnergy());
      this.container.sendChanges();
    }

    destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
      let region = BlockSource.getDefaultForActor(player)
      this.container.clearSlot("slotInput");
      region.spawnDroppedItem(coords.x + .5, coords.y + .5, coords.z + .5, BlockID.crafter, 1, 0);
    }

    @ContainerEvent(Side.Client)
    setIcon(container: ItemContainer, window: any, content: any, data: { item: ItemInstance }): void {
      if (content) {
        let gui = container.getUiAdapter();
        if (gui) {
          gui.setBinding("slotInput", "source", data.item ? { id: data.item.id, count: 1, data: data.item.data } : { id: 0, count: 1, data: 0 })
        }
        // let element = content.elements["iconResult"]
        // let text_e = content.elements["textResult"]
        // if (!!data.item) {
        //   let texture = CraterHelper.getIcon(data.item);
        //   if (element.bitmap != texture) {
        //     element.bitmap = texture
        //     element.visual = true
        //     text_e.text = `${data.item.count}`
        //   }
        // } else {
        //   element.bitmap = "empty"
        //   text_e.text = "0"
        // }
      }
    }

  }

  MachineRegistry.registerPrototype(BlockID.crafter, new Crafter());
}
StorageInterface.createInterface(BlockID.crafter, {
  slots: {
    "slotI1": { input: true },
    "slotI2": { input: true },
    "slotI3": { input: true },
    "slotI4": { input: true },
    "slotI5": { input: true },
    "slotI6": { input: true },
    "slotI7": { input: true },
    "slotI8": { input: true },
    "slotI9": { input: true },
    "slotResult": { output: true }
  }
});