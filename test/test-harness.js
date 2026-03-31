// test-harness.js
export function createTestHarness(outputEl) {
  function log(line) {
    outputEl.textContent += line + "\n";
  }

  function test(name, fn) {
    try {
      fn();
      log(`PASS ${name}`);
    } catch (err) {
      log(`FAIL ${name}`);
      log(`  ${err.message}`);
    }
  }

  function assert(condition, message = "Assertion failed") {
    if (!condition) throw new Error(message);
  }

  function equal(actual, expected, message = "") {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  function notEqual(actual, expected, message = "") {
    if (actual === expected) {
      throw new Error(message || `Expected ${expected} to not equal ${actual}`);
    }
  }

  return { test, assert, equal, notEqual, log };
}