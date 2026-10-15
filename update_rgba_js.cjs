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

const exts = ['.js', '.jsx', '.ts', '.tsx'];
let files = [];
if (fs.existsSync('resources/js')) {
    files = files.concat(walkSync('resources/js'));
}

files = files.filter(f => exts.includes(path.extname(f)));

let modifiedFiles = [];
let totalReplacements = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // We replace rgba(157, 229, 0, alpha) or rgba(157,229,0,alpha) with color-mix(in_srgb,var(--color-primary)_alpha%,transparent) inside tailwind classes (spaces replaced with _)
    // or standard color-mix with spaces if not inside [] tailwind class. Wait, it's easier to just assume they are in tailwind class if they are in JS and replace with _ .
    
    content = content.replace(/rgba\(157,\s*229,\s*0,\s*([0-9.]+)\)/g, (match, p1) => {
        let percent = Math.round(parseFloat(p1) * 100);
        totalReplacements++;
        return `color-mix(in_srgb,var(--color-primary)_${percent}%,transparent)`;
    });

    content = content.replace(/rgba\(126,\s*192,\s*0,\s*([0-9.]+)\)/g, (match, p1) => {
        let percent = Math.round(parseFloat(p1) * 100);
        totalReplacements++;
        return `color-mix(in_srgb,var(--color-primary-dark)_${percent}%,transparent)`;
    });
    
    // There are a few `rgba(157, 229, 0, ${alpha})` using string interpolation in OrderAmeexCard.jsx
    // So we can replace rgba(157, 229, 0, ${alpha}) with `color-mix(in srgb, var(--color-primary) calc(${alpha} * 100%), transparent)`
    content = content.replace(/rgba\(157,\s*229,\s*0,\s*\$\{([^}]+)\}\)/g, (match, p1) => {
        totalReplacements++;
        return `color-mix(in srgb, var(--color-primary) calc(\${${p1}} * 100%), transparent)`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        modifiedFiles.push(file);
    }
});

console.log(JSON.stringify({ modifiedFiles, totalReplacements }, null, 2));
