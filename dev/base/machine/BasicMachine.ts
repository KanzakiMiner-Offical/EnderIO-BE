namespace Machine {
  export abstract class BasicMachine extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };

    energyStorage: number;
    maxIntake: number;
    energyConsume?: number;
    processTime: number;

    initCapacitor(): void {}

    getEnergyStorage(): number {
      return this.energyStorage || 0;
    }

    getMaxIntake(): number {
      return this.maxIntake || 0;
    }

    // setupContainer(): void {
    // StorageInterface.setGlobalValidatePolicy(this.container, (name, id, amount, data) => {
    //   // if (name.startsWith("slotCapacitor")) return CapacitorData.isValidCapacitor(id, this);
    //   return false;
    // });
    // }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage() || 0;
    }

    canRotate(side: number): boolean {
      return side > 1;
    }

    energyReceive(type: string, amount: number, power: number): number {
      let maxIntake = this.getMaxIntake();
      amount = Math.min(maxIntake, amount); // amount dont allow to pass max intake
      let add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
      this.data.energy += add;
      return add;
    }
  }
}
