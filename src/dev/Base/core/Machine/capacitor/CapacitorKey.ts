class CapacitorKey {
    valueType: string
    baseValue: number
    scaler: Scaler
    owner: string
    constructor(valueType: string, baseValue: number, scaler: Scaler, owner?: string) {
        this.valueType = valueType
        this.baseValue = baseValue
        this.scaler = scaler
        this.owner = owner
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

    setScaler(scaler: Scaler) {
        this.scaler = scaler;
    }

    setBaseValue(baseValue: number) {
        this.baseValue = baseValue;
    }
    static Key = {
        ATTRACTOR_RANGE: "area",  // not use
        ALLOY_SMELTER_POWER_USE: "smelting",
        STIRLING_POWER_GEN: "red",
        FARM_BONUS_SIZE: "green",  // not use
        SPAWNER_SPEEDUP: "mobby",  // not use
        SAG_MILL_POWER_USE: "crushed",
        SLICE_POWER_USE: "cleancut",
        SOUL_BINDER_POWER_USE: "tight",
        PAINTER_POWER_USE: "aa",  // not use
        VAT_POWER_USE: "wet",
        COMBUSTION_POWER_GEN: "kaboom",
        ENHANCED_COMBUSTION_POWER_GEN: "fatman", // not use

        LEGACY_ENERGY_INTAKE: "intake",
        LEGACY_ENERGY_BUFFER: "buffer"
    }
    // static Type: string[] = ["ATTRACTOR_RANGE", "ALLOY_SMELTER_POWER_USE", "STIRLING_POWER_GEN", "FARM_BONUS_SIZE", "SPAWNER_SPEEDUP", "SAG_MILL_POWER_USE", "SLICE_POWER_USE", "SOUL_BINDER_POWER_USE", "PAINTER_POWER_USE", "VAT_POWER_USE", "COMBUSTION_POWER_GEN", "ENHANCED_COMBUSTION_POWER_GEN", "LEGACY_ENERGY_INTAKE", "LEGACY_ENERGY_BUFFER"]

    static STIRLING_POWER_BUFFER = new CapacitorKey("buffer", 100000, ScalerFactory.POWER, CapacitorKey.Key.LEGACY_ENERGY_BUFFER)
    static STIRLING_POWER_GEN = new CapacitorKey("gen", 60, ScalerFactory.DROPOFF, CapacitorKey.Key.STIRLING_POWER_GEN)
    static STIRLING_POWER_EFFICIENCY = new CapacitorKey("efficiency", 80, ScalerFactory.DROPOFF, CapacitorKey.Key.STIRLING_POWER_GEN) // aka speed
}

