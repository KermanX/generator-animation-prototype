import { VNode, markRaw } from "vue";
import { AnimationGenerator } from "./animation";

export abstract class NewcarWidget {
  generator: AnimationGenerator;

  setup(f: (w: this) => AnimationGenerator) {
    this.generator = markRaw(f(this));
  }

  abstract render(): VNode;
}

export class NewcarRect extends NewcarWidget {
  x = 0;
  y = 0;
  width = 100;
  height = 100;
  backgroundColor = "red";

  constructor(options: any) {
    super();
    Object.assign(this, options);
  }

  render(): VNode {
    return (
      <div
        style={{
          position: "absolute",
          left: `${this.x}px`,
          top: `${this.y}px`,
          width: `${this.width}px`,
          height: `${this.height}px`,
          backgroundColor: this.backgroundColor,
        }}
      />
    );
  }
}
