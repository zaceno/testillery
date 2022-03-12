import runSuite from "../dist/testillery.js"
import testRunner from "../dist/metarunner.js"

runSuite("Skipping tests", test => {
  test("Skipped tests are not executed", async (assert, done) => {
    let calledA = false
    let calledB = false
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test.skip("aaa", assert => {
        calledA = true
        assert(true)
      })
      test.skip("bbb", assert => {
        calledB = true
        assert(true)
      })
    })
    queueMicrotask(() => {
      const statuses = tr.tests().map(t => t.status)
      assert.equal(statuses, ["skipped", "skipped"])
      assert.equal(calledA, false)
      assert.equal(calledB, false)
      done()
    })
  })

  test("Only skipped tests are skipped", async (assert, done) => {
    let calledA = false
    let calledB = false
    let calledC = false
    let calledD = false
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test.skip("aaa", assert => {
        calledA = true
        assert(true)
      })
      test("bbb", assert => {
        calledB = true
        assert(true)
      })
      test.skip("ccc", assert => {
        calledC = true
        assert(false)
      })
      test("ddd", assert => {
        calledD = true
        assert(false)
      })
    })
    queueMicrotask(() => {
      const statuses = tr.tests().map(t => t.status)
      assert.equal(statuses, ["skipped", "passed", "skipped", "failed"])
      assert.equal(calledA, false)
      assert.equal(calledB, true)
      assert.equal(calledC, false)
      assert.equal(calledD, true)
      done()
    })
  })

  test('Using "only" skips other tests', async (assert, done) => {
    let calledA = false
    let calledB = false
    let calledC = false
    let calledD = false
    let calledE = false
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("a", assert => {
        calledA = true
        assert(true)
      })

      test.skip("b", assert => {
        calledB = true
        assert(false)
      })

      test("c", assert => {
        calledC = true
        assert(true)
      })

      test.only("d", assert => {
        calledD = true
        assert(false)
      })

      test("e", assert => {
        calledE = true
        assert(true)
      })
    })
    queueMicrotask(() => {
      const statuses = tr.tests().map(t => t.status)
      assert.equal(statuses, [
        "skipped",
        "skipped",
        "skipped",
        "failed",
        "skipped",
      ])
      assert.equal(calledA, false)
      assert.equal(calledB, false)
      assert.equal(calledC, false)
      assert.equal(calledD, true)
      assert.equal(calledE, false)
      done()
    })
  })
})
