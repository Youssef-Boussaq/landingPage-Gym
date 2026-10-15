const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const exts = ['.js', '.jsx', '.ts', '.tsx', '.css'];
let files = [];
['resources/js', 'resources/css'].forEach(dir => {
    if (fs.existsSync(dir)) {
        files = files.concat(walkSync(dir));
    }
});

files = files.filter(f => exts.includes(path.extname(f)));

const colorMap = {
    '#9de500': 'var(--color-primary)',
    '#8cd000': 'var(--color-primary-hover)',
    '#7ec000': 'var(--color-primary-dark)',
    '#b8f526': 'var(--color-primary-light)'
};

let modifiedFiles = [];
let totalReplacements = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    for (const [hex, cssVar] of Object.entries(colorMap)) {
        // Tailwind classes with arbitrary values
        // We match [#9de500] and replace with [var(--color-primary)]
        let hexNoHash = hex.replace('#', '');
        
        // Match occurrences of [#hex] ignoring case
        let regexTailwind = new RegExp('\\\[#' + hexNoHash + '\\\]', 'gi');
        
        let matchesTailwind = content.match(regexTailwind);
        if (matchesTailwind) {
            totalReplacements += matchesTailwind.length;
            content = content.replace(regexTailwind, '[' + cssVar + ']');
        }
        
        // Match standalone occurrences of hex code (ignoring case)
        let regexHex = new RegExp(hex, 'gi');
        let matchesHex = content.match(regexHex);
        if (matchesHex) {
            totalReplacements += matchesHex.length;
            content = content.replace(regexHex, cssVar);
        }
    }

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        modifiedFiles.push(file);
    }
});

console.log(JSON.stringify({ modifiedFiles, totalReplacements }, null, 2));
