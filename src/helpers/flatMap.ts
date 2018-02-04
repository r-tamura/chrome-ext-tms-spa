const flatMap = <T>(f: (a: T, i: number) => T, xs: T[]) => {
  return [].concat(...xs.map(f))
}

export default flatMap
