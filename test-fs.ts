import fs from 'fs';
import path from 'path';

// Simple test to verify our file system logic works
const currentPath = process.cwd();
console.log('Current path:', currentPath);

try {
  const items = fs.readdirSync(currentPath, { withFileTypes: true });
  console.log('Files in current directory:');
  
  const fileItems = items.map(item => ({
    name: item.name,
    path: path.join(currentPath, item.name),
    isDirectory: item.isDirectory()
  })).sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });

  fileItems.forEach(item => {
    console.log(`${item.isDirectory ? '📁' : '📄'} ${item.name}`);
  });
} catch (error) {
  console.error('Error reading directory:', error);
}