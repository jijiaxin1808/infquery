export function createValiteFunc<T, K, U>(fn: (input: T, result: K) => U, result: K ) {
  return (input: T) => fn(input, result);
}
