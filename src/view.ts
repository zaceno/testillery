import { h, text, ElementVNode } from "hyperapp"

import { Test, State } from "./actions"

const testResult = ({ status, name, id, message }: Test) =>
  h(
    "tr",
    {
      key: "test-" + id,
      class: ["test", status],
    },
    [
      h(
        "td",
        {},
        status === "running"
          ? h("span", { class: "spin" }, text("\u2736"))
          : status === "passed"
          ? h("span", { class: "check" }, text("\u2713"))
          : status === "failed"
          ? h("span", {}, text("\u2717"))
          : text("")
      ),
      h("td", {}, text(name)),
      h("td", {}, text(message || "")),
    ]
  )

type TestListProps = {
  tests: Test[]
}
const testList = ({ tests }: TestListProps) =>
  h("table", {}, [
    h("tr", {}, [
      h("th", {}, text("")),
      h("th", {}, text("Test")),
      h("th", {}, text("Message")),
    ]),
    ...tests.map(testResult),
  ])

const summaryBar = ({ tests }: TestListProps) => {
  const total = tests.filter(t => t.status !== "skipped").length
  const failed = tests.filter(t => t.status === "failed").length
  const passed = tests.filter(t => t.status === "passed").length
  const percentFailed = total === 0 ? 0 : Math.round((failed / total) * 100)
  const percentPassed = total === 0 ? 0 : Math.round((passed / total) * 100)
  return h("div", { class: "progressContainer" }, [
    h("div", {
      class: "progressFailed",
      style: { width: `${percentFailed}%` },
    }),
    h("div", {
      class: "progressPassed",
      style: { width: `${percentPassed}%` },
    }),
  ])
}

export default ({ suites, tests: allTests }: State) =>
  h("main", {}, [
    summaryBar({ tests: allTests }),
    ...suites.map(({ id, name }) => {
      const tests = allTests.filter(test => test.suite === id)
      if (!tests.length) return false
      return h("section", {}, [h("h2", {}, text(name)), testList({ tests })])
    }),
  ]) as ElementVNode<State>
