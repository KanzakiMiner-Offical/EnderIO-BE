interface ICapacitor {
  type: string;
  getBonusGenerator ? (item: ItemInstance, machine: TileEntity) : number;
  getEnergyConsumeMultiplier ? (item: ItemInstance, machine: TileEntity) : number;
  getExtraEnergyStorage ? (item: ItemInstance, machine: TileEntity) : number;
  getRange ? (item: ItemInstance, machine: TileEntity) : number;
  onTick ? (item: ItemInstance, machine: TileEntity) : void;
}