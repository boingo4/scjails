function parseCSV(csv) {
    const rows = [];
    let current = '';
    let row = [];
    let inQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const ch = csv[i];
        const next = csv[i + 1];

        if (ch === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
        } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
            if (ch === '\r' && next === '\n') {
                i++;
            }
            row.push(current.trim());
            rows.push(row);
            row = [];
            current = '';
        } else {
            current += ch;
        }
    }

    if (current.length > 0 || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
    }

    return rows.map(r => r.map(cell => cell.replace(/^"|"$/g, '').trim()));
}

function fetchSheetCSV(url) {
    return fetch(url, { method: 'GET', mode: 'cors' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            return response.text();
        });
}

function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function safeHttpUrl(value) {
    if (!value) return '';
    try {
        const raw = String(value).trim();
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
        return '';
    }
}

function extractDomain(url) {
    if (!url) return '';
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

function providerAnchor(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function initMobileNav() {
    const navList = document.querySelector('nav ul');
    const toggle = document.querySelector('.menu-toggle');
    if (!navList || !toggle) return;

    toggle.addEventListener('click', () => {
        navList.classList.toggle('nav-active');
    });

    function update() {
        if (window.innerWidth > 768) {
            navList.classList.add('nav-active');
        } else {
            navList.classList.remove('nav-active');
        }
    }

    window.addEventListener('resize', update);
    update();
}

document.addEventListener('DOMContentLoaded', initMobileNav);
