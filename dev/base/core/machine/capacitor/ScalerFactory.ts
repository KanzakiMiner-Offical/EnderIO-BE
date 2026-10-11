namespace ScalerFactory {
  export const POWER = new IndexedScaler(1, [0, 1, 3, 5, 8, 13, 18]);
  export const DROPOFF = new IndexedScaler(1, [1, 1, 4 / 3, 2, 2.5, 3, 3.25]);
  class CBURNTIME extends IndexedScaler {
    constructor() {
      super(1, [0.8, 1, 1.25, 1.5, 1.5, 2, 2.5]);
    }
    public override scaleValue(idx: number) {
      return super.scaleValue(idx) / 100; // Convert from percentage
    }
  }

  export const BURNTIME = new CBURNTIME();

  class CINVALID implements Scaler {
    public scaleValue(idx: number) {
      return 0;
    }
  }
  export const INVALID = new CINVALID();

  class CIDENTITY implements Scaler {
    public scaleValue(idx: number) {
      return Math.max(idx, 0);
    }
  }
  export const IDENTITY = new CIDENTITY();

  class CLINEAR_0_8 implements Scaler {
    // 1-2-3-4-5-6-7-8-8-8
    public scaleValue(idx: number) {
      return MathHelper.clamp(idx, 0, 8);
    }
  }
  export const LINEAR_0_8 = new CLINEAR_0_8();

  class CQUADRATIC implements Scaler {
    // 1-2-4-8-16-...
    public scaleValue(idx: number) {
      return Math.pow(2, idx - 1);
      // replace with identity
    }
  }
  export const QUADRATIC = new CQUADRATIC();

  class CQUADRATIC_1_8 implements Scaler {
    // 1-2-4-8-8-8
    public scaleValue(idx: number) {
      return MathHelper.clamp(Math.pow(2, idx - 1), 1, 8);
    }
  }
  export const QUADRATIC_1_8 = new CQUADRATIC_1_8();

  class CCUBIC implements Scaler {
    // 1-3-9-...
    public scaleValue(idx: number) {
      return Math.pow(3, idx - 1);
    }
  }
  export const CUBIC = new CCUBIC();
  export const OCTADIC_1_8 = new IndexedScaler(0.5, [0, 0.5, 1, 3, 2, 4, 8, 10, 16]);
  export const CHARGE = new IndexedScaler(1, [1000, 100, 60, 20, 10, 1]);
  export const SPEED = new IndexedScaler(1, [100, 20, 10, 2, 1]);
  export const POWER10 = new IndexedScaler(1, [0, 1, 2, 10, 20, 40]);
  export const RANGE = new IndexedScaler(1, [0, 4, 6, 10, 17, 24]);
  class CFIXED implements Scaler {
    // 1-1-1
    public scaleValue(idx: number) {
      return 1;
    }
  }
  export const FIXED = new CFIXED();

  export const SPAWNER = new IndexedScaler(1, [0, 1, 5, 10, 20, 40]);
  class CCHEMICAL implements Scaler {
    // (.75)-1-1.25-1.5-1.75-2...
    public scaleValue(idx: number) {
      return 1 + (idx - 1) * 0.25;
    }
  }
  export const CHEMICAL = new CCHEMICAL();

  export class CCENT implements Scaler {
    // 0.01-0.01-0.01 (used for power loss)
    public scaleValue(idx: number) {
      return 0.01;
    }
  }
  export const CENT = new CCENT();
}
