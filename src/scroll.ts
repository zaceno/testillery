export default () => {
  let scrollY = localStorage.getItem("scroll-y")
  if (scrollY) {
    queueMicrotask(() =>
      requestAnimationFrame(() => {
        window.scrollBy(0, +(scrollY || 0))
      })
    )
  }
  let lock = false
  const handler = () => {
    if (!lock) {
      lock = true
      requestAnimationFrame(() => {
        localStorage.setItem("scroll-y", "" + window.scrollY)
        lock = false
      })
    }
  }
  window.addEventListener("scroll", handler)
  return () => {
    window.removeEventListener("scroll", handler)
  }
}
