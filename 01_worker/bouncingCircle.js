const fibResult = document.getElementById('fibResult');
const fibSWResult = document.getElementById('fibSWResult');
const sortResult = document.getElementById('sortResult');
const sortSWResult = document.getElementById('sortSWResult');

const runCircle = () => {
  let circle = document.getElementById('circle');
  let X = 0;
  let Y = 0;
  let { width, height } = circle.parentElement.getBoundingClientRect();
  setInterval(function () {
    X += 0.04;
    Y += 0.05;
    circle.style.left = `${Math.sin(X * 2) * 100 + width / 2}px`;
    circle.style.top = `${Math.cos(Y * 2) * 50 + height / 2}px`;
  }, 20);
};
