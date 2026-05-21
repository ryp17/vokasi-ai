const express = require('express');
const path = require('path');
const Database = require('./db/database');

// Helpers for Affiliate Program
function getCookie(req, name) {
    const list = {};
    const rc = req.headers.cookie;
    if (rc) {
        rc.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts.length >= 2) {
                list[parts.shift().trim()] = decodeURI(parts.join('='));
            }
        });
    }
    return list[name];
}

function findCourseBySubjectOrSlug(input) {
    if (!input) return null;
    const lowerInput = input.toLowerCase();
    for (const [slug, course] of Object.entries(courseData)) {
        if (lowerInput.includes(slug) || lowerInput.includes(course.title.toLowerCase())) {
            return { slug, ...course };
        }
    }
    return {
        slug: 'online-marketing-fundamental',
        title: 'Online Marketing Fundamental',
        price: 'Rp 499.000'
    };
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make current path available to all views
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('pages/index', { pageTitle: 'Home | Vokasi.ai' });
});

app.get('/about', (req, res) => {
    res.render('pages/about', { pageTitle: 'About Us | Vokasi.ai' });
});

app.get('/contact', (req, res) => {
    res.render('pages/contact', { pageTitle: 'Contact Us | Vokasi.ai' });
});

app.get('/blog', (req, res) => {
    res.render('pages/blog', { pageTitle: 'Blog | Vokasi' });
});

app.get('/blog/:slug', (req, res) => {
    res.render('pages/blog-detail', { pageTitle: 'Artikel Blog | Vokasi.ai' });
});

app.get('/jalur-karir', (req, res) => {
    res.render('pages/jalur-karir', { pageTitle: 'Jalur Karir | Vokasi' });
});

app.get('/kursus-online', (req, res) => {
    res.render('pages/kursus-online', { pageTitle: 'Kursus Online | Vokasi' });
});

app.get('/cara-kerja', (req, res) => {
    res.render('pages/cara-kerja', { pageTitle: 'Cara Kerja | Vokasi.ai' });
});

app.get('/daftar', (req, res) => {
    res.render('pages/daftar', { pageTitle: 'Mulai Perjalanan Karirmu | Vokasi.ai' });
});

const courseData = {
    'online-marketing-fundamental': {
        title: 'Online Marketing Fundamental',
        isComingSoon: false,
        category: 'Marketing',
        description: 'Kuasai dasar-dasar pemasaran di era digital, mulai dari pemahaman konsumen hingga strategi konten yang tepat sasaran.',
        price: 'Rp 499.000',
        originalPrice: 'Rp 999.000',
        syllabus: [
            { title: 'Modul 1: Pengantar Digital Marketing', desc: 'Memahami lanskap pemasaran digital saat ini dan perilaku konsumen modern.' },
            { title: 'Modul 2: Content Strategy', desc: 'Cara membuat pilar konten yang relevan, engaging, dan mengkonversi.' },
            { title: 'Modul 3: SEO Basics', desc: 'Optimasi mesin pencari untuk meningkatkan visibilitas organik.' },
            { title: 'Modul 4: Analytics & Reporting', desc: 'Membaca metrik kesuksesan dan menghitung ROI kampanye Anda.' }
        ]
    },
    'social-media-fundamental': {
        title: 'Social Media Fundamental',
        isComingSoon: false,
        category: 'Marketing',
        description: 'Bangun audiens setia lewat konten sosial yang tepat. Pahami algoritma berbagai platform untuk meningkatkan interaksi.',
        price: 'Rp 499.000',
        originalPrice: 'Rp 999.000',
        syllabus: [
            { title: 'Modul 1: Social Media Landscape', desc: 'Karakteristik dan algoritma platform seperti Instagram, TikTok, dan LinkedIn.' },
            { title: 'Modul 2: Content Planning', desc: 'Menyusun kalender konten dan strategi distribusi.' },
            { title: 'Modul 3: Community Management', desc: 'Taktik membangun interaksi, membalas komentar, dan merawat loyalitas.' },
            { title: 'Modul 4: Social Media Ads Intro', desc: 'Pengenalan iklan berbayar (Boost post vs Ads Manager).' }
        ]
    },
    'cyber-security': {
        title: 'Cyber Security',
        isComingSoon: true,
        category: 'Technology',
        description: 'Amankan data dan sistem digital dari ancaman siber. Pahami mitigasi risiko, enkripsi, dan etika peretasan.',
        syllabus: [
            { title: 'Modul 1: Intro to Cyber Security', desc: 'Prinsip dasar keamanan informasi (CIA Triad).' },
            { title: 'Modul 2: Network Security', desc: 'Melindungi infrastruktur jaringan dan mendeteksi intrusi.' },
            { title: 'Modul 3: Penetration Testing', desc: 'Simulasi serangan siber yang etis (White-hat hacking).' }
        ]
    },
    'performance-marketing': {
        title: 'Performance Marketing',
        isComingSoon: true,
        category: 'Marketing',
        description: 'Optimasi kampanye iklan digital untuk metrik dan ROI yang maksimal.',
        syllabus: [
            { title: 'Modul 1: Meta Ads Mastery', desc: 'Strategi iklan tingkat lanjut di ekosistem Facebook & Instagram.' },
            { title: 'Modul 2: Google Ads & SEM', desc: 'Menguasai pencarian berbayar dan optimasi kata kunci.' },
            { title: 'Modul 3: Conversion Optimization', desc: 'A/B Testing dan taktik meningkatkan konversi landing page.' }
        ]
    },
    'blockchain-fundamental': {
        title: 'Blockchain Fundamental',
        isComingSoon: true,
        category: 'Technology',
        description: 'Pahami cara kerja Web3 dan teknologi terdesentralisasi, serta peluangnya di masa depan.',
        syllabus: [
            { title: 'Modul 1: Pengenalan Web3', desc: 'Evolusi internet, blockchain, dan konsep desentralisasi.' },
            { title: 'Modul 2: Smart Contracts', desc: 'Cara kerja kontrak pintar dan kegunaannya di jaringan Ethereum.' },
            { title: 'Modul 3: Decentralized Finance (DeFi)', desc: 'Mengenal ekosistem layanan keuangan tanpa perantara.' }
        ]
    },
    'product-management': {
        title: 'Product Management',
        isComingSoon: true,
        category: 'Product',
        description: 'Pelajari siklus hidup produk, riset pengguna, strategi produk, dan cara memimpin tim lintas fungsi.',
        syllabus: [
            { title: 'Modul 1: Product Strategy', desc: 'Mendefinisikan visi, misi, dan roadmap produk jangka panjang.' },
            { title: 'Modul 2: User Research & Empathy', desc: 'Melakukan wawancara pengguna dan membuat persona.' },
            { title: 'Modul 3: Agile & Sprint', desc: 'Metodologi pengembangan produk berbasis Scrum dan Kanban.' }
        ]
    }
};

app.get('/kursus/:slug', (req, res) => {
    const course = courseData[req.params.slug];
    if (!course) {
        return res.status(404).send('<h1>Kursus tidak ditemukan</h1><a href="/kursus-online">Kembali ke daftar kursus</a>');
    }
    res.render('pages/course-detail', { pageTitle: `${course.title} | Vokasi.ai`, course: course, slug: req.params.slug });
});

const fs = require('fs');
app.post('/api/apply', (req, res) => {
    console.log('Received application:', req.body);
    const dbPath = path.join(__dirname, 'leads.json');
    let leads = [];
    if (fs.existsSync(dbPath)) {
        leads = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    const newLead = { ...req.body, timestamp: new Date().toISOString() };
    leads.push(newLead);
    fs.writeFileSync(dbPath, JSON.stringify(leads, null, 2));

    // --- Affiliate Tracking Attribution ---
    try {
        const refCode = getCookie(req, 'vokasi_ref') || req.body.refCode || req.body.couponCode;
        if (refCode) {
            const affiliate = Database.getAffiliateByCode(refCode);
            if (affiliate && affiliate.status === 'approved') {
                const subjectOrProgram = req.body.subject || req.body.selectedProgram || '';
                const courseInfo = findCourseBySubjectOrSlug(subjectOrProgram);
                if (courseInfo) {
                    const priceNumber = parseInt(courseInfo.price.replace(/[^0-9]/g, ''), 10) || 499000;
                    const stats = Database.getAffiliateStats(affiliate.id);
                    const commissionAmount = Math.round(priceNumber * stats.currentCommissionRate);

                    Database.createReferral({
                        affiliateId: affiliate.id,
                        visitorIp: req.ip || req.headers['x-forwarded-for'] || '',
                        leadEmail: req.body.email || req.body.emailAddress || '',
                        leadName: req.body.name || req.body.fullName || '',
                        courseSlug: courseInfo.slug,
                        courseTitle: courseInfo.title,
                        amountPaid: priceNumber,
                        commissionAmount: commissionAmount
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error attributing affiliate lead:', err);
    }
    // --------------------------------------

    res.json({ success: true, message: 'Application received successfully.' });
});

// GET /affiliate - Landing page
app.get('/affiliate', (req, res) => {
    res.render('pages/affiliate-landing', { 
        pageTitle: 'Program Afiliasi Vokasi | Vokasi.ai',
        error: null,
        success: null 
    });
});

// POST /api/affiliate/register - Register a new affiliate
app.post('/api/affiliate/register', (req, res) => {
    try {
        const { name, email, referralCode, paymentMethod, paymentAccount, gotongRoyongGroup } = req.body;
        if (!name || !email || !referralCode) {
            return res.status(400).json({ success: false, error: 'Harap isi semua kolom wajib (Nama, Email, Kode Referal).' });
        }
        
        const newAff = Database.createAffiliate({
            name,
            email,
            referralCode,
            paymentMethod,
            paymentAccount,
            gotongRoyongGroup
        });
        
        res.json({ success: true, message: 'Pendaftaran berhasil! Akun Anda sedang ditinjau oleh tim Vokasi.', affiliate: newAff });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// POST /api/affiliate/click - Record affiliate link click
app.post('/api/affiliate/click', (req, res) => {
    const { code, visitorUuid } = req.body;
    
    // Bot & Crawler filtering
    const userAgent = req.headers['user-agent'] || '';
    const BOT_PATTERNS = [
        /bot/i, /crawler/i, /spider/i, /facebookexternalhit/i, 
        /whatsapp/i, /telegram/i, /slack/i, /twitter/i, /discord/i
    ];
    const isBot = BOT_PATTERNS.some(regex => regex.test(userAgent));
    
    if (isBot) {
        // Return 200 OK so bots/crawlers are satisfied, but do NOT log the click
        return res.json({ success: true, duplicate: true, botDetected: true });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

    if (code) {
        Database.logClick(code, visitorUuid, ip, userAgent);
        return res.json({ success: true });
    }
    res.status(400).json({ success: false, error: 'Missing code' });
});

// POST /api/affiliate/login - Simple email/code login for dashboard
app.post('/api/affiliate/login', (req, res) => {
    const { loginKey } = req.body;
    if (!loginKey) {
        return res.status(400).json({ success: false, error: 'Harap masukkan email atau kode referal.' });
    }
    
    let affiliate = Database.getAffiliateByEmail(loginKey);
    if (!affiliate) {
        affiliate = Database.getAffiliateByCode(loginKey);
    }
    
    if (!affiliate) {
        return res.status(404).json({ success: false, error: 'Akun tidak ditemukan. Harap daftar terlebih dahulu.' });
    }
    
    // Set cookie for quick login session (valid for 1 day)
    res.cookie('vokasi_dashboard_code', affiliate.referralCode, { maxAge: 24 * 60 * 60 * 1000, httpOnly: false });
    res.json({ success: true, referralCode: affiliate.referralCode });
});

// GET /affiliate/dashboard - Personal dashboard
app.get('/affiliate/dashboard', (req, res) => {
    const codeQuery = req.query.code;
    const cookieCode = getCookie(req, 'vokasi_dashboard_code');
    const code = codeQuery || cookieCode;
    
    if (!code) {
        return res.redirect('/affiliate?login=true');
    }
    
    const affiliate = Database.getAffiliateByCode(code);
    if (!affiliate) {
        res.clearCookie('vokasi_dashboard_code');
        return res.redirect('/affiliate?error=notfound');
    }
    
    const stats = Database.getAffiliateStats(affiliate.id);
    const referrals = Database.getReferralsByAffiliate(affiliate.id);
    const payouts = Database.getPayoutsByAffiliate(affiliate.id);
    
    res.render('pages/affiliator-dashboard', {
        pageTitle: `Dashboard Afiliasi - ${affiliate.name} | Vokasi.ai`,
        affiliate,
        stats,
        referrals,
        payouts
    });
});

// POST /api/affiliate/payout-request - Request payout
app.post('/api/affiliate/payout-request', (req, res) => {
    const { affiliateId, amount } = req.body;
    if (!affiliateId || !amount) {
        return res.status(400).json({ success: false, error: 'Parameter tidak lengkap.' });
    }
    
    const affiliate = Database.getAffiliateById(affiliateId);
    if (!affiliate) {
        return res.status(404).json({ success: false, error: 'Affiliate not found.' });
    }
    
    const stats = Database.getAffiliateStats(affiliateId);
    const requestAmount = parseInt(amount, 10);
    
    if (requestAmount <= 0) {
        return res.status(400).json({ success: false, error: 'Jumlah penarikan tidak valid.' });
    }
    if (requestAmount > stats.availableBalance) {
        return res.status(400).json({ success: false, error: 'Saldo tidak mencukupi.' });
    }
    
    Database.createPayout({
        affiliateId,
        amount: requestAmount,
        payoutDetails: `${affiliate.paymentMethod} - ${affiliate.paymentAccount}`
    });
    
    res.json({ success: true, message: 'Permintaan penarikan saldo berhasil dikirim.' });
});

// GET /admin/affiliate - Admin Dashboard
app.get('/admin/affiliate', (req, res) => {
    const affiliates = Database.getAffiliates();
    const referrals = Database.getReferrals();
    const payouts = Database.getPayouts();
    
    // Compute general analytics
    const totalClicks = affiliates.reduce((sum, a) => sum + (a.clicks || 0), 0);
    const totalConversions = referrals.length;
    const totalCommissionEscrow = referrals
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.commissionAmount, 0);
    const totalPayoutsPending = payouts
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
    const totalPayoutsApproved = payouts
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + p.amount, 0);
        
    res.render('pages/admin-dashboard', {
        pageTitle: 'Admin Affiliate Control | Vokasi.ai',
        affiliates,
        referrals,
        payouts,
        stats: {
            totalClicks,
            totalConversions,
            totalCommissionEscrow,
            totalPayoutsPending,
            totalPayoutsApproved
        }
    });
});

// POST /api/admin/affiliate/approve - Approve / Suspend Affiliate
app.post('/api/admin/affiliate/approve', (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing parameters.' });
    }
    
    const updated = Database.updateAffiliateStatus(id, status);
    if (!updated) {
        return res.status(404).json({ success: false, error: 'Affiliate not found.' });
    }
    
    res.json({ success: true });
});

// POST /api/admin/payout/action - Approve / Reject Payout
app.post('/api/admin/payout/action', (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing parameters.' });
    }
    
    const updated = Database.updatePayoutStatus(id, status);
    if (!updated) {
        return res.status(404).json({ success: false, error: 'Payout request not found.' });
    }
    
    res.json({ success: true });
});

// POST /api/admin/referral/status - Change referral status (fraud check)
app.post('/api/admin/referral/status', (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing parameters.' });
    }
    
    const updated = Database.updateReferralStatus(id, status);
    if (!updated) {
        return res.status(404).json({ success: false, error: 'Referral not found.' });
    }
    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Vokasi.ai server running on http://localhost:${PORT}`);
});
