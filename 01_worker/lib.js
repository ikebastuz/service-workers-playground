function fib(num) {
  let result = 0;
  if (num < 2) return num;

  result = fib(num - 1) + fib(num - 2);

  return result;
}

function bubbleSort() {
  const length = 60000;
  const a = Array.from({ length }, (_, idx) => length - idx);

  function sort(a) {
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < a.length - 1; i++) {
        if (a[i] > a[i + 1]) {
          const temp = a[i];
          a[i] = a[i + 1];
          a[i + 1] = temp;
          swapped = true;
        }
      }
    } while (swapped);
  }

  const start = new Date().getTime();
  sort(a);
  const end = new Date().getTime();
  const time = end - start;
  return time;
}
