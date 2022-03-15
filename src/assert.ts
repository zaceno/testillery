import equal from "./equal.js"

type Reject = (reason?: string) => void
type PlainAssert = (truth: boolean, message?: string) => void
type AssertEqual = (x: any, y: any, message?: string) => void
export type Assert = PlainAssert & { equal: AssertEqual }

const plainAssert: PlainAssert = (truth, message) => {
  if (!truth) throw message
}
const getAsyncAssert =
  (reject: Reject): PlainAssert =>
  (truth, message) => {
    if (!truth) {
      reject(message)
    }
  }

export const getAssert = (reject?: Reject): Assert => {
  const assert = reject ? getAsyncAssert(reject) : plainAssert
  return Object.assign(assert, {
    equal: (x: any, y: any, msg?: string) => assert(equal(x, y), msg),
  })
}
