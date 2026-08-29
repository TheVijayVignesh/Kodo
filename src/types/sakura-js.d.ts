declare module "sakura-js" {
  export interface SakuraColors {
    gradientColorStart: string;
    gradientColorEnd: string;
    gradientColorDegree: number;
  }

  export interface SakuraOptions {
    className?: string;
    fallSpeed?: number;
    maxSize?: number;
    minSize?: number;
    delay?: number;
    colors?: SakuraColors[] | SakuraColors;
    lifeTime?: number;
  }

  export class Sakura {
    constructor(target: string | HTMLElement, options?: SakuraOptions);
    stop(graceful?: boolean): void;
    start(): void;
  }

  export { Sakura as default };
}
