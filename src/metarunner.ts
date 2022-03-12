import getSuiteRunner from "./get-runner"
import { State } from "./actions"
import { Dispatchable } from "hyperapp"

export default () => {
  let _state: State
  let runSuite = getSuiteRunner({
    dispatch: d => (action: Dispatchable<State>, payload: any) => {
      if (typeof action !== "function" && !Array.isArray(action)) {
        _state = action as State
      }
      d(action, payload)
    },
  })
  return {
    runSuite,
    tests: () => _state.tests,
    suites: () => _state.suites,
  }
}
