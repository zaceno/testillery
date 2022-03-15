import { BeginSuite, Init, State } from "./actions"
import { app, App } from "hyperapp"
import { SuiteFn } from "./effects"

export default (appOpts: App<State>) => {
  const dispatch = app({ ...appOpts, init: Init })
  return (name: string, func: SuiteFn) => dispatch(BeginSuite, { name, func })
}
