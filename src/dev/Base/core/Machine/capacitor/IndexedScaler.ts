interface Scaler {
    scaleValue(id: number): number;
}
/**
 * The IndexedScaler is s scaler that interpolates linearly between a number of points. Those points are at fixed intervals on the x-axis (one every 'scale'
 * units).
 *
 * The points are at (scale * n; keyValues[n]) for n in 0...keyValues.length-1
 *
 * Again, plotting it out is helpful.
 */
class IndexedScaler implements Scaler {
    private scale: number;
    private keyValues: number[];

    constructor(scale: number, keyValues: number[]) {
        this.scale = scale;
        this.keyValues = keyValues;
    }

    public scaleValue(idx: number): number {
        let idx_scaled = idx / this.scale;
        let idxi = Math.ceil(idx_scaled);;
        let idxf = idx_scaled - idxi;
        if (idxi < 0) {
            return this.keyValues[0];
        }
        if (idxi >= this.keyValues.length - 1) {
            return this.keyValues[this.keyValues.length - 1];
        }
        return (1 - idxf) * this.keyValues[idxi] + idxf * this.keyValues[idxi + 1];
    }
}