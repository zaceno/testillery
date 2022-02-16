const equalArray = (x: any[], y: any[]): boolean => {
  if (x.length !== y.length) return false
  return x.reduce((q, z, i) => q && equal(z, y[i]), true)
}

const equalObj = (x: any, y: any): boolean => {
  let eq = true
  for (let k in x) eq = eq && equal(x[k], y[k])
  for (let k in y) eq = eq && equal(x[k], y[k])
  return eq
}

const equal = (x: any, y: any): boolean => {
  if (Array.isArray(x)) {
    if (Array.isArray(y)) {
      return equalArray(x, y)
    } else return false
  } else if (typeof x === "object") {
    if (typeof y === "object") {
      return equalObj(x, y)
    } else return false
  } else {
    return x === y
  }
}

export default equal
