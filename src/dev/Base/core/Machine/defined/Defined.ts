/// <reference path="../../Machine/class/Base.ts" />
/// <reference path="../../Machine/class/ProgressingMachine.ts" />
/// <reference path="../../Machine/class/Generator.ts" />
let RF = EnergyTypeRegistry.assureEnergyType("Rf", 0.25);
let EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);
let RF_type2 = EnergyTypeRegistry.assureEnergyType("RF", 0.25);

namespace MachineRegistry {
  const machineIDs = {}

  export function isMachine(id: number): boolean {
    return !!machineIDs[id];
  }

  export function registerPrototype(id: number, Prototype: TileEntity.TileEntityPrototype) {
    // setup legacy prototypes
    if (!(Prototype instanceof Machine.MachineBase)) {
      const BasePrototype = Machine.MachineBase.prototype;
      Prototype.id = id;
      Prototype.getDefaultDrop ??= BasePrototype.getDefaultDrop;
      Prototype.adjustDrop ??= BasePrototype.adjustDrop;
      Prototype.setActive ??= function (isActive: boolean) {
        if (this.data.isActive != isActive) {
          this.data.isActive = isActive;
          TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (isActive ? 4 : 0));
        }
      }
      Prototype.activate ??= function () {
        this.setActive(true);
      }
      Prototype.deactivate ??= function () {
        this.setActive(false);
      }
    }

    // register prototype
    machineIDs[id] = true;
    TileEntity.registerPrototype(id, Prototype);
    setMachineDrop(id, Prototype.defaultDrop);

    if (Prototype instanceof Machine.ProgressingMachine) {
      // wire connection
      ICRender.getGroup("ic-wire").add(id, -1);
      // register for energy net
      EnergyTileRegistry.addEnergyTypeForId(id, RF);
      EnergyTileRegistry.addEnergyTypeForId(id, EU);
      EnergyTileRegistry.addEnergyTypeForId(id, RF_type2);
    }
  }

  export function createStorageInterface(blockID: number, descriptor: StorageDescriptor) {
    descriptor.liquidUnitRatio = 0.001;
    descriptor.getInputTank ??= function () {
      return this.tileEntity.liquidTank;
    }
    descriptor.getOutputTank ??= function () {
      return this.tileEntity.liquidTank;
    }
    descriptor.canReceiveLiquid ??= function (liquid: string) {
      return this.getInputTank().isValidLiquid(liquid);
    }
    descriptor.canTransportLiquid ??= () => true;
    StorageInterface.createInterface(blockID, descriptor);
  }

  /**
   * For Energy Storage
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
    });
  }

  /**
   * For Liquid Storage
   */
  export function setTankPlaceFunction(blockID: string | number, hasVerticalRotation?: boolean) {
    Block.registerPlaceFunction(blockID, function (coords, item, block, player, blockSource) {
      const region = new WorldRegion(blockSource);
      const place = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
      const rotation = TileRenderer.getBlockRotation(player, hasVerticalRotation);
      region.setBlock(place, item.id, rotation);
      const tile = region.addTileEntity(place);
      if (item.extra) {
        let name_fluid = item.extra.getString("fluid")
        let amount_fluid = item.extra.getInt("amount")
        if (amount_fluid > 0) {
          tile.liquidStorage.addLiquid(name_fluid, amount_fluid / 1000);
        }
      }
    });
  }

  export function addTankTooltip(id: string | number) {
    Item.registerNameOverrideFunction(id, (item: ItemInstance, name: string): string => {
      if (item.extra) {
        let name_fluid = item.extra.getString("fluid")
        let amount_fluid = item.extra.getInt("amount")
        return name + "\n§7" + Translation.translate("Liquid: ") + name_fluid + "\n§7" + Translation.translate("Amount: ") + "§a" + amount_fluid + " mB";
      }
    });
  }

  /**@deprecated */
  export function getMachineDrop(blockID: number, level: number): ItemInstanceArray[] {
    const drop = [];
    if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
      const dropID = TileEntity.getPrototype(blockID).getDefaultDrop();
      drop.push([dropID, 1, 0]);
    }
    return drop;
  }

  export function setMachineDrop(blockID: string | number, dropID?: number) {
    dropID ??= Block.getNumericId(blockID);
    BlockRegistry.registerDrop(blockID, function (coords, blockID, blockData, level) {
      const drop = [];
      if (level >= ToolAPI.getBlockDestroyLevel(blockID)) {
        drop.push([dropID, 1, 0]);
      }
      return drop;
    });
  }

  export function fillTankOnClick(tank: BlockEngine.LiquidTank, item: ItemInstance, playerUid: number): boolean {
    const liquid = tank.getLiquidStored();
    const empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
    if (empty && (!liquid && tank.isValidLiquid(empty.liquid) || empty.liquid == liquid) && !tank.isFull()) {
      const player = new PlayerEntity(playerUid);
      const liquidLimit = tank.getLimit();
      const storedAmount = tank.getAmount(liquid);
      const count = Math.min(item.count, Math.floor((liquidLimit - storedAmount) / empty.amount));
      if (count > 0) {
        tank.addLiquid(empty.liquid, empty.amount * count);
        player.addItemToInventory(new ItemStack(empty.id, count, empty.data));
        item.count -= count;
        player.setCarriedItem(item);
      }
      else if (item.count == 1 && empty.storage) {
        const amount = Math.min(liquidLimit - storedAmount, empty.amount);
        tank.addLiquid(empty.liquid, amount);
        item.data += amount;
        player.setCarriedItem(item);
      }
      return true;
    }
    return false;
  }

  /** @deprecated */
  export function isValidRFItem(id: number, count: number, data: number, container: UI.Container): boolean {
    const level = container.tileEntity.getTier();
    return ChargeItemRegistry.isValidItem(id, "Rf", level);
  }

  /** @deprecated */
  export function isValidRFStorage(id: number, count: number, data: number, container: UI.Container): boolean {
    const level = container.tileEntity.getTier();
    return ChargeItemRegistry.isValidStorage(id, "Rf", level);
  }

  export function updateGuiHeader(gui: any, text: string): void {
    const header = gui.getWindow("header");
    header.contentProvider.drawing[2].text = Translation.translate(text);
  }

  export function createInventoryWindow(header: string, uiDescriptor: { drawing?: UI.DrawingSet, elements: UI.ElementSet }) {
    const gui = new UI.StandardWindow({
      standard: {
        header: { text: { text: Translation.translate(header) } },
        inventory: { standard: true },
        background: { standard: true }
      },

      drawing: uiDescriptor.drawing || [],
      elements: uiDescriptor.elements
    });

    Callback.addCallback("LevelLoaded", function () {
      MachineRegistry.updateGuiHeader(gui, header);
    });

    return gui;
  }
}

BlockRegistry.createBlockType("machine", {
  extends: "stone",
  destroyTime: 3
});

BlockRegistry.createBlockType("other-machine", {
  extends: "machine",
  solid: false
});