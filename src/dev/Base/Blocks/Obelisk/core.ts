namespace ObeliskCore {

  export function registerModel(id: string, texture ? : string) {
    texture = texture || id
    let mesh = new RenderMesh();
    let model = new BlockRenderer.Model(mesh);
    let render = new ICRender.Model();
    mesh.importFromFile(__dir__ + "res/terrain-atlas/Base/obelisk/experience_obelisk.obj", "obj", null);
    mesh.setBlockTexture(texture, 0);
    render.addEntry(model);
    BlockRenderer.setStaticICRender(BlockID[id], -1, render);
    ItemModel.getFor(BlockID[id], -1).setModel(render);
  }

  // xp
  export let LIQUID_RATIO = 20

  export function setPlayerXp(player: PlayerActor, xp: number): void {
    const lv = this.XPtoLVL(xp);
    const cap = xp - this.LVLtoXP(lv);
    player.setLevel(lv);
    player.setExperience(cap);
  }


  export function XPtoLVL(xp) { // https://minecraft.gamepedia.com/Experience
    let currentLevel = 0;
    let remainingXP = xp;
    while (true) {
      let requiredForNextLevel;
      if (currentLevel <= 15) {
        requiredForNextLevel = (2 * currentLevel) + 7;
      } else if (currentLevel >= 16 && currentLevel <= 30) {
        requiredForNextLevel = (5 * currentLevel) - 38;
      } else {
        requiredForNextLevel = (9 * currentLevel) - 158;
      }

      if (remainingXP >= requiredForNextLevel) {
        remainingXP -= requiredForNextLevel;
        currentLevel++;
      } else break;
    }

    return { lvl: currentLevel, rem: remainingXP };
  }

  export function LVLtoXP(lvl) { // https://minecraft.gamepedia.com/Experience
    let requiredXP;
    if (lvl <= 16) {
      requiredXP = Math.pow(lvl, 2) + 6 * lvl;
    } else if (lvl >= 17 && lvl <= 31) {
      requiredXP = 2.5 * Math.pow(lvl, 2) - 40.5 * lvl + 360
    } else {
      requiredXP = 4.5 * Math.pow(lvl, 2) - 162.5 * lvl + 2220
    }

    return requiredXP;
  }

  export function XPtoLiquid(xp) {
    if (xp)
      return xp * this.LIQUID_RATIO;
    else return 0
  }

  export function LiquidtoXP(liquid) {
    if (liquid)
      return liquid / this.LIQUID_RATIO;
    else
      return 0
  }

  // weather
  export function getTypeWeather(tank: BlockEngine.LiquidTank) {
    let liquid = tank.getLiquidStored();
    switch (liquid) {
      case "sunshine":
        return {
          rain: 0,
            thunder: 0
        }
        break;
      case "cloudSeed":
        return {
          rain: 10,
            thunder: 0
        }
        break;
      case 'cloudSeedConcentrated':
        return {
          rain: 10,
            thunder: 10
        }
        break;
      default:
        return null;
    }
    return null
  }
}