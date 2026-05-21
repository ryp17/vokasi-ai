const http = require('http');
const Database = require('../db/database');

async function sendClick(code, visitorUuid, userAgent) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ code, visitorUuid });
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/affiliate/click',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting Hardening Tests ---');
    
    // Create dummy affiliate
    try {
        Database.createAffiliate({
            name: 'Hardening Tester',
            email: 'test@hardening.com',
            referralCode: 'HARDENTEST',
            paymentMethod: 'GoPay',
            paymentAccount: '123'
        });
    } catch (e) {
        // Ignored if already exists
    }

    const testCode = 'HARDENTEST';
    const testUuid = 'v_test_' + Date.now();
    
    // Get initial clicks
    let aff = Database.getAffiliateByCode(testCode);
    const initialClicks = aff.clicks || 0;
    console.log(`Initial clicks: ${initialClicks}`);

    // Test 1: First valid click
    console.log('\n[Test 1] Valid Click (New UUID)');
    let res = await sendClick(testCode, testUuid, 'Mozilla/5.0');
    console.log('Response:', res);
    aff = Database.getAffiliateByCode(testCode);
    console.log(`Clicks after first valid click: ${aff.clicks} (Expected: ${initialClicks + 1})`);
    
    if (aff.clicks !== initialClicks + 1) console.error('FAILED Test 1');
    else console.log('PASSED Test 1');

    // Test 2: Duplicate click (Same UUID)
    console.log('\n[Test 2] Duplicate Click (Same UUID within 24h)');
    res = await sendClick(testCode, testUuid, 'Mozilla/5.0');
    console.log('Response:', res);
    aff = Database.getAffiliateByCode(testCode);
    console.log(`Clicks after duplicate hit: ${aff.clicks} (Expected: ${initialClicks + 1})`);
    
    if (aff.clicks !== initialClicks + 1) console.error('FAILED Test 2');
    else console.log('PASSED Test 2');

    // Test 3: Bot crawler click
    console.log('\n[Test 3] Bot Crawler Click (WhatsApp Bot)');
    res = await sendClick(testCode, 'v_bot_' + Date.now(), 'WhatsApp/2.21.19.21 A');
    console.log('Response:', res);
    aff = Database.getAffiliateByCode(testCode);
    console.log(`Clicks after bot hit: ${aff.clicks} (Expected: ${initialClicks + 1})`);
    
    if (aff.clicks !== initialClicks + 1) console.error('FAILED Test 3');
    else console.log('PASSED Test 3');

    console.log('\n--- Tests Complete ---');
}

runTests();
