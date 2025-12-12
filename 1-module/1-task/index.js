function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    let result = 1;
    for (let i = 1; i <= n; i += 1) {
      result *= i;
    }
    return result;
  }
}
