class CapacitorKey {
  valueType: string;
  baseValue: number;
  scaler: Scaler;
  owner: string;
  constructor(valueType: string, baseValue: number, scaler: Scaler, owner?: string) {
    this.valueType = valueType;
    this.baseValue = baseValue;
    this.scaler = scaler;
    this.owner = owner || "";
  }

  getFloat(level: number) {
    return this.baseValue * this.scaler.scaleValue(level);
  }

  getBaseValue() {
    return this.baseValue;
  }

  getValueType() {
    return this.valueType;
  }

  getKey() {
    return this.owner || "";
  }

  setScaler(scaler: Scaler) {
    this.scaler = scaler;
  }

  setBaseValue(baseValue: number) {
    this.baseValue = baseValue;
  }
  static Key = {
    ATTRACTOR_RANGE: "area", // not use
    ALLOY_SMELTER_POWER_USE: "smelting",
    STIRLING_POWER_GEN: "red",
    FARM_BONUS_SIZE: "green", // not use
    SPAWNER_SPEEDUP: "mobby", // not use
    SAG_MILL_POWER_USE: "crushed",
    SLICE_POWER_USE: "cleancut",
    SOUL_BINDER_POWER_USE: "tight",
    PAINTER_POWER_USE: "aa", // not use
    VAT_POWER_USE: "wet",
    COMBUSTION_POWER_GEN: "kaboom",
    ENHANCED_COMBUSTION_POWER_GEN: "fatman", // not use

    LEGACY_ENERGY_INTAKE: "intake",
    LEGACY_ENERGY_BUFFER: "buffer",
  };
  // static Type: string[] = ["ATTRACTOR_RANGE", "ALLOY_SMELTER_POWER_USE", "STIRLING_POWER_GEN", "FARM_BONUS_SIZE", "SPAWNER_SPEEDUP", "SAG_MILL_POWER_USE", "SLICE_POWER_USE", "SOUL_BINDER_POWER_USE", "PAINTER_POWER_USE", "VAT_POWER_USE", "COMBUSTION_POWER_GEN", "ENHANCED_COMBUSTION_POWER_GEN", "LEGACY_ENERGY_INTAKE", "LEGACY_ENERGY_BUFFER"]

  static STIRLING_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static STIRLING_POWER_GEN = new CapacitorKey("gen", 60, ScalerFactory.DROPOFF, CapacitorKey.Key.STIRLING_POWER_GEN);
  static STIRLING_POWER_EFFICIENCY = new CapacitorKey("efficiency", 80, ScalerFactory.DROPOFF, CapacitorKey.Key.STIRLING_POWER_GEN); // aka speed

  static COMBUSTION_POWER_BUFFER = new CapacitorKey("buffer", 500000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static COMBUSTION_POWER_GEN = new CapacitorKey("gen", 1, ScalerFactory.CHEMICAL, CapacitorKey.Key.COMBUSTION_POWER_GEN);
  static COMBUSTION_POWER_EFFICIENCY = new CapacitorKey("efficiency", 1, ScalerFactory.FIXED, CapacitorKey.Key.COMBUSTION_POWER_GEN);
  static COMBUSTION_POWER_SEND = new CapacitorKey("send", 1280, ScalerFactory.CENT, CapacitorKey.Key.COMBUSTION_POWER_GEN);

  static ZOMBIE_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.FIXED, null);
  static ZOMBIE_POWER_GEN = new CapacitorKey("gen", 80, ScalerFactory.FIXED, null);

  static ALLOY_SMELTER_POWER_INTAKE = new CapacitorKey("intake", 120, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_INTAKE);
  static ALLOY_SMELTER_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static ALLOY_SMELTER_POWER_USE = new CapacitorKey("use", 30, ScalerFactory.POWER, CapacitorKey.Key.ALLOY_SMELTER_POWER_USE);

  static CRAFTER_POWER_INTAKE = new CapacitorKey("intake", 120, ScalerFactory.POWER, "");
  static CRAFTER_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, "");
  static CRAFTER_POWER_USE = new CapacitorKey("use", 1, ScalerFactory.POWER, "");
  static CRAFTER_POWER_CRAFT = new CapacitorKey("use_craft", 10, ScalerFactory.FIXED, "");
  static CRAFTER_SPEED = new CapacitorKey("speed", 2, ScalerFactory.QUADRATIC, "");

  static SAG_MILL_POWER_INTAKE = new CapacitorKey("intake", 120, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_INTAKE);
  static SAG_MILL_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static SAG_MILL_POWER_USE = new CapacitorKey("use", 30, ScalerFactory.POWER, CapacitorKey.Key.SAG_MILL_POWER_USE);

  static SLICE_POWER_INTAKE = new CapacitorKey("intake", 160, ScalerFactory.QUADRATIC, CapacitorKey.Key.LEGACY_ENERGY_INTAKE);
  static SLICE_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static SLICE_POWER_USE = new CapacitorKey("use", 80, ScalerFactory.QUADRATIC, CapacitorKey.Key.SLICE_POWER_USE);

  static SOUL_BINDER_INTAKE = new CapacitorKey("intake", 1000, ScalerFactory.QUADRATIC, CapacitorKey.Key.LEGACY_ENERGY_INTAKE);
  static SOUL_BINDER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static SOUL_BINDER_USE = new CapacitorKey("use", 500, ScalerFactory.QUADRATIC, CapacitorKey.Key.SLICE_POWER_USE);
  static SOUL_BINDER_SOUND_PITCH = new CapacitorKey("pitch", 1, ScalerFactory.IDENTITY, CapacitorKey.Key.SLICE_POWER_USE); // not use now

  static VAT_POWER_INTAKE = new CapacitorKey("intake", 120, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_INTAKE);
  static VAT_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER);
  static VAT_POWER_USE = new CapacitorKey("use", 30, ScalerFactory.CHEMICAL, CapacitorKey.Key.VAT_POWER_USE);
}
