import runSuite from "../dist/testillery.js"
import testRunner from "../dist/metarunner.js"

runSuite("Assert", test => {
  test("Sync true", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(true)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Sync false", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(false)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("Sync equal", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal("foo", "foo")
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Sync not equal", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert(true)
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Async true", async (assert, done) => {
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

  test("Async false", async (assert, done) => {
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

  test("Async equal", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert.equal(45, 45)
          done()
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    }, 120)
  })

  test("Async not equal", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", async (assert, done) => {
        setTimeout(() => {
          assert.equal(45, 25)
          done()
        }, 100)
      })
    })
    setTimeout(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    }, 120)
  })

  test("Deep equal array - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(["foo", 3], ["foo", 3])
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Deep equal array - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(["foo", 1], ["foo", 3])
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("Deep equal array => array - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(["foo", ["bar", 2]], ["foo", ["bar", 2]])
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Deep equal array => array - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(["foo", ["bar", 2]], ["foo", ["bar", 3]])
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("Deep equal array => object - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          [
            { foo: 2, bar: 3 },
            { zip: "foo", zap: "bar" },
          ],
          [
            { foo: 2, bar: 3 },
            { zip: "foo", zap: "bar" },
          ]
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Deep equal array => object - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          [
            { foo: 2, bar: 2 },
            { zip: "foo", zap: "bar" },
          ],
          [
            { foo: 2, bar: 3 },
            { zip: "foo", zap: "bar" },
          ]
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("Deep equal object - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal({ foo: 2, bar: 3 }, { foo: 2, bar: 3 })
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Deep equal object - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal({ foo: 3, bar: 3 }, { foo: 2, bar: 3 })
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })

  test("Deep equal object => array - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          { foo: [2, 3, 4], bar: [5, 6, 7] },
          { foo: [2, 3, 4], bar: [5, 6, 7] }
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })
  test("Deep equal object => array - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          { foo: [2, 3, 4], bar: [5, 6, 7] },
          { foo: [2, 4, 4], bar: [5, 6, 7] }
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })
  test("Deep equal object => object - pass", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          { foo: { zip: "foo", zap: "bar" }, bar: { zip: 2, zap: 3 } },
          { foo: { zip: "foo", zap: "bar" }, bar: { zip: 2, zap: 3 } }
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "passed")
      done()
    })
  })

  test("Deep equal object => object - fail", async (assert, done) => {
    const tr = testRunner()
    tr.runSuite("suite", test => {
      test("foo", assert => {
        assert.equal(
          { foo: { zip: "foo", zap: "bar" }, bar: { zip: 3, zap: 3 } },
          { foo: { zip: "foo", zap: "bar" }, bar: { zip: 2, zap: 3 } }
        )
      })
    })
    queueMicrotask(() => {
      assert.equal(tr.tests()[0].status, "failed")
      done()
    })
  })
})
