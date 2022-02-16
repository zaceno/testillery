import { suiteRun, testRun, Test, PreStatus } from "./effects"
import { Action } from "hyperapp"
type Status = PreStatus | "running" | "passed" | "failed"
export type ASuite = { name: string; id: number }
export type ATest = {
  name: string
  func: Test
  id: number
  suite: number
  status: Status
  message?: string
}
export type State = {
  tests: ATest[]
  suites: ASuite[]
  id: number
}

export const Init: Action<State, any> = () => ({
  id: 0,
  tests: [],
  suites: [],
})

export const RunTests: Action<State, any> = state => {
  let tests = [...state.tests]
  if (tests.find(t => t.status === "only")) {
    tests = tests.map(t => {
      if (t.status !== "run") return t
      return { ...t, status: "skipped" }
    })
    tests = tests.map(t => {
      if (t.status !== "only") return t
      return { ...t, status: "run" }
    })
  }
  return [
    { ...state, tests },
    ...tests.filter(t => t.status === "run").map(t => [testRun, t] as const),
  ]
}

export const BeginSuite: Action<
  State,
  {
    name: string
    func: import("./effects").Suite
  }
> = (state, { name, func }) => {
  let id = state.id + 1
  let suites = [...state.suites, { id, name }]
  return [{ ...state, id, suites }, [suiteRun, { func, id }]]
}

export const StartTest: Action<State, number> = (state, id) => {
  let tests = state.tests.map(t => {
    if (t.id !== id) return t
    return { ...t, status: "running" as const }
  })
  return { ...state, tests }
}

export const RegisterTest: Action<
  State,
  {
    func: Test
    name: string
    suite: number
    status: Status
  }
> = (state, props) => {
  let id = state.id + 1
  let tests = [...state.tests, { ...props, id }]
  return { ...state, id, tests }
}

export const PassTest: Action<State, number> = (state, id) => ({
  ...state,
  tests: state.tests.map(test => {
    if (test.id !== id) return test
    return { ...test, status: "passed" }
  }),
})

export const FailTest: Action<State, { id: number; message: string }> = (
  state,
  { id, message }
) => ({
  ...state,
  tests: state.tests.map(test => {
    if (test.id !== id) return test
    return { ...test, status: "failed", message }
  }),
})
