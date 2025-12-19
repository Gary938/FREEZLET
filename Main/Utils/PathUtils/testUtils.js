/**
 * Forms path to merged test in special MERGE category
 * @param {string} fileName - File name or full path
 * @returns {string} - Full path to file in MERGE directory
 * @throws {Error} - If fileName contains path traversal characters
 */
export function getMergeTestPath(fileName) {
  // Check for path traversal
  if (fileName.includes('..')) {
    throw new Error('Invalid file name: contains ".."');
  }

  // If path already contains Tests/MERGE, return as is
  if (fileName.includes('Tests/MERGE')) {
    return fileName;
  }

  // Otherwise form path in MERGE directory
  return `Tests/MERGE/${fileName}`;
}
