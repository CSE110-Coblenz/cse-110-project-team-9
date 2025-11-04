// src/main.ts
import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { MathScreenView } from "./screens/MathScreen/MathScreenView";

const stage = new Konva.Stage({
  container: "container",
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
});

const layer = new Konva.Layer();
stage.add(layer);

// make the view
const view = new MathScreenView();

// ⬅️ use getGroup() now
layer.add(view.getGroup());
layer.draw();

// show the screen (uses your show() helper)
view.show();

// test content
view.showEquation("Factor this: x² - 7x + 10");
view.showEnterFactored();

// optional: hook up check callback
view.onCheck((answer) => {
  if (answer === "(x-2)(x-5)") {
    view.showFeedback("✅ correct", true);
  } else {
    view.showFeedback("❌ nope", false);
  }
  view.clearAnswer();
});
