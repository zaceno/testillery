import { Dispatch, Action, Effect } from "hyperapp"
import { getAssert, Assert } from "./assert"
const TIMEOUT = 5000

export type TestFn = (assert: Assert, done?: () => void) => void | Promise<void>

type TestRunProps<S> = {
  id: number
  func: TestFn
  suite: number
  Start: Action<S, number>
  Pass: Action<S, number>
  Fail: Action<S, { id: number; message: string }>
}

const _testRun = <S>(dispatch: Dispatch<S>, props: TestRunProps<S>) => {
  const pass = () => {
    dispatch(props.Pass, props.id)
  }
  const fail = (message: string) => {
    dispatch(props.Fail, { id: props.id, message })
  }
  queueMicrotask(() => {
    dispatch(props.Start, props.id)
    if (props.func.constructor.name === "AsyncFunction") {
      new Promise((resolve, reject) => {
        setTimeout(() => reject(`Test did not end within ${TIMEOUT}`), TIMEOUT)
        props.func(getAssert(reject), () => {
          resolve(true)
        })
      })
        .then(pass)
        .catch(fail)
    } else {
      try {
        props.func(getAssert())
        pass()
      } catch (e) {
        fail("" + e)
      }
    }
  })
}

export const testRun = <S>(
  props: TestRunProps<S>
): Effect<S, TestRunProps<S>> => [_testRun, props]

export type RegistrationStatus = "run" | "skipped" | "only"
type PlainTest = (name: string, test: TestFn) => void
type Test = PlainTest & { skip: PlainTest; only: PlainTest }
export type SuiteFn = (test: Test) => void

type SuiteTestProps = {
  func: TestFn
  suite: number
  name: string
  status: RegistrationStatus
}

type SuiteRunProps<S> = {
  func: SuiteFn
  id: number
  Register: Action<S, SuiteTestProps>
  Run: Action<S, void>
}

const _suiteRun = <S>(dispatch: Dispatch<S>, props: SuiteRunProps<S>) => {
  const _test = (name: string, func: TestFn, status: RegistrationStatus) =>
    dispatch(props.Register, { name, func, suite: props.id, status })
  const test: PlainTest = (name, func) => _test(name, func, "run")
  const skip: PlainTest = (name, func) => _test(name, func, "skipped")
  const only: PlainTest = (name, func) => _test(name, func, "only")
  props.func(Object.assign(test, { skip, only }))
  dispatch(props.Run)
}

export const suiteRun = <S>(
  props: SuiteRunProps<S>
): Effect<S, SuiteRunProps<S>> => [_suiteRun, props]
