const fs = require('fs');

let file = 'resources/css/app.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/rgba\(157,\s*229,\s*0,\s*([0-9.]+)\)/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return `color-mix(in srgb, var(--color-primary) ${percent}%, transparent)`;
});

content = content.replace(/rgba\(126,\s*192,\s*0,\s*([0-9.]+)\)/g, (match, p1) => {
    let percent = Math.round(parseFloat(p1) * 100);
    return `color-mix(in srgb, var(--color-primary-dark) ${percent}%, transparent)`;
});

fs.writeFileSync(file, content);
console.log('Updated app.css');
