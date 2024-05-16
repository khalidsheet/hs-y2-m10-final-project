import "./style.css";
import { App } from "./App";
import { DragGesture } from "@use-gesture/vanilla";

const el = document.querySelector("#canvas");

const app = new App();

new DragGesture(el, (state) => {
  app.onDrag(state, state.delta[0]);
});
