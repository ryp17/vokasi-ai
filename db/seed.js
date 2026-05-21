const Database = require('./database');
const fs = require('fs');
const path = require('path');

// Reset referrals and payouts
fs.writeFileSync(path.join(__dirname, 'referrals.json'), JSON.stringify([], null, 2));
fs.writeFileSync(path.join(__dirname, 'payouts.json'), JSON.stringify([], null, 2));

console.log('Seeding referrals for Ahmad Faisal...');
const ahmadId = 'aff_ahmad';
const now = new Date();

// 8 sales for Ahmad
for (let i = 1; i <= 8; i++) {
  Database.createReferral({
    affiliateId: ahmadId,
    visitorIp: '182.253.140.22',
    leadEmail: `siswa_ahmad_${i}@gmail.com`,
    leadName: `Siswa Ahmad ${i}`,
    courseSlug: 'online-marketing-fundamental',
    courseTitle: 'Online Marketing Fundamental',
    amountPaid: 499000,
    commissionAmount: 109780 // 22% of 499k
  });
}

console.log('Seeding referrals for Siti Rahma...');
const sitiId = 'aff_siti';
// 52 sales for Siti
for (let i = 1; i <= 52; i++) {
  Database.createReferral({
    affiliateId: sitiId,
    visitorIp: `36.85.12.${10 + i}`,
    leadEmail: `mahasiswa_siti_${i}@ui.ac.id`,
    leadName: `Mahasiswa UI ${i}`,
    courseSlug: 'social-media-fundamental',
    courseTitle: 'Social Media Fundamental',
    amountPaid: 499000,
    commissionAmount: 149700 // 30% of 499k
  });
}

// Adjust status and dates to represent historical records
const refs = Database.getReferrals();
refs.forEach((r, idx) => {
  const isAhmad = r.affiliateId === ahmadId;
  const itemIdx = isAhmad ? idx : idx - 8;
  const isEscrow = isAhmad ? (itemIdx >= 6) : (itemIdx >= 48);
  
  if (isEscrow) {
    r.status = 'pending';
    r.createdAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    r.unlockedAt = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString();
  } else {
    r.status = 'approved';
    r.createdAt = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();
    r.unlockedAt = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
  }
});
fs.writeFileSync(path.join(__dirname, 'referrals.json'), JSON.stringify(refs, null, 2));

console.log('Seeding payouts...');
// Seed payouts for Ahmad
Database.createPayout({
  affiliateId: ahmadId,
  amount: 300000,
  payoutDetails: 'Bank Transfer - BCA - 8830129482'
});

const payouts = Database.getPayouts();
payouts[0].status = 'approved';
payouts[0].requestedAt = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
payouts[0].processedAt = new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString();

// Seed payouts for Siti
Database.createPayout({
  affiliateId: sitiId,
  amount: 2000000,
  payoutDetails: 'GoPay - 081234567890'
});
Database.createPayout({
  affiliateId: sitiId,
  amount: 1000000,
  payoutDetails: 'GoPay - 081234567890'
});

const payouts2 = Database.getPayouts();
payouts2[1].status = 'approved';
payouts2[1].requestedAt = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
payouts2[1].processedAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

payouts2[2].status = 'pending';
payouts2[2].requestedAt = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();

fs.writeFileSync(path.join(__dirname, 'payouts.json'), JSON.stringify(payouts2, null, 2));

console.log('✓ Seeding complete.');
