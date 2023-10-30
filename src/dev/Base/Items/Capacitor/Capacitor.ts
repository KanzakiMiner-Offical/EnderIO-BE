interface IValueCapacitor {
  consume: number,
  bonus: number,
  storage: number,
  range: number
}

class CapacitorModule extends ItemCommon
implements ICapacitor {
  type: string;
  constructor(stringID: string, name: string, type ? : string) {
    let texture = name.toLowerCase();
    while (texture.indexOf("_") > 0) {
      texture = texture.split("_").join("")
    }
    super(stringID, "".concat(name, " Capacitor"), "".concat(texture, "Capacitor"));
    if (type) this.type = type;
    CapacitorAPI.registerCapacitor(this.id, this);

  }
}

class CapacitorCraft extends CapacitorModule
implements ItemBehavior {
  type = "capacitor";
  bonus: number;
  consume: number;
  storage: number;
  range: number;

  constructor(stringID: string, name: string, value: IValueCapacitor) {
    super(stringID, name, "capacitor");
    this.bonus = value.bonus;
    this.consume = value.consume;
    this.storage = value.storage;
    this.range = value.range
  }
  /*

  */
  getBonusGenerator(item ? : ItemInstance): number {
    return this.bonus
  }

  getEnergyConsumeMultiplier(item ? : ItemInstance): number {
    return this.consume
  }

  getExtraEnergyStorage(item ? : ItemInstance): number {
    return this.storage
  }

  getRange(item ? : ItemInstance): number {
    return this.range
  }

  onNameOverride(item: ItemInstance, name: string): string {
    return name + "§7\nGenerator Bonus: x" + this.getBonusGenerator() + "\nEnergy Consume Multiplier: x" + this.getEnergyConsumeMultiplier() + "\nExtra Energy Storage: +" + this.getExtraEnergyStorage() + "\nRange: +" + this.getRange();
  }
}