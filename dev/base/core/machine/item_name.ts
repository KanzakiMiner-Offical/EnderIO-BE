namespace ItemName {
  export function addTooltip(id: number, tooltip: string): void {
    Item.registerNameOverrideFunction(id, function (item: ItemInstance, name: string) {
      return ItemRegistry.getItemRarityColor(item.id) + name + "\n§7" + tooltip;
    });
  }

  export function addStorageBlockTooltip(blockID: string | number, tier: number, capacity: string): void {
    Item.registerNameOverrideFunction(Block.getNumericId(blockID), function (item: ItemInstance, name: string) {
      const color = ItemRegistry.getItemRarityColor(item.id);
      return color + name + "\n§7" + getBlockStorageText(item, tier, capacity);
    });
  }

  export function getBlockStorageText(item: ItemInstance, tier: number, capacity: string): string {
    const energy = item.extra ? item.extra.getInt("energy") : 0;
    return `${displayEnergy(energy)}/${capacity} RF`;
  }

  export function getItemStorageText(item: ItemInstance): string {
    const energy = ChargeItemRegistry.getEnergyStored(item);
    const capacity = ChargeItemRegistry.getMaxCharge(item.id);
    return `${displayEnergy(energy)}/${displayEnergy(capacity)} RF`;
  }

  export function displayEnergy(energy: number, debug: boolean = Game.isDeveloperMode): string {
    if (!debug) {
      if (energy >= 1e9) {
        return Math.floor(energy / 1e8) / 10 + "B";
      }
      if (energy >= 1e6) {
        return Math.floor(energy / 1e5) / 10 + "M";
      }
      if (energy >= 1000) {
        return Math.floor(energy / 100) / 10 + "K";
      }
    }
    return energy.toString();
  }
}
