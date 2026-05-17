const express = require('express');
const path = require('path');

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
    res.json({ success: true, message: 'Application received successfully.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Vokasi.ai server running on http://localhost:${PORT}`);
});
