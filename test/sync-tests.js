import run from "../dist/testillery.js"
import testRunner from "../dist/metarunner.js"
const FAIL_MESSAGE = "fail_message"
const passingSyncTest = (test, str = "foo") => test(str, assert => assert(true))
const failingSyncTest = (test, str = "foo") =>
  test(str, assert => assert(false, FAIL_MESSAGE))

run("Synchronous tests", test => {
  test("empty test", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      passingSyncTest(test)
    })
    assert(tr.tests().length === 1)
    assert(tr.tests()[0].status === "run")
    queueMicrotask(() => {
      assert(tr.tests()[0].status === "passed")
      done()
    })
  })

  test("single failing test", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      failingSyncTest(test)
    })
    assert(tr.tests().length === 1)
    assert(tr.tests()[0].status === "run")
    queueMicrotask(() => {
      assert(tr.tests()[0].status === "failed")
      assert(tr.tests()[0].message === FAIL_MESSAGE)
      done()
    })
  })

  test("multiple passing tests", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      passingSyncTest(test, "aaa")
      passingSyncTest(test, "bbb")
      passingSyncTest(test, "ccc")
    })
    assert.equal(tr.tests().length, 3)
    assert.equal(
      tr.tests().map(t => t.status),
      ["run", "run", "run"]
    )
    queueMicrotask(() => {
      assert.equal(
        tr.tests().map(t => t.status),
        ["passed", "passed", "passed"]
      )
      done()
    })
  })

  test("multiple passing one failing", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      passingSyncTest(test, "aaa")
      failingSyncTest(test, "bbb")
      passingSyncTest(test, "ccc")
      passingSyncTest(test, "ddd")
    })
    assert.equal(tr.tests().length, 4)
    assert.equal(
      tr.tests().map(t => t.status),
      ["run", "run", "run", "run"]
    )
    queueMicrotask(() => {
      assert.equal(
        tr.tests().map(t => t.status),
        ["passed", "failed", "passed", "passed"]
      )
      done()
    })
  })

  test("all failing", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      failingSyncTest(test, "aaa")
      failingSyncTest(test, "bbb")
      failingSyncTest(test, "ccc")
    })
    assert.equal(tr.tests().length, 3)
    assert.equal(
      tr.tests().map(t => t.status),
      ["run", "run", "run"]
    )
    queueMicrotask(() => {
      assert.equal(
        tr.tests().map(t => t.status),
        ["failed", "failed", "failed"]
      )
      done()
    })
  })

  test("some fail some succeed", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      failingSyncTest(test, "aaa")
      passingSyncTest(test, "bbb")
      failingSyncTest(test, "ccc")
      passingSyncTest(test, "ddd")
      failingSyncTest(test, "eee")
    })
    assert.equal(tr.tests().length, 5)
    assert.equal(
      tr.tests().map(t => t.status),
      ["run", "run", "run", "run", "run"]
    )
    queueMicrotask(() => {
      assert.equal(
        tr.tests().map(t => t.status),
        ["failed", "passed", "failed", "passed", "failed"]
      )
      done()
    })
  })

  test("multiple asserts - all pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(true)
        assert(true)
        assert(true)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("multiple asserts - last fails", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(true)
        assert(true)
        assert(false)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("multiple asserts - first fails", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(false)
        assert(true)
        assert(true)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })
})
