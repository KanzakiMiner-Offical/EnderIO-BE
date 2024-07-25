namespace ScalerFactory {
    export const POWER = (new IndexedScaler(1, [0, 1, 3, 5, 8, 13, 18]))
    export const DROPOFF = (new IndexedScaler(1, [1, 1, 4 / 3, 2, 2.5, 3, 3.25]))
    export class BURNTIME extends IndexedScaler {
        constructor() {
            super(1, [0.8, 1, 1.25, 1.5, 1.5, 2, 2.5])
        }
        public override scaleValue(idx: number) {
            return super.scaleValue(idx) / 100; // Convert from percentage
        }
    }
    export class INVALID implements Scaler {
        public scaleValue(idx: number) {
            return 0;
        }
    }
    export class IDENTITY implements Scaler {
        public scaleValue(idx: number) {
            return Math.max(idx, 0);
        }
    }
    export class LINEAR_0_8 implements Scaler { // 1-2-3-4-5-6-7-8-8-8
        public scaleValue(idx: number) {
            return MathHelper.clamp(idx, 0, 8);
        }
    }
    export class QUADRATIC implements Scaler { // 1-2-4-8-16-...
        public scaleValue(idx: number) {
            return Math.pow(2, idx - 1);
            // replace with identity
        }
    }
    export class QUADRATIC_1_8 implements Scaler { // 1-2-4-8-8-8
        public scaleValue(idx: number) {
            return MathHelper.clamp(Math.pow(2, idx - 1), 1, 8);
        }
    }
    export class CUBIC implements Scaler { // 1-3-9-...
        public scaleValue(idx: number) {
            return Math.pow(3, idx - 1);
        }
    }
    export const OCTADIC_1_8 = (new IndexedScaler(.5, [0, .5, 1, 3, 2, 4, 8, 10, 16]))
    export const CHARGE = (new IndexedScaler(1, [1000, 100, 60, 20, 10, 1]))
    export const SPEED = (new IndexedScaler(1, [100, 20, 10, 2, 1]))
    export const POWER10 = (new IndexedScaler(1, [0, 1, 2, 10, 20, 40]))
    export const RANGE = (new IndexedScaler(1, [0, 4, 6, 10, 17, 24]))
    export class FIXED extends IndexedScaler { // 1-1-1
        public scaleValue(idx: number) {
            return 1;
        }
    }
    export const SPAWNER = (new IndexedScaler(1, [0, 1, 5, 10, 20, 40]))
    export class CHEMICAL implements Scaler { // (.75)-1-1.25-1.5-1.75-2...
        public scaleValue(idx: number) {
            return 1 + (idx - 1) * 0.25;
        }
    }
    export class CENT implements Scaler { // 0.01-0.01-0.01 (used for power loss)
        public scaleValue(idx: number) {
            return 0.01;
        }
    }

}