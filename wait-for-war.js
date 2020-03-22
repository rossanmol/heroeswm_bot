const anchors = Array.from(document.querySelectorAll("a"));
const lastWar = anchors[anchors.length - 2];
const lastWarID = lastWar.match(/\d+/)[0];
const nextBigWar = Math.ceil(lastWarID / 100) * 100;

console.log;
