namespace Machine {
  export abstract class Generator extends ProgressingMachine {
    energyStorage: number;
    bonus: number;

    initCapacitor(): void {}

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        return false;
      });
    }
    isGenerator(): boolean {
      return true;
    }
    canReceiveEnergy(): boolean {
      return false;
    }

    canEmitEnergy(): boolean {
      return true;
    }
    /** @deprecated
     * not use if you define generator
     * use @getMaxOutput instead
     */
    getMaxIntake(): number {
      return 0;
    }
    getMaxOutput(): number {
      return this.getMaxIntake() > 0 ? this.getMaxIntake() : 0;
    }
    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, this.getMaxOutput());
      this.data.energy += src.add(output) - output;
    }

    getEnergyStorage(): number {
      return this.energyStorage;
    }

    canRotate(side: number): boolean {
      return side > 1;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage() || 0;
    }
  }
}
