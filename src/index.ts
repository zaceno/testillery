import runList from "./view"
import { BeginSuite, Init, State } from "./actions"
import { app, ElementVNode } from "hyperapp"
import "./style.css"

type View = (state: State) => ElementVNode<State>

const node = document.createElement("div")
document.body.appendChild(node)
const dispatch = app({
  node,
  init: Init,
  view: runList as View,
})

const runSuite = (name: string, func: import("./effects").Suite) =>
  dispatch(BeginSuite, { name, func })

export default runSuite
