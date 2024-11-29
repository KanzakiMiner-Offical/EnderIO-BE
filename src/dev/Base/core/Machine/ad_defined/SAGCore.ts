namespace GrindingBall {
  export type IngredientGrinding = {
    id: string;
    data: number;
  };

  export type GrindingBallData = {
    main: number;
    bonus: number;
    use: number;
    durability: number;
  };

  export const idBall = {};

  export function regItem(id: string, name: string): void {
    let texture = "item_alloy_ball_" + id;
    let iID = "ball_" + id;
    IDRegistry.genItemID(iID);
    Item.createItem(iID, name + " Grinding Ball", { name: texture }, { stack: 64 });
  }

  export function regModBall(
    id: string,
    name: string,
    main: number,
    bonus: number,
    powUse: number,
    dura: number,
    recipe: IngredientGrinding,
  ): void {
    regItem(id, name);
    idBall[ItemID["ball_" + id]] = {
      main: (main - 100) / 100,
      bonus: bonus / 100,
      use: powUse / 100,
      durability: Math.floor(dura / 2400),
    };
    if (!!recipe) {
      Callback.addCallback("PreLoaded", function () {
        Recipes.addShaped({ id: ItemID["ball_" + id], count: 24, data: 0 }, [" a ", "aaa", " a "], ["a", ItemID[recipe.id], recipe.data]);
      });
    }
  }

  export function regBall(id: string | number, main: number, bonus: number, powUse: number, dura: number): void {
    let n_id = id;
    if (typeof id == "string") n_id = ItemID[n_id];

    idBall[id] = {
      main: (main - 100) / 100,
      bonus: bonus / 100,
      use: powUse / 100,
      durability: Math.floor(dura / 2400),
    };
  }

  export function isBallID(id: string | number): boolean {
    let n_id = id;
    if (typeof id == "string") n_id = ItemID[id];
    return !!idBall[n_id];
  }

  export function getBallID(id: string | number): GrindingBallData {
    let n_id = id;
    if (typeof id == "string") n_id = ItemID[id];
    return idBall[n_id];
  }
}
// ender io resource
GrindingBall.regBall(VanillaItemID.flint, 120, 125, 85, 24000);
GrindingBall.regModBall("dark_steel", "Dark Steel", 135, 200, 70, 125000, {
  id: "darkSteel",
  data: 0,
});
GrindingBall.regModBall("conductive_iron", "Conductive Iron", 135, 100, 100, 40000, { id: "conductiveIron", data: 0 });
GrindingBall.regModBall("electrical_steel", "Electrical Steel", 120, 165, 80, 40000, {
  id: "electricalSteel",
  data: 0,
});
GrindingBall.regModBall("energetic_alloy", "Energetic Alloy", 160, 110, 110, 80000, { id: "energeticAlloy", data: 0 });
GrindingBall.regModBall("vibrant_alloy", "Vibrant Alloy", 175, 135, 135, 80000, { id: "vibrantAlloy", data: 0 });
GrindingBall.regModBall("redstone_alloy", "Redstone Alloy", 100, 100, 35, 30000, { id: "redstoneAlloy", data: 0 });
GrindingBall.regModBall("pulsating_iron", "Pulsating Iron", 100, 185, 100, 100000, { id: "pulsatingIron", data: 0 });
GrindingBall.regModBall("soularium", "Soularium", 120, 215, 90, 80000, {
  id: "soularium",
  data: 0,
});
// thermal resource
/*
The grinding balls from Thermal's resources are registered at: dev/Base/Integration/thermal.js
*/
// endergy

/*
Say bye to Endergy Ball here :(
The grinding balls from Endergy's resources are moved at: dev/Endergy/Item/ball.ts
*/
