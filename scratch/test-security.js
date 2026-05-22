const http = require('http');

function makeRequest(options, postData = '') {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, data }));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function runSecurityTests() {
    console.log('--- Starting Security Tests ---');

    // Test 1: Access /admin/affiliate without cookie
    console.log('\n[Test 1] Accessing Admin Panel without Authentication');
    let res = await makeRequest({
        hostname: 'localhost', port: 3000, path: '/admin/affiliate', method: 'GET'
    });
    console.log(`Status: ${res.statusCode} (Expected: 302)`);
    console.log(`Redirect Location: ${res.headers.location} (Expected: /admin/login)`);
    if (res.statusCode !== 302 || res.headers.location !== '/admin/login') console.error('FAILED Test 1');
    else console.log('PASSED Test 1');

    // Test 2: Access /api/admin/payout/action without cookie
    console.log('\n[Test 2] Accessing Admin API without Authentication');
    res = await makeRequest({
        hostname: 'localhost', port: 3000, path: '/api/admin/payout/action', method: 'POST'
    });
    console.log(`Status: ${res.statusCode} (Expected: 401)`);
    if (res.statusCode !== 401) console.error('FAILED Test 2');
    else console.log('PASSED Test 2');

    // Test 3: Access /api/affiliate/payout-request with spoofed affiliateId
    console.log('\n[Test 3] Payout Request with Spoofed Affiliate ID');
    const postData = JSON.stringify({ affiliateId: 'aff_hacker123', amount: 100000 });
    res = await makeRequest({
        hostname: 'localhost', port: 3000, path: '/api/affiliate/payout-request', method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'Cookie': 'vokasi_dashboard_code=BUDITEST'
        }
    }, postData);
    console.log(`Status: ${res.statusCode} (Expected: 403)`);
    console.log(`Response Data: ${res.data}`);
    if (res.statusCode !== 403) console.error('FAILED Test 3');
    else console.log('PASSED Test 3');

    console.log('\n--- Security Tests Complete ---');
}

runSecurityTests();
