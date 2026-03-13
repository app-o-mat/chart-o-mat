/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    License: Public domain (or MIT if needed). Attribution appreciated.
    A fast and simple 53-bit string hash function with decent collision resistance.
    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
*/
const cyrb53 = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// Generate a color based on hashing the name to pick a hue and constrained lightness.
// This makes it so the colors "go together" visually, while still being unique and stable for each name.
export function getColorBasedOnName(name) {
    // Hash the name using a simple hash
    const hashInt = cyrb53(name);
    const hueValues = 360;
    const hue = hashInt % hueValues;
    
    // Hash the reversed name
    const hashIntRev = cyrb53(name.split('').reverse().join(''));
    const lightnessArr = [40, 60, 80];
    const lightness = lightnessArr[hashIntRev % 3];

    return `hsl(${Math.floor(hue * (360 / hueValues))}, 75%, ${lightness}%)`;
}

