/// <reference path="../../machine/tileentity/Base.ts" />
/// <reference path="../../machine/tileentity/ProgressingMachine.ts" />
/// <reference path="../..//machine/tileentity/Generator.ts" />
let microInfinity = EnergyTypeRegistry.assureEnergyType("μI", 0.25);
let RF = EnergyTypeRegistry.assureEnergyType("Rf", 0.25);
let EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
let RF_type2 = EnergyTypeRegistry.assureEnergyType("RF", 0.25);
namespace MachineRegistry {
  const machineIDs = {};

  export function isMachine(id: number): boolean {
    return !!machineIDs[id];
  }

  export function registerPrototype(id: number, Prototype: TileEntity.TileEntityPrototype) {
    // register prototype
    machineIDs[id] = true;
    TileEntity.registerPrototype(id, Prototype);

    if (Prototype instanceof Machine.ProgressingMachine) {
      // wire connection
      ICRender.getGroup("ic-wire").add(id, -1);
      ICRender.getGroup("rf-wire").add(id, -1);
      // register for energy net
      EnergyTileRegistry.addEnergyTypeForId(id, RF);
      // EnergyTileRegistry.addEnergyTypeForId(id, EU);
      EnergyTileRegistry.addEnergyTypeForId(id, RF_type2);

      MachineRegistry.setMachinePlaceFunction(id, true);
      MachineRegistry.addMachineTooltip(id);
    }
  }

  export function createStorageInterface(blockID: number, descriptor: StorageDescriptor) {
    descriptor.liquidUnitRatio = 0.001;
    descriptor.getInputTank ??= function () {
      return this.tileEntity.liquidTank;
    };
    descriptor.getOutputTank ??= function () {
      return this.tileEntity.liquidTank;
    };
    descriptor.canReceiveLiquid ??= function (liquid: string, side: number): boolean {
      return (this.getInputTank(side, this.tileEntity) as BlockEngine.LiquidTank).isValidLiquid(liquid);
    };
    descriptor.canTransportLiquid ??= () => true;
    StorageInterface.createInterface(blockID, descriptor);
  }

  /**
   * @deprecated
   */
  export function setStoragePlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
    Block.registerPlaceFunction(blockID, function (coords, item, block, player, blockSource) {
      const region = new WorldRegion(blockSource);
      const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
      const rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
      region.setBlock(place, item.id, rotation);
      const tile = region.addTileEntity(place);
      if (item.extra) {
        tile.data.energy = item.extra.getInt("energy");
      }
      return place;
    });
  }

  /**
   * @deprecated
   */
  export function setTankPlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
    Block.registerPlaceFunction(blockID, function (coords, item, block, player, blockSource) {
      const region = new WorldRegion(blockSource);
      const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
      const rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
      region.setBlock(place, item.id, rotation);
      const tile = region.addTileEntity(place);
      if (item.extra) {
        let name_fluid = item.extra.getString("fluid");
        let amount_fluid = item.extra.getInt("amount");
        if (amount_fluid > 0) {
          tile.liquidStorage.addLiquid(name_fluid, amount_fluid / 1000);
        }
      }
      return place;
    });
  }

  /**
   * Setup machine that save Energy Storage, Fluid Tank, Container place function
   */
  export function setMachinePlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
    Block.registerPlaceFunction(blockID, function (coords, item, block, player, blockSource) {
      const region = new WorldRegion(blockSource);
      const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
      const rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
      region.setBlock(place, item.id, rotation);
      const tile = region.addTileEntity(place) as Machine.ProgressingMachine;
      if (item.extra) {
        if (item.extra.getInt("energy") != null) tile.data.energy = item.extra.getInt("energy");
        if (item.extra.getSerializable("saved_container") != null) {
          let containerData: { [slots: string]: ItemInstance } = item.extra.getSerializable("saved_container");
          tile.setupContainer();

          for (let name in containerData) {
            let slot = tile.container.getSlot(name);
            let item = containerData[name];
            slot.id = item.id;
            slot.count = item.count;
            slot.data = item.data;
            slot.extra = item.extra;
          }
          tile.container.validateAll();
          tile.container.sendChanges();
        }
        if (item.extra.getSerializable("liquid_tank") != null) {
          let tankData: { [name: string]: { fluid: string; amount: number } } = item.extra.getSerializable("liquid_tank");
          for (const tankName in tankData) {
            const tankValue = tankData[tankName];
            if (!tile[tankName]) tile.setupContainer();

            (tile[tankName] as BlockEngine.LiquidTank).addLiquid(tankValue.fluid, tankValue.amount);
          }
        }
      }
      return place;
    });
  }

  export function addMachineTooltip(id: string | number) {
    Item.registerNameOverrideFunction(id, (item: ItemInstance, name: string): string => {
      if (item.extra) {
        if (item.extra.getInt("energy") != null) name += "\n§7Energy Stored: " + "§e" + item.extra.getInt("energy") + " mB";
        if (item.extra.getSerializable("container") != null) name += "\n§7Container saved";
        if (item.extra.getSerializable("liquid_tank") != null) {
          let tankData: { [name: string]: { fluid: string; amount: number } } = item.extra.getSerializable("liquid_tank");
          for (const tankName in tankData) {
            const tankValue = tankData[tankName];
            name += "\n§7Liquid stored (from " + tankName + "): §a" + tankValue.fluid + "§7 - " + "§a" + tankValue.amount + " mB";
          }
        }
      }
      return name;
    });
  }

  export function emptyTankOnClick(tank: BlockEngine.LiquidTank, item: ItemInstance, playerUid: number): boolean {
    const liquid = tank.getLiquidStored();
    if (!liquid) return false;

    const full = LiquidItemRegistry.getFullStack(item, liquid);
    if (full) {
      const player = new PlayerEntity(playerUid);
      const amount = tank.getAmount(liquid);
      let resultStack: ItemInstance;
      if (amount >= full.amount) {
        tank.getLiquid(amount);
        resultStack = new ItemStack(full.id, 1, full.data, full.extra);
      } else {
        const liquidItem = LiquidItemRegistry.getItemInterface(full.id);
        if (liquidItem) {
          resultStack = new ItemStack(item.id, 1, item.data, item.extra?.copy());
          const addedAmount = liquidItem.addLiquid(resultStack, liquid, amount);
          tank.getLiquid(addedAmount);
        }
      }
      if (resultStack) {
        if (item.count > 1) {
          player.addItemToInventory(resultStack);
          item.count--;
          player.setCarriedItem(item);
        } else {
          player.setCarriedItem(resultStack);
        }
      }
      return true;
    }
    return false;
  }

  export function fillTankOnClick(tank: BlockEngine.LiquidTank, item: ItemInstance, playerUid: number): boolean {
    const liquid = tank.getLiquidStored();
    const empty = LiquidItemRegistry.getEmptyStack(item);
    if (empty && ((!liquid && tank.isValidLiquid(empty.liquid)) || empty.liquid == liquid) && !tank.isFull()) {
      const player = new PlayerEntity(playerUid);
      const freeAmount = tank.getLimit() - tank.getAmount(liquid);
      let resultStack: ItemInstance;
      if (freeAmount > -empty.amount) {
        tank.addLiquid(empty.liquid, empty.amount);
        resultStack = new ItemStack(empty.id, 1, empty.data, empty.extra);
      } else {
        const liquidItem = LiquidItemRegistry.getItemInterface(item.id);
        if (liquidItem) {
          resultStack = new ItemStack(item.id, 1, item.data, item.extra?.copy());
          const extractedAmount = liquidItem.addLiquid(resultStack, liquid, freeAmount);
          tank.getLiquid(extractedAmount);
        }
      }
      if (resultStack) {
        if (item.count > 1) {
          player.addItemToInventory(resultStack);
          item.count--;
          player.setCarriedItem(item);
        } else {
          player.setCarriedItem(resultStack);
        }
      }
      return true;
    }
    return false;
    //   const liquidLimit = tank.getLimit();
    //   const storedAmount = tank.getAmount(liquid);
    //   const count = Math.min(item.count, Math.floor((liquidLimit - storedAmount) / empty.amount));
    //   if (count > 0) {
    //     tank.addLiquid(empty.liquid, empty.amount * count);
    //     player.addItemToInventory(new ItemStack(empty.id, count, empty.data));
    //     item.count -= count;
    //     player.setCarriedItem(item);
    //   } else if (item.count == 1 && empty.storage) {
    //     const amount = Math.min(liquidLimit - storedAmount, empty.amount);
    //     tank.addLiquid(empty.liquid, amount);
    //     item.data += amount;
    //     player.setCarriedItem(item);
    //   }
    //   return true;
    // }
    // return false;
  }

  export function updateGuiHeader(gui: any, text: string): void {
    const header = gui.getWindow("header");
    header.contentProvider.drawing[2].text = Translation.translate(text);
  }

  export function createInventoryWindow(header: string, uiDescriptor: { drawing?: UI.DrawingSet; elements: UI.ElementSet }) {
    const gui = new UI.StandardWindow({
      standard: {
        header: { text: { text: Translation.translate(header) } },
        inventory: { standard: true },
        background: { standard: true },
      },

      drawing: uiDescriptor.drawing || [],
      elements: uiDescriptor.elements,
    });

    Callback.addCallback("LevelLoaded", function () {
      MachineRegistry.updateGuiHeader(gui, header);
    });

    return gui;
  }
}

BlockRegistry.createBlockType("machine", {
  extends: "stone",
  destroyTime: 3,
});

BlockRegistry.createBlockType("other-machine", {
  solid: false,
  explosionResistance: 4,
  renderLayer: 2,
  translucency: 0,
  sound: "stone",
});
