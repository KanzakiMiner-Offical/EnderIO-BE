BlockRegistry.createBlock("blackholeStabilizer", [
    {
        name: "Void Miner",
        texture: [
            ["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["bh_stabilizer", 0], ["machineSide", 0], ["machineSide", 0]],
        inCreative: true
    }
], "machine")

TileRenderer.setHandAndUiModel(BlockID.blackholeStabilizer, 0, [["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["bh_stabilizer", 0], ["machineSide", 0], ["machineSide", 0]])
TileRenderer.setStandardModelWithRotation(BlockID.blackholeStabilizer, 2, [["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["bh_stabilizer", 0], ["machineSide", 0], ["machineSide", 0]])
TileRenderer.registerModelWithRotation(BlockID.blackholeStabilizer, 2, [["machineBottom", 0], ["machineTop", 0], ["machineSide", 0], ["bh_stabilizer", 0], ["machineSide", 0], ["machineSide", 0]])

TileRenderer.setRotationFunction(BlockID.blackholeStabilizer)

/*
 * ```js 
 * texture: [
 *   ["название1", индекс1], // bottom (Y: -1)
 *   ["название2", индекс2], // top (Y: +1)
 *   ["название3", индекс3], // back (X: -1) West 2 
 *   ["название4", индекс4], // front (X: +1) East 3 
 *   ["название5", индекс5], // left (Z: -1) North 4 
 *   ["название6", индекс6]  // right (Z: +1) South 5
 * ]
 * ```
 */