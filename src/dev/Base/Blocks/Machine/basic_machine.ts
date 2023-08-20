namespace Machine {
  export abstract class BasicMachine
  extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0
    }

    defaultTier = 2;
    defaultEnergyStorage = 100000;
    defaultEnergyConsume ? : number;

    tier: 2;
    energyStorage: number;
    energyConsume ? : number;
    processTime: number;

    getTier(): number {
      return this.tier;
    }

    getEnergyStorage(): number {
      return this.energyStorage;
    }

    setupContainer(): void {
      StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
        if (name.startsWith("slotCapacitor")) return CapacitorAPI.isValidCapacitor(id, this);
        return false;
      });
    }


    useCapacitor(): CapacitorAPI.CapacitorSet {
      let upgrades = CapacitorAPI.useCapacitor(this);
      this.energyConsume = upgrades.getEnergyConsume(this.defaultEnergyConsume);
      this.energyStorage = upgrades.getEnergyStorage(this.defaultEnergyStorage);
      return upgrades;
    }
    
    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }

    canRotate(side: number): boolean {
      return side > 1;
    }
  }
}