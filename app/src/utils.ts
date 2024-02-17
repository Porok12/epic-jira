/**
 * @param array must have `value` field
 */
export const accumulateCustom = (array: any[]) =>
  array.map((sum => value => ({ ...value, value: (sum += value.value) }))(0))
