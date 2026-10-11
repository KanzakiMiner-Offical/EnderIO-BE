/// <reference path="IWrench.ts" />
namespace Machine {
  export let { ClientSide, NetworkEvent, ContainerEvent } = BlockEngine.Decorators;

  export abstract class MachineBase extends TileEntityBase implements IWrench {
    capacitor?: string[];
    data: this["defaultValues"];

    onInit(): void {
      // this.networkData.putInt("blockId", this.blockID);
      // this.networkData.putInt("facing", this.getFacing());
      // this.networkData.sendChanges();
      this.setupContainer();
      delete this.liquidStorage;
    }

    setupContainer(): void {}

    addLiquidTank(name: string, limit: number, liquids?: string[]) {
      return new BlockEngine.LiquidTank(this, name, limit, liquids);
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
      }
      return false;
    }

    setActive(isActive: boolean): void {
      if (this.networkData.getBoolean("active") !== isActive) {
        this.networkData.putBoolean("active", isActive);
        this.networkData.sendChanges();
      }
    }

    getFacing(): number {
      return this.blockSource.getBlockData(this.x, this.y, this.z);
    }

    setFacing(side: number): boolean {
      if (this.getFacing() != side) {
        this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, side);
        return true;
      }
      return false;
    }

    decreaseSlot(slot: ItemContainerSlot, count: number): void {
      slot.count -= count;
      slot.markDirty();
      slot.validate();
    }
  }
}
