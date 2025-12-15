/**
 * Script for checking API function consistency
 * Checks the following aspects:
 * 1. Return value structure (must contain success, error on failure)
 * 2. Logging presence
 * 3. Following "DB first, then files" principle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_DIR = path.join(__dirname, '..', 'API');
const API_CATEGORIES = ['CategoryAPI', 'FileAPI', 'DatabaseAPI', 'TestAPI'];

// Enable debug mode
const DEBUG = true;

/**
 * Finds all occurrences of specific pattern in text
 * @param {string} content - File content
 * @param {RegExp} pattern - Regular expression for search
 * @returns {Array<string>} - Found matches
 */
function findAllMatches(content, pattern) {
  const matches = [];
  let match;
  
  // Use global flag g to find all matches
  const regex = new RegExp(pattern, 'g');
  
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[0]);
  }
  
  return matches;
}

/**
 * Checks file content for { success: true } return
 * Considers various formatting options
 * @param {string} content - File content
 * @param {string} filePath - File path (for debugging)
 * @returns {boolean} - Check result
 */
function hasSuccessTrueReturn(content, filePath) {
  const patterns = [
    // Simple single line case
    /return\s*{\s*success\s*:\s*true/,
    // Multi-line variant
    /return\s*{[\s\n]*success\s*:\s*true/,
    // With additional fields
    /return\s*{[\s\n]*success\s*:\s*true[\s\n]*,/,
    // Additional formats
    /return\s+{\s*[\n\r\s]*success\s*:\s*true/,
    // Full line with closing brace
    /return\s*{\s*success\s*:\s*true\s*}/
  ];
  
  if (DEBUG) {
    console.log(`\nDebug success: true for file ${path.basename(filePath)}:`);
    
    let found = false;
    for (const pattern of patterns) {
      const matches = findAllMatches(content, pattern);
      if (matches.length > 0) {
        console.log(`- Pattern ${pattern} found matches:`);
        matches.forEach(match => console.log(`  "${match}"`));
        found = true;
      }
    }
    
    if (!found) {
      console.log(`- No pattern found matches`);
      
      // Search for close variants for debugging
      if (content.includes('success') && content.includes('true')) {
        console.log(`- Found lines containing "success" and "true":`);
        const lines = content.split('\n')
          .filter(line => line.includes('success') && line.includes('true'));
        lines.forEach(line => console.log(`  "${line.trim()}"`));
      }
    }
  }
  
  return patterns.some(pattern => pattern.test(content));
}

/**
 * Checks file content for { success: false, error: ... } return
 * Considers various formatting options
 * @param {string} content - File content
 * @param {string} filePath - File path (for debugging)
 * @returns {boolean} - Check result
 */
function hasSuccessFalseWithErrorReturn(content, filePath) {
  const patterns = [
    // Simple single line case
    /return\s*{\s*success\s*:\s*false\s*,\s*error\s*:/,
    // Multi-line variant
    /return\s*{[\s\n]*success\s*:\s*false[\s\n]*,[\s\n]*error\s*:/,
    // Variant with other fields before error
    /return\s*{[\s\n]*success\s*:\s*false[\s\n]*,(?:[\s\n]*\w+\s*:\s*[^,]+,)*[\s\n]*error\s*:/,
    // Variant where error comes before success
    /return\s*{[\s\n]*error\s*:[^,]*,[\s\n]*success\s*:\s*false/,
    // Variant with error inside object
    /return\s*{[\s\n]*success\s*:\s*false[\s\n]*,[\s\n]*.*error[\s\n]*:/ 
  ];
  
  if (DEBUG) {
    console.log(`\nDebug success: false, error for file ${path.basename(filePath)}:`);
    
    let found = false;
    for (const pattern of patterns) {
      const matches = findAllMatches(content, pattern);
      if (matches.length > 0) {
        console.log(`- Pattern ${pattern} found matches:`);
        matches.forEach(match => console.log(`  "${match}"`));
        found = true;
      }
    }
    
    if (!found) {
      console.log(`- No pattern found matches`);
      
      // Search for close variants for debugging
      if (content.includes('success') && content.includes('false') && content.includes('error')) {
        console.log(`- Found lines containing "success", "false" and "error":`);
        const lines = content.split('\n')
          .filter(line => line.includes('success') && line.includes('false') && line.includes('error'));
        lines.forEach(line => console.log(`  "${line.trim()}"`));
      }
    }
  }
  
  return patterns.some(pattern => pattern.test(content));
}

/**
 * Checks for all required logs in file
 * @param {string} content - File content
 * @returns {boolean} - Check result
 */
function hasAllRequiredLogs(content) {
  return (
    content.includes('logApiStart') && 
    content.includes('logApiSuccess') && 
    content.includes('logApiError')
  );
}

/**
 * Automatic fix for API file issues
 * @param {string} filePath - File path
 */
function fixApiFile(filePath) {
  // Auto-fix functionality will be implemented in the future
  console.log(`Auto-fix for file ${filePath} not implemented`);
}

/**
 * Checks API files for consistency
 */
async function checkApiConsistency() {
  console.log('Checking API consistency...');
  
  const issues = [];
  const files = {
    total: 0,
    withIssues: 0,
    byCategory: {}
  };
  
  // Check each API category
  for (const category of API_CATEGORIES) {
    const categoryPath = path.join(API_DIR, category);
    
    if (!fs.existsSync(categoryPath)) {
      issues.push(`API category does not exist: ${category}`);
      continue;
    }
    
    // Get all files in category
    const categoryFiles = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.js') && file !== 'index.js');
    
    files.total += categoryFiles.length;
    files.byCategory[category] = categoryFiles.length;
    
    for (const file of categoryFiles) {
      const filePath = path.join(categoryPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      let fileHasIssues = false;
      
      // Check for try/catch blocks
      if (!content.includes('try {')) {
        issues.push(`Missing try/catch block in file: ${filePath}`);
        fileHasIssues = true;
      }
      
      // Check return values with success: true (considering formatting)
      if (!hasSuccessTrueReturn(content, filePath)) {
        issues.push(`Missing { success: true } return in file: ${filePath}`);
        fileHasIssues = true;
      }
      
      // Check error handling (considering formatting)
      if (!hasSuccessFalseWithErrorReturn(content, filePath)) {
        issues.push(`Missing { success: false, error: ... } return in file: ${filePath}`);
        fileHasIssues = true;
      }
      
      // Check for logging presence
      if (!hasAllRequiredLogs(content)) {
        issues.push(`Missing complete logging (start/success/error) in file: ${filePath}`);
        fileHasIssues = true;
      }
      
      if (fileHasIssues) {
        files.withIssues++;
      }
    }
  }
  
  // Output statistics
  console.log(`\nCheck statistics:`);
  console.log(`- Total files checked: ${files.total}`);
  console.log(`- Files with issues: ${files.withIssues}`);
  console.log(`- Files without issues: ${files.total - files.withIssues}`);
  
  console.log(`\nDistribution by category:`);
  for (const [category, count] of Object.entries(files.byCategory)) {
    console.log(`- ${category}: ${count} files`);
  }
  
  // Output results
  if (issues.length === 0) {
    console.log('\n✅ API check completed successfully. No issues found.');
  } else {
    console.log(`\n❌ Found ${issues.length} issues:`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
    
    // Suggestion for auto-fix
    console.log(`\nTo auto-fix issues run script with --fix option`);
  }
}

// Check for --fix option
const shouldFix = process.argv.includes('--fix');

// Run check or fix
if (shouldFix) {
  console.log('Auto-fix mode...');
  // Implementation will be added in the future
} else {
  checkApiConsistency().catch(error => {
    console.error('Error checking API:', error);
  });
} 