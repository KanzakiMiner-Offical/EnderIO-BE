IMPORT("ConnectedTexture");
IMPORT("BlockEngine");
IMPORT("StorageInterface");
IMPORT("BlockEngine");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
// import values
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
declare var KEX: KEXAPI;

function isPlayer(entity: number): boolean {
  let type = Entity.getType(entity);
  return type == 1 || type == 63;
}
