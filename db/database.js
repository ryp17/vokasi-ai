const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname);

// Ensure the directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const FILES = {
  affiliates: path.join(DB_DIR, 'affiliates.json'),
  referrals: path.join(DB_DIR, 'referrals.json'),
  payouts: path.join(DB_DIR, 'payouts.json'),
  clicks: path.join(DB_DIR, 'clicks.json')
};

// Initialize database files with empty arrays if they don't exist
Object.entries(FILES).forEach(([key, filepath]) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([], null, 2), 'utf8');
  }
});

// Helper: Safely read file
function readData(table) {
  try {
    const content = fs.readFileSync(FILES[table], 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${table} database:`, error);
    return [];
  }
}

// Helper: Safely write file
function writeData(table, data) {
  try {
    fs.writeFileSync(FILES[table], JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${table} database:`, error);
    return false;
  }
}

// Dynamic Tier & Commission Rules
const TIERS = {
  RINTISAN: { name: 'Rintisan', minSales: 0, commissionRate: 0.20, label: 'Base Partner' },
  TERAMPIL: { name: 'Terampil', minSales: 6, commissionRate: 0.22, label: 'Pro Partner (Unlocks Vokasi Bomber Jacket)' },
  AHLI: { name: 'Ahli', minSales: 21, commissionRate: 0.25, label: 'Master Partner (Unlocks Advisor Badge)' },
  MAESTRO: { name: 'Maestro', minSales: 51, commissionRate: 0.30, label: 'Elite Ambassador (Unlocks Sponsorship Token)' }
};

function getTierForSales(salesCount) {
  if (salesCount >= TIERS.MAESTRO.minSales) return TIERS.MAESTRO;
  if (salesCount >= TIERS.AHLI.minSales) return TIERS.AHLI;
  if (salesCount >= TIERS.TERAMPIL.minSales) return TIERS.TERAMPIL;
  return TIERS.RINTISAN;
}

const Database = {
  // --- AFFILIATES TABLE ---
  getAffiliates() {
    return readData('affiliates');
  },

  getAffiliateById(id) {
    return this.getAffiliates().find(a => a.id === id);
  },

  getAffiliateByEmail(email) {
    return this.getAffiliates().find(a => a.email.toLowerCase() === email.toLowerCase());
  },

  getAffiliateByCode(code) {
    if (!code) return null;
    return this.getAffiliates().find(a => a.referralCode.toUpperCase() === code.toUpperCase());
  },

  createAffiliate(affiliateData) {
    const affiliates = this.getAffiliates();
    
    // Check duplicates
    const emailExists = affiliates.some(a => a.email.toLowerCase() === affiliateData.email.toLowerCase());
    const codeExists = affiliates.some(a => a.referralCode.toUpperCase() === affiliateData.referralCode.toUpperCase());
    
    if (emailExists) throw new Error('Email sudah terdaftar.');
    if (codeExists) throw new Error('Kode referal sudah digunakan orang lain.');

    const newAffiliate = {
      id: 'aff_' + Math.random().toString(36).substr(2, 9),
      name: affiliateData.name,
      email: affiliateData.email,
      status: 'pending', // pending, approved, suspended
      paymentMethod: affiliateData.paymentMethod || 'GoPay',
      paymentAccount: affiliateData.paymentAccount || '',
      referralCode: affiliateData.referralCode.toUpperCase(),
      gotongRoyongGroup: affiliateData.gotongRoyongGroup || 'Umum',
      clicks: 0,
      createdAt: new Date().toISOString()
    };

    affiliates.push(newAffiliate);
    writeData('affiliates', affiliates);
    return newAffiliate;
  },

  updateAffiliateStatus(id, status) {
    const affiliates = this.getAffiliates();
    const idx = affiliates.findIndex(a => a.id === id);
    if (idx === -1) return null;
    
    affiliates[idx].status = status;
    writeData('affiliates', affiliates);
    return affiliates[idx];
  },

  // --- CLICKS TABLE ---
  getClicks() {
    return readData('clicks');
  },

  logClick(code, visitorUuid, ip, userAgent) {
    const affiliates = this.getAffiliates();
    const idx = affiliates.findIndex(a => a.referralCode.toUpperCase() === code.toUpperCase());
    if (idx === -1) return false;

    const affiliateId = affiliates[idx].id;
    const clicks = this.getClicks();
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check for duplicate in the last 24 hours
    const isDuplicate = clicks.some(c => {
      if (c.affiliateId !== affiliateId) return false;
      const clickTime = new Date(c.createdAt);
      if (clickTime < twentyFourHoursAgo) return false;
      
      // Match by exact UUID or by IP + UserAgent fingerprint
      if (visitorUuid && c.visitorUuid === visitorUuid) return true;
      if (ip && userAgent && c.ip === ip && c.userAgent === userAgent) return true;
      
      return false;
    });

    // Record the hit regardless for audit
    const newClick = {
      id: 'clk_' + Math.random().toString(36).substr(2, 9),
      affiliateId,
      visitorUuid: visitorUuid || '',
      ip: ip || '',
      userAgent: userAgent || '',
      isUnique: !isDuplicate,
      createdAt: now.toISOString()
    };
    clicks.push(newClick);
    writeData('clicks', clicks);

    // Only increment stats if unique
    if (!isDuplicate) {
      affiliates[idx].clicks = (affiliates[idx].clicks || 0) + 1;
      writeData('affiliates', affiliates);
    }

    return !isDuplicate;
  },

  // --- REFERRALS TABLE ---
  getReferrals() {
    return readData('referrals');
  },

  getReferralsByAffiliate(affiliateId) {
    return this.getReferrals().filter(r => r.affiliateId === affiliateId);
  },

  createReferral(referralData) {
    const referrals = this.getReferrals();
    
    // 14-day escrow hold date
    const now = new Date();
    const unlockDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const newReferral = {
      id: 'ref_' + Math.random().toString(36).substr(2, 9),
      affiliateId: referralData.affiliateId,
      visitorIp: referralData.visitorIp || '',
      leadEmail: referralData.leadEmail,
      leadName: referralData.leadName || '',
      courseSlug: referralData.courseSlug,
      courseTitle: referralData.courseTitle || '',
      amountPaid: referralData.amountPaid || 0,
      commissionAmount: referralData.commissionAmount || 0,
      status: 'pending', // pending, approved, refunded
      createdAt: now.toISOString(),
      unlockedAt: unlockDate.toISOString()
    };

    referrals.push(newReferral);
    writeData('referrals', referrals);
    return newReferral;
  },

  updateReferralStatus(id, status) {
    const referrals = this.getReferrals();
    const idx = referrals.findIndex(r => r.id === id);
    if (idx === -1) return null;
    
    referrals[idx].status = status;
    writeData('referrals', referrals);
    return referrals[idx];
  },

  // --- PAYOUTS TABLE ---
  getPayouts() {
    return readData('payouts');
  },

  getPayoutsByAffiliate(affiliateId) {
    return this.getPayouts().filter(p => p.affiliateId === affiliateId);
  },

  createPayout(payoutData) {
    const payouts = this.getPayouts();
    const newPayout = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      affiliateId: payoutData.affiliateId,
      amount: payoutData.amount,
      status: 'pending', // pending, approved, rejected
      payoutDetails: payoutData.payoutDetails,
      requestedAt: new Date().toISOString(),
      processedAt: null
    };

    payouts.push(newPayout);
    writeData('payouts', payouts);
    return newPayout;
  },

  updatePayoutStatus(id, status) {
    const payouts = this.getPayouts();
    const idx = payouts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    payouts[idx].status = status;
    payouts[idx].processedAt = new Date().toISOString();
    writeData('payouts', payouts);
    return payouts[idx];
  },

  // --- ANALYTICS / STATS ---
  getAffiliateStats(affiliateId) {
    const affiliate = this.getAffiliateById(affiliateId);
    if (!affiliate) return null;

    const referrals = this.getReferralsByAffiliate(affiliateId);
    const payouts = this.getPayoutsByAffiliate(affiliateId);

    const approvedSales = referrals.filter(r => r.status === 'approved');
    const pendingSales = referrals.filter(r => r.status === 'pending');
    
    const salesCount = approvedSales.length + pendingSales.length; // Count both for tier progression
    const currentTierInfo = getTierForSales(salesCount);

    // Calculate next tier target
    let nextTierInfo = null;
    if (currentTierInfo.name === 'Rintisan') nextTierInfo = TIERS.TERAMPIL;
    else if (currentTierInfo.name === 'Terampil') nextTierInfo = TIERS.AHLI;
    else if (currentTierInfo.name === 'Ahli') nextTierInfo = TIERS.MAESTRO;

    const totalEarned = referrals
      .filter(r => r.status !== 'refunded')
      .reduce((sum, r) => sum + r.commissionAmount, 0);

    const totalPaid = payouts
      .filter(p => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayout = payouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    // Available balance = total approved conversions that have passed escrow, minus already requested/paid payouts
    const now = new Date();
    const clearedCommissions = referrals
      .filter(r => r.status === 'approved' || (r.status === 'pending' && new Date(r.unlockedAt) <= now))
      .reduce((sum, r) => sum + r.commissionAmount, 0);

    const availableBalance = clearedCommissions - totalPaid - pendingPayout;

    // Gotong Royong Pool progress (for Group)
    const allReferrals = this.getReferrals();
    const groupReferralsCount = allReferrals
      .filter(r => {
        const aff = this.getAffiliateById(r.affiliateId);
        return aff && aff.gotongRoyongGroup === affiliate.gotongRoyongGroup;
      }).length;

    return {
      clicks: affiliate.clicks || 0,
      totalSalesCount: salesCount,
      approvedSalesCount: approvedSales.length,
      pendingSalesCount: pendingSales.length,
      currentTier: currentTierInfo.name,
      currentCommissionRate: currentTierInfo.commissionRate,
      tierLabel: currentTierInfo.label,
      nextTier: nextTierInfo,
      totalEarned,
      totalPaid,
      pendingPayout,
      availableBalance: Math.max(0, availableBalance),
      groupName: affiliate.gotongRoyongGroup,
      groupSalesCount: groupReferralsCount,
      groupTargetSales: 50 // Standard community goal
    };
  }
};

module.exports = Database;
