namespace Machine {
  export abstract class SimpleMachine extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0,
    };

    energyStorage: number;
    energyConsume: number;
    maxIntake: number;
    processTime: number;

    lossPower: number;

    constructor(use: CapacitorKey, buffer: CapacitorKey, intake: CapacitorKey, loss: CapacitorKey) {
      super();
      this.energyConsume = use.getBaseValue();
      this.energyStorage = buffer.getBaseValue();
      this.maxIntake = intake.getBaseValue();
      this.lossPower = loss.getBaseValue();
    }

    getTier(): number {
      return 1;
    }

    getEnergyStorage(): number {
      return this.energyStorage;
    }

    getRelativeEnergy(): number {
      return this.data.energy / this.getEnergyStorage();
    }

    lossEnergy(): void {
      if (this.data.energy >= this.lossPower) this.data.energy -= this.lossPower;
    }

    canRotate(side: number): boolean {
      return side > 1;
    }

    getMaxIntake(): number {
      return this.maxIntake;
    }

    energyReceive(type: string, amount: number, voltage: number): number {
      let maxVoltage = this.getMaxIntake();
      if (voltage > maxVoltage) {
        amount = Math.min(amount, maxVoltage);
      }
      let add = Math.min(amount, this.getEnergyStorage() - this.data.energy);
      this.data.energy += add;
      return add;
    }
  }
}
