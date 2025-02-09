namespace Machine {
  export abstract class Generator extends ProgressingMachine {
    defaultBonus?: number;
    defaultEnergyStorage?: number;

    tier = 1;
    energyStorage: number;
    bonus: number;

    initCapacitor(): void {}

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
        return false;
      });
    }

    canReceiveEnergy(): boolean {
      return false;
    }

    canExtractEnergy(): boolean {
      return true;
    }

    energyTick(type: string, src: EnergyTileNode): void {
      let output = Math.min(this.data.energy, this.getMaxIntake());
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
