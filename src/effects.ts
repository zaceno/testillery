import {
  PassTest,
  FailTest,
  RunTests,
  StartTest,
  RegisterTest,
} from "./actions"
import { Dispatch } from "hyperapp"

import { getAssert, AssertionError, Asserter } from "./assert"

const TIMEOUT = 5000

export type PreStatus = "run" | "only" | "skipped"

export type Test = (assert: Asserter, done?: () => void) => void

type TestRunProps = {
  id: number
  func: Test
  suite: number
}

export const testRun = (
  dispatch: Dispatch<import("./actions").State>,
  test: TestRunProps
) => {
  new Promise((resolve, reject) => {
    requestAnimationFrame(async () => {
      dispatch(StartTest, test.id)
      if (test.func.constructor.name === "AsyncFunction") {
        setTimeout(
          () => reject(`Test did not end within ${TIMEOUT}ms`),
          TIMEOUT
        )
        test.func(getAssert(reject), () => {
          resolve(true)
        })
      } else {
        try {
          test.func(getAssert())
          resolve(true)
        } catch (e) {
          if (!(e instanceof AssertionError)) throw e
          reject(e.message)
        }
      }
    })
  })
    .then(() => dispatch(PassTest, test.id))
    .catch(message => dispatch(FailTest, { id: test.id, message }))
}

type PlainTester = (name: string, func: Test) => void
type Tester = PlainTester & { skip: PlainTester; only: PlainTester }

export type Suite = (test: Tester) => void
type SuiteRunProps = { func: Suite; id: number }

export const suiteRun = (
  dispatch: Dispatch<import("./actions").State>,
  { func, id: suiteid }: SuiteRunProps
) => {
  const _test = (name: string, tfn: Test, status: PreStatus) =>
    dispatch(RegisterTest, { name, func: tfn, suite: suiteid, status })
  const test: PlainTester = (name, tfn) => _test(name, tfn, "run")
  const skip: PlainTester = (name, tfn) => _test(name, tfn, "skipped")
  const only: PlainTester = (name, tfn) => _test(name, tfn, "only")
  func(Object.assign(test, { skip, only }))
  dispatch(RunTests)
}
