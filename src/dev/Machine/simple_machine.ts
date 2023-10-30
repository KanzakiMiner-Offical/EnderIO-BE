namespace Machine {
  export abstract class SimpleMachine
  extends ProgressingMachine {
    defaultValues = {
      energy: 0,
      progress: 0
    }

    tier = 1;
    energyStorage = 2000;
    energyConsume = 15;
    processTime: number;

    getTier(): number {
      return 1;
    }

    getEnergyStorage(): number {
      return 2000;
    }

    getRelativeEnergy(): number {
      return this.data.energy / 2000;
    }

    lossEnergy(value: number = 0.1): void {
      if (this.data.energy >= value)
        this.data.energy -= value;
    }

    canRotate(side: number): boolean {
      return side > 1;
    }
  }
}