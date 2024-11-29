IMPORT("ConnectedTexture");
IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("BlockEngine");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
// import values

let Color = android.graphics.Color;
let PotionEffect = EPotionEffect;
let ParticleType = EParticleType;
let BlockSide = EBlockSide;
let EntityType = EEntityType;
// RECIPE VIEWER SUPPORT
let RV: RecipeViewerAPI;
let startTime = Debug.sysTime();
let GUI_SCALE = 3.2;
let GUI_SCALE_NEW = 3;

function isPlayer(entity: number): boolean {
  let type = Entity.getType(entity);
  return type == 1 || type == 63;
}

namespace MathHelper {
  export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  export function clamp(value: number, minValue: number, maxValue: number) {
    return Math.min(Math.max(value, minValue), maxValue);
  }
  export function degreeToRadian(degree: number): number {
    return (degree * Math.PI) / 180;
  }
}

let randomInt = MathHelper.randomInt;
