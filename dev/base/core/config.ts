namespace EnderConfig {
  export function getBool(name: string): boolean {
    return __config__.getBool(name);
  }

  export function getInt(name: string): number {
    return __config__.getInteger(name);
  }

  export function getFloat(name: string): number {
    return __config__.getFloat(name);
  }
  export let debugMode = getBool("debug_mode");
  export let oldMode = getBool("old_mode");
  export let fireMinAge = getInt("fireMinAge");
  export let maxTrackedFire = getInt("maxTrackedFire");
}

// namespace EnergyConfig {

// }
