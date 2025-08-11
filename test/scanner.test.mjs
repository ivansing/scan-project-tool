import { strict as assert } from 'assert';
import fs from 'fs';
import path from 'path';

// Set a dummy API key to prevent OpenAI initialization error
process.env.OPENAI_API_KEY = 'test-key-for-testing';

import { scanProject, readSelectedFile } from '../src/scanner.mjs';
import { analyzeContent, analyzeProject } from '../src/analyzer.mjs';

// Test helper functions
function createTempDir() {
  const tempDir = path.join(process.cwd(), 'test-temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

function cleanupTempDir() {
  const tempDir = path.join(process.cwd(), 'test-temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function createTestFiles(baseDir) {
  // Create test directory structure
  const srcDir = path.join(baseDir, 'src');
  const nodeModulesDir = path.join(baseDir, 'node_modules');
  
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(nodeModulesDir, { recursive: true });
  
  // Create test files
  fs.writeFileSync(path.join(baseDir, 'package.json'), '{"name": "test"}');
  fs.writeFileSync(path.join(baseDir, '.env'), 'API_KEY=secret');
  fs.writeFileSync(path.join(baseDir, 'package-lock.json'), '{}');
  fs.writeFileSync(path.join(srcDir, 'test.js'), 'console.log("hello");');
  fs.writeFileSync(path.join(srcDir, 'test.py'), 'print("hello")');
  fs.writeFileSync(path.join(srcDir, 'test.tsx'), 'export default function() {}');
  fs.writeFileSync(path.join(srcDir, 'data.json'), '{"test": true}');
  fs.writeFileSync(path.join(srcDir, 'readme.txt'), 'This should be ignored');
  fs.writeFileSync(path.join(nodeModulesDir, 'ignored.js'), 'ignored');
}

// Test Suite
console.log('🧪 Running Scanner Tests...\n');

async function runTests() {
  let testsPassed = 0;
  let testsTotal = 0;

  function test(name, testFn) {
    testsTotal++;
    console.log(`Testing: ${name}`);
    try {
      testFn();
      console.log(`✅ PASS: ${name}`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  async function asyncTest(name, testFn) {
    testsTotal++;
    console.log(`Testing: ${name}`);
    try {
      await testFn();
      console.log(`✅ PASS: ${name}`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  // Setup
  const tempDir = createTempDir();
  createTestFiles(tempDir);

  // Test 1: scanProject without reading files
  test('scanProject should scan directory structure without reading files', () => {
    const result = scanProject(tempDir, false);
    
    assert(typeof result === 'object', 'Result should be an object');
    assert('src' in result, 'Should include src directory');
    assert('' in result, 'Should include root directory files');
    
    // Should not include node_modules
    assert(!('node_modules' in result), 'Should exclude node_modules');
    
    // Should not include .env and package-lock.json
    assert(!('.env' in result['']), 'Should exclude .env file');
    assert(!('package-lock.json' in result['']), 'Should exclude package-lock.json');
    
    // Should include allowed files but without content
    assert('test.js' in result['src'], 'Should include .js files');
    assert('test.py' in result['src'], 'Should include .py files');
    assert('test.tsx' in result['src'], 'Should include .tsx files');
    assert('data.json' in result['src'], 'Should include .json files');
    
    // Files should not have content when readFiles is false
    assert(!result['src']['test.js'].content, 'Should not have content when readFiles is false');
  });

  // Test 2: scanProject with reading files
  test('scanProject should read file contents when readFiles is true', () => {
    const result = scanProject(tempDir, true);
    
    // Should have content for allowed extensions
    assert(result['src']['test.js'].content === 'console.log("hello");', 'Should read .js file content');
    assert(result['src']['test.py'].content === 'print("hello")', 'Should read .py file content');
    assert(result['src']['test.tsx'].content === 'export default function() {}', 'Should read .tsx file content');
    assert(result['src']['data.json'].content === '{"test": true}', 'Should read .json file content');
    
    // Should not read disallowed extensions
    assert(!result['src']['readme.txt'].content, 'Should not read .txt files');
  });

  // Test 3: readSelectedFile with allowed extension
  test('readSelectedFile should read allowed file extensions', () => {
    const testFile = path.join(tempDir, 'src', 'test.js');
    const result = readSelectedFile(testFile);
    
    assert(result === 'console.log("hello");', 'Should return file content for allowed extensions');
  });

  // Test 4: readSelectedFile with disallowed extension
  test('readSelectedFile should reject disallowed file extensions', () => {
    const testFile = path.join(tempDir, 'src', 'readme.txt');
    const result = readSelectedFile(testFile);
    
    assert(result.includes('not allowed'), 'Should return error message for disallowed extensions');
  });

  // Test 5: readSelectedFile with non-existent file
  test('readSelectedFile should handle non-existent files', () => {
    const testFile = path.join(tempDir, 'nonexistent.js');
    const result = readSelectedFile(testFile);
    
    assert(result.includes('Error reading file'), 'Should return error message for non-existent files');
  });

  // Test 6: analyzeContent function (without API call)
  asyncTest('analyzeContent should handle content analysis', async () => {
    // Mock the OpenAI API to avoid actual API calls
    const originalEnv = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    try {
      await analyzeContent('test content');
      assert(false, 'Should throw error when API key is missing');
    } catch (error) {
      assert(error.message.includes('OPENAI_API_KEY'), 'Should throw API key error');
    }
    
    // Restore environment
    if (originalEnv) {
      process.env.OPENAI_API_KEY = originalEnv;
    }
  });

  // Test 7: analyzeProject function (without API call)
  asyncTest('analyzeProject should handle project analysis', async () => {
    const originalEnv = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    
    try {
      await analyzeProject({});
      assert(false, 'Should throw error when API key is missing');
    } catch (error) {
      assert(error.message.includes('OPENAI_API_KEY'), 'Should throw API key error');
    }
    
    // Restore environment
    if (originalEnv) {
      process.env.OPENAI_API_KEY = originalEnv;
    }
  });

  // Test 8: CLI argument parsing simulation
  test('CLI should have proper structure', () => {
    // Test that the main CLI file exports are accessible
    assert(typeof scanProject === 'function', 'scanProject should be a function');
    assert(typeof readSelectedFile === 'function', 'readSelectedFile should be a function');
    assert(typeof analyzeContent === 'function', 'analyzeContent should be a function');
    assert(typeof analyzeProject === 'function', 'analyzeProject should be a function');
  });

  // Cleanup
  cleanupTempDir();

  // Results
  console.log('Test Results:');
  console.log(`✅ Passed: ${testsPassed}/${testsTotal}`);
  console.log(`❌ Failed: ${testsTotal - testsPassed}/${testsTotal}`);
  
  if (testsPassed === testsTotal) {
    console.log('All tests passed!');
    return 0;
  } else {
    console.log('Some tests failed.');
    return 1;
  }
}

// Run tests
runTests().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});