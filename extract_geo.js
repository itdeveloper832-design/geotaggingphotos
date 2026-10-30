const fs = require('fs');

function parseLine(line) {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
            inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
        } else {
            cur += c;
        }
    }
    result.push(cur.trim());
    return result;
}

function getRows(filename) {
    return fs.readFileSync(filename, 'utf-8')
        .split(/\r?\n/)
        .filter(l => l.trim().length > 0)
        .slice(1)
        .map(l => {
            const c = parseLine(l);
            return {
                kw: c[0] || '',
                found: c[2] || '',
                vol: parseInt(c[3]) || 0,
                score: c[6] || '',
                cpc: c[8] || ''
            };
        });
}

const comp = getRows('onlycompatitorhaveunot.csv');
const both = getRows('youbothhave.csv');
const you = getRows('onlyyourkeywords.csv');

console.log('=== COMPETITOR GEO / SEO / LOCAL / LOCATION KEYWORDS ===');
const compGeo = comp.filter(x => /geo|gps|exif|locat|map|coord|lat|tag|gmb|local|seo|photo|image/i.test(x.kw));
console.log('Total comp matches:', compGeo.length);
compGeo.sort((a,b) => b.vol - a.vol).slice(0, 50).forEach(x => {
    console.log(`${x.kw.padEnd(45)} | Vol: ${String(x.vol).padEnd(6)} | Comp: ${x.found}`);
});

console.log('\n=== CHECKING ALL MENTIONS OF GEOTAG / GPS / EXIF / LOCATION IN COMP ===');
const pureGeo = comp.filter(x => /geo|gps|exif|locat|coord/i.test(x.kw));
console.log('Total pure geo in competitor:', pureGeo.length);
pureGeo.forEach(x => {
    console.log(`${x.kw.padEnd(45)} | Vol: ${String(x.vol).padEnd(6)} | Comp: ${x.found}`);
});
