import run from "../dist/testillery.js"

run("My Second Suite of Tests", test => {
  test("a string is reversed", assert => {
    let testString = "abcde"
    let arr = testString.split("")
    let rarr = arr.reverse()
    let rstr = rarr.join("")
    assert(rstr === "edcba", testString)
  })
})
