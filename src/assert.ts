import equal from "./equal.js"

type Reject = (reason?: string | Error) => void
type Assert = (truth: boolean, message?: string) => void
type AssertEqual = (x: any, y: any, message?: string) => void
export type Asserter = Assert & { equal: AssertEqual }

export class AssertionError extends Error {}

const plainAssert: Assert = (truth, message) => {
  if (!truth) throw new AssertionError(message)
}
const getAsyncAssert =
  (reject: Reject): Assert =>
  (truth, message) => {
    if (!truth) reject(message)
  }

export const getAssert = (reject?: Reject): Asserter => {
  const assert = reject ? getAsyncAssert(reject) : plainAssert
  return Object.assign(assert, {
    equal: (x: any, y: any, msg?: string) => assert(equal(x, y), msg),
  })
}
