// FNV-1a hash for better distribution
function simpleHash(str) {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    // Convert to unsigned 32-bit integer
    return hash >>> 0;
}

export function getColorBasedOnName(name) {
    // Hash the name using a simple hash
    const hashInt = simpleHash(name);
    const hueValues = 360;
    const hue = hashInt % hueValues;
    
    // Hash the reversed name
    const hashIntRev = simpleHash(name.split('').reverse().join(''));
    const lightnessArr = [50, 60, 75];
    const lightness = lightnessArr[hashIntRev % 3];

    return `hsl(${Math.floor(hue * (360 / hueValues))}, 75%, ${lightness}%)`;
}

