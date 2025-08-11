import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🧪 Running Integration Tests...\n');

async function runTests() {
  let testsPassed = 0;
  let testsTotal = 0;

  function runCommand(command, args = []) {
    return new Promise((resolve) => {
      const child = spawn('node', [command, ...args], {
        cwd: process.cwd(),
        stdio: 'pipe'
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          code,
          stdout,
          stderr
        });
      });
    });
  }

  async function test(name, testFn) {
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

  // Test 1: CLI should run without arguments (project scan)
  await test('CLI should run project scan without arguments', async () => {
    const result = await runCommand('src/cli.mjs');
    
    // Should contain project structure output
    if (!result.stdout.includes('Project Structure')) {
      throw new Error('Output should contain "Project Structure"');
    }
    
    // Should show JSON structure
    if (!result.stdout.includes('{')) {
      throw new Error('Output should contain JSON structure');
    }
    
    // Should attempt OpenAI analysis (will fail due to quota but that's expected)
    if (!result.stdout.includes('Analyzing Project Structure')) {
      throw new Error('Output should contain "Analyzing Project Structure"');
    }
  });

  // Test 2: CLI should handle --file argument
  await test('CLI should handle --file argument', async () => {
    const result = await runCommand('src/cli.mjs', ['--file', 'package.json']);
    
    // Should show file content
    if (!result.stdout.includes('Reading file: package.json')) {
      throw new Error('Output should show file reading message');
    }
    
    // Should contain package.json content
    if (!result.stdout.includes('"scan_project"')) {
      throw new Error('Output should contain package.json content');
    }
  });

  // Test 3: CLI should handle --model argument
  await test('CLI should handle --model argument', async () => {
    const result = await runCommand('src/cli.mjs', ['--file', 'package.json', '--model', 'gpt-3.5-turbo']);
    
    // Should run without errors related to model argument parsing
    if (!result.stdout.includes('Reading file: package.json')) {
      throw new Error('Should process file even with model argument');
    }
  });

  // Test 4: CLI should handle --prompt argument
  await test('CLI should handle --prompt argument', async () => {
    const result = await runCommand('src/cli.mjs', ['--file', 'package.json', '--prompt', 'Analyze this package file']);
    
    // Should run without errors related to prompt argument parsing
    if (!result.stdout.includes('Reading file: package.json')) {
      throw new Error('Should process file even with prompt argument');
    }
  });

  // Test 5: CLI should handle --read flag
  await test('CLI should handle --read flag', async () => {
    const result = await runCommand('src/cli.mjs', ['--read']);
    
    // Should contain project structure with file contents
    if (!result.stdout.includes('Project Structure')) {
      throw new Error('Output should contain "Project Structure"');
    }
  });

  // Test 6: CLI should handle invalid file
  await test('CLI should handle invalid file gracefully', async () => {
    const result = await runCommand('src/cli.mjs', ['--file', 'nonexistent.js']);
    
    // Should show error message
    if (!result.stdout.includes('Error reading file')) {
      throw new Error('Output should contain error message for invalid file');
    }
  });

  // Test 7: CLI should handle disallowed file extension
  await test('CLI should handle disallowed file extension', async () => {
    // Create a temporary file with disallowed extension
    const tempFile = 'temp-test.txt';
    fs.writeFileSync(tempFile, 'test content');
    
    try {
      const result = await runCommand('src/cli.mjs', ['--file', tempFile]);
      
      // Should show error message about extension
      if (!result.stdout.includes('not allowed')) {
        throw new Error('Output should contain extension error message');
      }
    } finally {
      // Clean up
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  // Test 8: CLI should exit gracefully on various inputs
  await test('CLI should handle mixed arguments', async () => {
    const result = await runCommand('src/cli.mjs', ['--read', '--model', 'gpt-4o-mini']);
    
    // Should process without crashing
    if (result.code !== 0 && !result.stdout.includes('Project Structure')) {
      throw new Error('CLI should handle mixed arguments without crashing');
    }
  });

  // Results
  console.log('📊 Integration Test Results:');
  console.log(`✅ Passed: ${testsPassed}/${testsTotal}`);
  console.log(`❌ Failed: ${testsTotal - testsPassed}/${testsTotal}`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 All integration tests passed!');
    return 0;
  } else {
    console.log('⚠️  Some integration tests failed.');
    return 1;
  }
}

// Run tests
runTests().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Integration test runner error:', error);
  process.exit(1);
});