export function match(param) {
  return /^[A-Za-z0-9]{28}$/g.test(param);
}