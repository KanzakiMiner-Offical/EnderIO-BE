namespace CombustionFuel {
  export let fuel = {};
  export let coolant = {};
  export type fuel_type = {
    perTick: number,
    ticks: number
  };
  export type coolant_type = {
    amount: number,
    temperature: number
  };

  export function addFuel(liquid: string, perTick: number,
    ticks: number): void {
    fuel[liquid] = {
      "perTick": perTick,
      "ticks": ticks
    }
  }

  export function addCoolant(liquid: string, amount: number, temperature: number): void {
    coolant[liquid] = {
      "amount": amount,
      "temperature": temperature
    }
  }

  export function getFuelData(liquid: string): fuel_type {
    return fuel[liquid]
  }

  export function getCoolantData(liquid: string): coolant_type {
    return coolant[liquid]
  }

  export function getHeatArray() {
    let heat = [];
    for (let key in fuel) {
      let input = key.split(":");
      heat.push(input[0]);
    }
    return heat
  }

  export function getCoolArray() {
    let cool = [];
    for (let key in coolant) {
      let input = key.split(":");
      cool.push(input[0]);
    }
    return cool
  }
  /*
  export function getData(data_type, liquid: string){
    return data_type[liquid];
  }
*/
  export class CoolantImpl {
    private fluid;
    private degreesCoolingPerMB;
    private temperature;

    constructor(fluid: string, degreesCoolingPerMB ? : number) {
      if (fluid == null) {
        this.fluid = null;
        this.degreesCoolingPerMB = this.temperature = 0
      } else {
        this.fluid = fluid;
        this.degreesCoolingPerMB = degreesCoolingPerMB || getCoolantData(fluid).amount
        this.temperature = getCoolantData(fluid).temperature
      }
    }

    getFluid() {
      return this.fluid;
    }
    /**
     * How much heat can one mB of the coolant absorb until it is evaporated completely?
     * 
     */
    getDegreesCoolingPerMB() {
      return (273.25 + 100.0 - this.getTemperature()) * this.getDegreesCoolingPerMBPerK();
    }
    /**
     * How much heat can one mB of the coolant absorb until it heats up by 1 K?
     * 
     */
    getDegreesCoolingPerMBPerK() {
      return this.degreesCoolingPerMB;
    }

    getTemperature() {
      return this.temperature
    }
  }

  export class FuelImpl {
    private fluid: string;
    private powerPerCycle: number;
    private totalBurningTime: number;

    constructor(fluid: string, powerPerCycle ? : number, totalBurningTime ? : number) {
      if (fluid == null) {
        this.fluid = null;
        this.powerPerCycle = this.totalBurningTime = 0
      } else {
        this.fluid = fluid;
        this.powerPerCycle = powerPerCycle || getFuelData(fluid).perTick
        this.totalBurningTime = totalBurningTime || getFuelData(fluid).ticks
      }
    }

    getFluid() {
      return this.fluid;
    }
    /**
     * Total burn time of one bucket of fuel
     */
    getTotalBurningTime() {
      return this.totalBurningTime;
    }
    /**
     * Amount of energy created per tick in a base-line machine
     */
    getPowerPerCycle() {
      return this.powerPerCycle;
    }
  }

}

CombustionFuel.addFuel("hootch", 60, 6000) // name, mb/t, t
CombustionFuel.addFuel("fireWater", 80, 15000)
CombustionFuel.addFuel("rocketFuel", 160, 7000)

CombustionFuel.addCoolant("water", 0.0023, 300)
//CombustionFuel.addCoolant("enderDistillation", 0.0023, 175)
CombustionFuel.addCoolant("vaporOfLevity", 0.0314, 5)

let HEAT_PER_RF = 0.00023 / 2;
class CombustionMath {
  private ticksPerCoolant: number
  private ticksPerFuel: number
  private energyPerTick: number

  constructor(coolant, fuel, capQuality: number, machineQuality: number) {
    if (coolant == null || fuel == null || capQuality == 0 || machineQuality == 0) {
      this.ticksPerCoolant = this.ticksPerFuel = this.energyPerTick = 0;
    } else {
      this.energyPerTick = Math.round(fuel.getPowerPerCycle() * capQuality * machineQuality);

      let cooling = coolant.getDegreesCoolingPerMB(); // heat absorbed per mB
      let toCool = HEAT_PER_RF * this.energyPerTick * machineQuality; // heat per tick
      this.ticksPerCoolant = Math.max(Math.round(cooling / toCool), 1);
      this.ticksPerFuel = Math.max((fuel.getTotalBurningTime() / capQuality / 1000), 1);
    }
  }

  getTicksPerCoolant(amount ? : number) {
    if (amount)
      return this.ticksPerCoolant * amount;
    else
      return this.ticksPerCoolant;
  }

  getTicksPerFuel(amount ? : number) {
    if (amount)
      return this.ticksPerFuel * amount;
    else
      return this.ticksPerFuel;
  }

  getEnergyPerTick() {
    return this.energyPerTick;
  }
  /*

    static toFuel(fuelTank) {
      return toFuel(fuelTank.getFluid());
    }

    static toFuel(fuelFluid) {
      return fuelFluid != null ? FluidFuelRegister.instance.getFuel(fuelFluid) : null;
    }

    static toCoolant(coolantTank: LiquidTank) {
      return toCoolant(coolantTank.getFluid());
    }

    static toCoolant(coolantFluid) {
      return coolantFluid != null ? FluidFuelRegister.instance.getCoolant(coolantFluid) : null;
    }
  */
}