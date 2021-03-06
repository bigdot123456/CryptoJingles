const seedRandom = require('seed-random');
const createRandomRange = require('./random-range.js');
const createLocalConfig = require('./config');
const path = require('path');

module.exports = {
  create: (_seed) => {
    const seed = parseInt(_seed, 10);
    const randomFunc = seedRandom(seed);
    const random = createRandomRange(randomFunc);

    const maps = [
      'architecture.jpg', 'church2.jpg', 'city2.jpg', 'city5.jpg',
      'eye.jpg', 'fractal1.jpg', 'fractal2.jpg', 'geo1.jpg', 'geo3.jpg',
      'geo4.jpg', 'geo5.jpg', 'map7.jpg', 'nature1.jpg', 'pat1.jpg',
      'scifi.jpg', 'sym3.jpg', 'sym6.jpg'
    ].map((mapName) => path.resolve(`../jingleImageGeneration/maps/${mapName}`));

    const mapSrc = maps[Math.floor(random(maps.length))];

    const outputDir = path.resolve('../public');

    return (createLocalConfig(seed, random, randomFunc, mapSrc, outputDir));
  }
};
