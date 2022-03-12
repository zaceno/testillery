import runSuite from "../dist/testillery.js"
import testRunner from "../dist/metarunner.js"

runSuite("Asynchronous tests", test => {
  test("A single slow success", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert(true)
          done()
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    }, 120)
  })

  test("A single slow failure", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert(false)
          done()
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    }, 120)
  })

  test("Async sequence where first fails", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert(false)
          setTimeout(() => {
            assert(true)
            done()
          }, 100)
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    }, 240)
  })

  test("Async sequence where second fails", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert(true)
          setTimeout(() => {
            assert(false)
            done()
          }, 100)
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    }, 240)
  })
})
