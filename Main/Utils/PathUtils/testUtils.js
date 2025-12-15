/**
 * Forms path to merged test in special MERGE category
 * @param {string} fileName - File name or full path
 * @returns {string} - Full path to file in MERGE directory
 */
export function getMergeTestPath(fileName) {
  // If path already contains Tests/MERGE, return as is
  if (fileName.includes('Tests/MERGE')) {
    return fileName;
  }

  // Otherwise form path in MERGE directory
  return `Tests/MERGE/${fileName}`;
}
