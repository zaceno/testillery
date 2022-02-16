import run from "../dist/testillery.js"

run("My Main Suite", test => {
  test("timeout failure", async (assert, done) => {
    setTimeout(() => {
      assert(false, true)
      done()
    }, 6000)
  })

  test("will fail slowly", async (assert, done) => {
    setTimeout(() => {
      assert(false, "the thing was not true")
      done()
    }, 3000)
  })

  test("will fail without message", async (assert, done) => {
    setTimeout(() => {
      assert(false)
      done()
    }, 2000)
  })

  test("will succeed slowly", async (assert, done) => {
    setTimeout(() => {
      assert(true, "the thing was not true")
      done()
    }, 3000)
  })

  test("Will succeed immediately", assert => {
    assert(true, "Yay")
  })

  test("Will fail immediately", assert => {
    assert(false, "Yay")
  })
})
