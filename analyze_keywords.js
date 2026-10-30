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

function parseCSV(filename) {
    const text = fs.readFileSync(filename, 'utf-8');
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        if (cols.length >= 7) {
            const kw = cols[0];
            const onSite = cols[1];
            const foundOn = cols[2];
            const vol = parseInt(cols[3]) || 0;
            const trend = cols[4];
            const growth = cols[5];
            const seoScore = cols[6];
            const cpc = cols[8];
            rows.push({ kw, onSite, foundOn, vol, trend, growth, seoScore, cpc });
        }
    }
    return rows;
}

console.log('=== PARSING ALL 3 FILES ===');
const comp = parseCSV('onlycompatitorhaveunot.csv');
const both = parseCSV('youbothhave.csv');
const you = parseCSV('onlyyourkeywords.csv');

console.log(`Competitor Only Count: ${comp.length}`);
console.log(`Shared Keywords Count: ${both.length}`);
console.log(`Your Only Keywords Count: ${you.length}`);

console.log('\n================== GEOTAGGING & LOCATION KEYWORDS ==================');

const geoTerms = ['geo', 'gps', 'exif', 'locat', 'map', 'coord', 'lat', 'tag', 'gmb', 'local'];

function filterTerms(list) {
    return list.filter(item => geoTerms.some(t => item.kw.toLowerCase().includes(t)));
}

console.log('--- GEOTAG/LOCATION/EXIF IN ONLY COMPETITOR (TOP 40) ---');
filterTerms(comp).sort((a,b)=>b.vol-a.vol).slice(0, 40).forEach(x => {
    console.log(`${x.kw.padEnd(42)} | Vol: ${String(x.vol).padEnd(6)} | Comp: ${x.foundOn}`);
});

console.log('\n--- GEOTAG/LOCATION/EXIF IN SHARED ---');
filterTerms(both).sort((a,b)=>b.vol-a.vol).forEach(x => {
    console.log(`${x.kw.padEnd(42)} | Vol: ${String(x.vol).padEnd(6)} | Comp: ${x.foundOn}`);
});

console.log('\n--- GEOTAG/LOCATION/EXIF IN ONLY YOU ---');
filterTerms(you).sort((a,b)=>b.vol-a.vol).forEach(x => {
    console.log(`${x.kw.padEnd(42)} | Vol: ${String(x.vol).padEnd(6)}`);
});

console.log('\n================== CLUSTERING ALL COMPETITOR KEYWORDS ==================');
const clusters = {
    'Local SEO & GMB / Google Business': ['local', 'gmb', 'google', 'business', 'map', 'ranking', 'seo'],
    'Geotagging & GPS Coordinates': ['geotag', 'gps', 'coordinate', 'latitude', 'longitude', 'location tag', 'geocod'],
    'EXIF & Image Metadata': ['exif', 'metadata', 'meta data'],
    'Photo Editing & Modification': ['edit', 'editor', 'modify', 'retouch', 'filter', 'enhanc'],
    'Image Resizing & Compression': ['resize', 'compress', 'reduce size', 'dimension'],
    'Background Removal': ['background', 'remove bg', 'transparent'],
    'Bulk & Batch Processing': ['bulk', 'batch', 'multiple'],
    'Device / Platform (iPhone, Android, Mac, Windows)': ['iphone', 'android', 'phone', 'camera', 'ios', 'windows', 'mac', 'app'],
    'Download & Converters / Tools': ['download', 'convert', 'format', 'tool', 'online', 'free']
};

function clusterDataset(dataset, name) {
    console.log(`\n*** CLUSTER BREAKDOWN FOR ${name} ***`);
    const results = {};
    for (const c of Object.keys(clusters)) results[c] = [];
    results['Other / Uncategorized'] = [];

    dataset.forEach(item => {
        const kwLower = item.kw.toLowerCase();
        let matched = false;
        for (const [clusterName, patterns] of Object.entries(clusters)) {
            if (patterns.some(p => kwLower.includes(p))) {
                results[clusterName].push(item);
                matched = true;
                break;
            }
        }
        if (!matched) results['Other / Uncategorized'].push(item);
    });

    for (const [clusterName, items] of Object.entries(results)) {
        const totalVol = items.reduce((sum, i) => sum + i.vol, 0);
        console.log(`\n> [${clusterName}] - ${items.length} keywords | Total Search Volume: ${totalVol}`);
        items.sort((a,b) => b.vol - a.vol).slice(0, 10).forEach(i => {
            console.log(`    - ${i.kw.padEnd(38)} (Vol: ${i.vol})`);
        });
    }
}

clusterDataset(comp, 'COMPETITOR ONLY (GAPS)');
clusterDataset(both, 'SHARED KEYWORDS');
clusterDataset(you, 'YOUR UNIQUE KEYWORDS');

