// copy-component-files.js (simplified version that includes all app files)
const fs = require('fs');
const path = require('path');

const componentDir = './components';
const appDir = './app';
const outputFile = 'portfolio-code.txt';

// Additional files to include
const additionalFiles = [
  'package.json',
  // 'tsconfig.json',  // Uncomment if you want to include
  // 'next.config.js', // Uncomment if you want to include
  // '.env.local'      // BE CAREFUL with sensitive files!
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠️ Directory not found: ${dirPath}`);
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Optional: Filter out certain file types or folders
      // Skip node_modules, .next, etc. if they somehow appear
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function getExistingFiles(filePaths) {
  return filePaths.filter(filePath => {
    if (fs.existsSync(filePath)) {
      return true;
    } else {
      console.warn(`⚠️ File not found: ${filePath}`);
      return false;
    }
  });
}

try {
  // Get all component files
  const componentFiles = getAllFiles(componentDir);
  
  // Get all app files (any .tsx, .jsx, .ts, .js, .css files)
  const allAppFiles = getAllFiles(appDir);
  const appFiles = allAppFiles.filter(file => 
    file.match(/\.(tsx|jsx|ts|js|css|scss)$/)
  );
  
  // Get additional root files that exist
  const rootFiles = getExistingFiles(additionalFiles);
  
  // Combine all files
  const allFiles = [...componentFiles, ...appFiles, ...rootFiles];
  
  let output = '';
  
  // Add header information
  output += `${'='.repeat(80)}\n`;
  output += `CODE EXPORT - Generated on ${new Date().toLocaleString()}\n`;
  output += `Total files: ${allFiles.length}\n`;
  output += `${'='.repeat(80)}\n\n`;
  
  // Process each file
  allFiles.forEach((filePath) => {
    const relativePath = path.relative('.', filePath);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      output += `\n${'='.repeat(80)}\n`;
      output += `FILE: ${relativePath}\n`;
      output += `${'='.repeat(80)}\n\n`;
      output += content;
      output += '\n';
    } catch (err) {
      console.warn(`⚠️ Could not read file: ${relativePath}`);
    }
  });
  
  fs.writeFileSync(outputFile, output);
  console.log(`✅ Done! Copied ${allFiles.length} files to ${outputFile}`);
  console.log(`   📁 Components: ${componentFiles.length} files`);
  console.log(`   📁 App folder: ${appFiles.length} files`);
  console.log(`   📄 Root files: ${rootFiles.length} files`);
} catch (error) {
  console.error('❌ Error:', error.message);
}