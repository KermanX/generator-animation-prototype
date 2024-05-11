import { NewcarWidget } from "./widget";

export type AnimationGenerator = Generator<
  boolean, // true: step start; false: step continue
  void,
  {
    /**
     * The widget instance
     */
    w: NewcarWidget,
    /**
     * The time since this step started
     */
    t: number,
  }>
