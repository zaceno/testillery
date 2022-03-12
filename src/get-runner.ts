import { BeginSuite, Init, State } from "./actions"
import { app, App } from "hyperapp"
import { Suite } from "./effects"

export default (appOpts: App<State>) => {
  const dispatch = app({ ...appOpts, init: Init })
  return (name: string, func: Suite) => dispatch(BeginSuite, { name, func })
}
