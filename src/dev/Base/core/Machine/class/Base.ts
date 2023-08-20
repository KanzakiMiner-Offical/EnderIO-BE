/// <reference path="IWrench.ts" />
namespace Machine {
  export let { ClientSide, NetworkEvent, ContainerEvent } = BlockEngine.Decorators;

  export abstract class MachineBase
  extends TileEntityBase
  implements IWrench {
    capacitor ? : string[];
    defaultDrop ? : number;

    onInit(): void {
      this.networkData.putInt("blockId", this.blockID);
      this.networkData.putInt("facing", this.getFacing());
      this.networkData.sendChanges();
      this.setupContainer();
      delete this.liquidStorage;
    }

    setupContainer(): void {}

    addLiquidTank(name: string, limit: number, liquids ? : string[]) {
      let tank = new BlockEngine.LiquidTank(this, name, limit, liquids);
      let liquid = this.liquidStorage.getLiquidStored();
      if (liquid) {
        let amount = this.liquidStorage.getLiquid(liquid, tank.getLimit() / 1000);
        tank.addLiquid(liquid, Math.round(amount * 1000));
      }
      return tank;
    }

    canRotate(side: number): boolean {
      return false;
    }

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
      let side = coords.side;
      if (Entity.getSneaking(player)) {
        side ^= 1;
      }
      if (this.canRotate(side) && EnderTool.isUseableWrench(item, 1)) {
        EnderTool.rotateMachine(this, side, item, player);
        return true;
      }/*
      if (Entity.getSneaking(player) && item.id == ItemID.itemYetaWrench) {
        let extra;
        let liquid = this.liquidTank.getLiquidStored()
        if (liquid) {
          extra = new ItemExtraData();
          extra.putString("fluid", liquid);
          extra.putInt("amount", this.liquidTank.getAmount(liquid));
        }
        this.blockSource.spawnDroppedItem(this.x + .5, this.y + .5, this.z + .5, BlockID.eioTank, 1, 0);
        this.blockSource.destroyBlock(this.x, this.y, this.z, false);
      }*/
      return false;
    }

    setActive(isActive: boolean): void {
      if (this.networkData.getBoolean("active") !== isActive) {
        this.networkData.putBoolean("active", isActive);
        this.networkData.sendChanges();
      }
    }

    @ClientSide
    renderModel(): void {
      if (this.networkData.getBoolean("active")) {
        let blockId = Network.serverToLocalId(this.networkData.getInt("blockId"));
        let facing = this.networkData.getInt("facing");
        TileRenderer.mapAtCoords(this.x, this.y, this.z, blockId, facing);
      } else {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
      }
    }

    clientLoad(): void {
      this.renderModel();
      this.networkData.addOnDataChangedListener((data, isExternal) => {
        this.renderModel();
      });
    }

    clientUnload(): void {
      BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }

    getFacing(): number {
      return this.blockSource.getBlockData(this.x, this.y, this.z);
    }

    setFacing(side: number): boolean {
      if (this.getFacing() != side) {
        this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
        this.networkData.putInt("blockData", side);
        this.networkData.sendChanges();
        return true;
      }
      return false;
    }

    decreaseSlot(slot: ItemContainerSlot, count: number): void {
      slot.count -= count;
      slot.markDirty();
      slot.validate();
    }

    getDefaultDrop(): number {
      return this.defaultDrop ?? this.blockID;
    }

    adjustDrop(item: ItemInstance): ItemInstance {
      return item;
    }

  }
}