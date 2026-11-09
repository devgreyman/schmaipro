// Helper to create distinctive SVG logo Data URIs for pre-configured schools
const createSchoolSvg = (bgColor, textColor, iconType, acronym) => {
  let iconSvg = '';
  switch (iconType) {
    case 'shield':
      iconSvg = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      break;
    case 'book':
      iconSvg = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      break;
    case 'cap':
      iconSvg = '<path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
      break;
    case 'atom':
      iconSvg = '<circle cx="12" cy="12" r="3" fill="' + textColor + '"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" fill="none" stroke="' + textColor + '" stroke-width="1.8"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" fill="none" stroke="' + textColor + '" stroke-width="1.8"/>';
      break;
    case 'pillar':
      iconSvg = '<path d="M4 22h16M4 2h16M7 6v12M12 6v12M17 6v12" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round"/>';
      break;
    case 'torch':
      iconSvg = '<path d="M9 12l2 9h2l2-9M8 7a4 4 0 0 1 8 0c0 3-4 5-4 5s-4-2-4-5z" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round"/>';
      break;
    case 'compass':
      iconSvg = '<circle cx="12" cy="12" r="10" fill="none" stroke="' + textColor + '" stroke-width="2"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="' + textColor + '"/>';
      break;
    default:
      iconSvg = '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="' + textColor + '" stroke-width="2" stroke-linecap="round"/>';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="grad_${acronym}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="${bgColor}dd" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="url(#grad_${acronym})" />
    <g transform="translate(26, 18) scale(2)">
      ${iconSvg}
    </g>
    <text x="50" y="85" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">${acronym}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};

// Initial Schools with accurate domains & logos
export const INITIAL_SCHOOLS = [
  {
    id: 'sch-unilag',
    name: 'University of Lagos (UNILAG)',
    domain: '@unilag.edu.ng',
    domains: ['@unilag.edu.ng', '@unilag.edu'],
    acronym: 'UNILAG',
    color: '#047857',
    logo: '/logos/unilag-logo.png',
    tagline: 'In Deed and in Truth • Akoka, Lagos',
    country: 'Nigeria',
    isDefault: false,
  },
  {
    id: 'sch-uniben',
    name: 'University of Benin (UNIBEN)',
    domain: '@uniben.edu',
    domains: ['@uniben.edu', '@uniben.edu.ng'],
    acronym: 'UNIBEN',
    color: '#6B21A8',
    logo: '/logos/uniben-logo.png',
    tagline: 'Knowledge and Excellence • Ugbowo, Benin City',
    country: 'Nigeria',
    isDefault: false,
  },
  {
    id: 'sch-1',
    name: 'School 1 International Academy',
    domain: '@school1.edu',
    acronym: 'SCH-1',
    color: '#2563EB',
    logo: createSchoolSvg('#2563EB', '#ffffff', 'cap', 'SCH1'),
    tagline: 'Excellence in Global Learning & Research',
    country: 'International',
    isDefault: true,
  },
  {
    id: 'sch-2',
    name: 'School 2 Polytechnic Institute',
    domain: '@school2.edu',
    acronym: 'SCH-2',
    color: '#059669',
    logo: createSchoolSvg('#059669', '#ffffff', 'atom', 'SCH2'),
    tagline: 'Applied Science & Technical Innovation',
    country: 'International',
    isDefault: false,
  },
  {
    id: 'sch-3',
    name: 'School 3 Metropolitan College',
    domain: '@school3.edu',
    acronym: 'SCH-3',
    color: '#7C3AED',
    logo: createSchoolSvg('#7C3AED', '#ffffff', 'book', 'SCH3'),
    tagline: 'Higher Education & Digital Arts',
    country: 'International',
    isDefault: false,
  },
  {
    id: 'sch-4',
    name: 'School 4 Science Academy',
    domain: '@school4.edu',
    acronym: 'SCH-4',
    color: '#DC2626',
    logo: createSchoolSvg('#DC2626', '#ffffff', 'shield', 'SCH4'),
    tagline: 'Leading Research & Experimental Discovery',
    country: 'International',
    isDefault: false,
  },
  {
    id: 'sch-5',
    name: 'School 5 Business & Law School',
    domain: '@school5.edu',
    acronym: 'SCH-5',
    color: '#D97706',
    logo: createSchoolSvg('#D97706', '#ffffff', 'pillar', 'SCH5'),
    tagline: 'Corporate Leadership & Jurisprudence',
    country: 'International',
    isDefault: false,
  },
  {
    id: 'sch-6',
    name: 'Stanford Collegiate University',
    domain: '@stanford.edu',
    acronym: 'STAN',
    color: '#8C1D40',
    logo: createSchoolSvg('#8C1D40', '#ffffff', 'shield', 'STAN'),
    tagline: 'Where Genius Meets Global Impact',
    country: 'United States',
    isDefault: false,
  },
  {
    id: 'sch-7',
    name: 'Massachusetts Tech Institute',
    domain: '@mit.edu',
    acronym: 'MIT',
    color: '#A31F34',
    logo: createSchoolSvg('#A31F34', '#ffffff', 'atom', 'MIT'),
    tagline: 'Mind and Hand for Tomorrow',
    country: 'United States',
    isDefault: false,
  },
  {
    id: 'sch-8',
    name: 'Harvard Collegiate Academy',
    domain: '@harvard.edu',
    acronym: 'HARV',
    color: '#A51C30',
    logo: createSchoolSvg('#A51C30', '#ffffff', 'book', 'HARV'),
    tagline: 'Veritas & Classical Scholarship',
    country: 'United States',
    isDefault: false,
  },
  {
    id: 'sch-9',
    name: 'Oxford Academic Institute',
    domain: '@oxford.ac.uk',
    acronym: 'OXF',
    color: '#002147',
    logo: createSchoolSvg('#002147', '#ffffff', 'pillar', 'OXF'),
    tagline: 'Dominus Illuminatio Mea',
    country: 'United Kingdom',
    isDefault: false,
  },
  {
    id: 'sch-10',
    name: 'Cambridge Collegiate College',
    domain: '@cam.ac.uk',
    acronym: 'CAM',
    color: '#0072CF',
    logo: createSchoolSvg('#0072CF', '#ffffff', 'compass', 'CAM'),
    tagline: 'Hinc Lucem et Pocula Sacra',
    country: 'United Kingdom',
    isDefault: false,
  },
  {
    id: 'sch-12',
    name: 'Toronto Institute of Technology',
    domain: '@utoronto.ca',
    acronym: 'UofT',
    color: '#002A5C',
    logo: createSchoolSvg('#002A5C', '#ffffff', 'torch', 'UofT'),
    tagline: 'Velut Arbor Aevo',
    country: 'Canada',
    isDefault: false,
  },
  {
    id: 'sch-13',
    name: 'Sydney National University',
    domain: '@sydney.edu.au',
    acronym: 'SYD',
    color: '#E65100',
    logo: createSchoolSvg('#E65100', '#ffffff', 'book', 'SYD'),
    tagline: 'Sidere Mens Eadem Mutato',
    country: 'Australia',
    isDefault: false,
  },
  {
    id: 'sch-14',
    name: 'Berkeley State University',
    domain: '@berkeley.edu',
    acronym: 'CAL',
    color: '#003262',
    logo: createSchoolSvg('#003262', '#ffffff', 'shield', 'CAL'),
    tagline: 'Fiat Lux • Let There Be Light',
    country: 'United States',
    isDefault: false,
  }
];

// Default classes generated for different academic tracks
export const INITIAL_CLASSES = [
  {
    id: 'cls-cs101',
    code: 'CS-101',
    name: 'Computer Science 101',
    department: 'Faculty of Computing & Information Tech',
    academicYear: '2025/2026',
    semester: '1st Semester',
    allowedDomain: '',
    description: 'Freshmen introductory course portal for programming fundamentals.',
    formTitle: 'Welcome Back',
    formPrompt: '',
    redirectUrl: '', // empty means redirect back to the class login page
    createdAt: '2026-09-15T09:00:00Z',
    isActive: true,
  },
  {
    id: 'cls-bio201',
    code: 'BIO-201',
    name: 'Cell Biology & Genetics',
    department: 'School of Biological Sciences',
    academicYear: '2025/2026',
    semester: '2nd Semester',
    allowedDomain: '',
    description: 'Sophomore biological research and classroom session portal.',
    formTitle: 'Welcome Back',
    formPrompt: '',
    redirectUrl: '',
    createdAt: '2026-10-01T10:30:00Z',
    isActive: true,
  },
  {
    id: 'cls-eng304',
    code: 'ENG-304',
    name: 'Mechanical Systems & Design',
    department: 'Faculty of Engineering',
    academicYear: '2025/2026',
    semester: '1st Semester',
    allowedDomain: '',
    description: 'Junior level engineering class portal and lab access.',
    formTitle: 'Welcome Back',
    formPrompt: '',
    redirectUrl: '',
    createdAt: '2026-10-20T14:15:00Z',
    isActive: true,
  }
];

// Initial notification emails added to receive student form data
export const INITIAL_NOTIFICATION_EMAILS = [
  {
    id: 'notif-1',
    email: 'admin.records@school.edu',
    label: 'Central Records Office',
    isPrimary: true,
    addedAt: '2026-09-01T08:00:00Z',
    active: true,
  },
  {
    id: 'notif-2',
    email: 'dean.academics@school.edu',
    label: 'Academic Affairs Dean',
    isPrimary: false,
    addedAt: '2026-09-10T11:20:00Z',
    active: true,
  }
];

// Initial captured student records (empty by default; populated as students sign in)
export const INITIAL_SUBMISSIONS = [];
