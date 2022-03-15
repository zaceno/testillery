import getSuiteRunner from "./get-runner"
import view from "./view"
import scrollPos from "./scroll"
import "./style.css"
const node = document.createElement("div")
document.body.appendChild(node)
export default getSuiteRunner({
  node,
  view,
  subscriptions: () => [[scrollPos, {}]],
})
