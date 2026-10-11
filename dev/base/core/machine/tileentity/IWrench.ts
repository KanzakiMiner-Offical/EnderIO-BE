namespace Machine {
  export interface IWrench extends TileEntity {
    canRotate(side: number): boolean;
    getFacing(): number;
    setFacing(side: number): void;
  }
}
