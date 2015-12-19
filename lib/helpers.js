// get random number, inclusive
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function constrain(n, min, max){
        return Math.max(Math.min(n, max), min);
}