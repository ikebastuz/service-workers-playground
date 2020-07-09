importScripts('./lib.js');

self.addEventListener(
  'message',
  (e) => {
    const { data, cmd } = e.data;
    switch (cmd) {
      case 'fib':
        var result = fib(data);
        self.postMessage({ cmd, result });
        break;
      case 'bubble':
        var result = bubbleSort();
        self.postMessage({ cmd, result });
        break;
      default:
        self.postMessage('Unknown command');
    }
  },
  false
);
