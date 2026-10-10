/**
 * Domain-aware Career Blueprint Synthesizer
 * Generates authentic, industry-standard 4-phase learning roadmaps,
 * skills trees, and career metadata for any custom profession.
 */

export function synthesizeCareerBlueprint(rawTitleOrCareer) {
  const title = typeof rawTitleOrCareer === 'string' 
    ? rawTitleOrCareer.trim() 
    : (rawTitleOrCareer?.title || 'Custom Track').trim();
  
  const t = title.toLowerCase();

  // 1. Fine Arts, Visual Arts, Painting, Sketching, Sculpting, Traditional Arts
  if (
    t.includes('fine art') || t.includes('art') || t.includes('paint') || 
    t.includes('draw') || t.includes('sketch') || t.includes('sculpt') || 
    t.includes('visual art') || t.includes('illustration')
  ) {
    return {
      title,
      cluster: 'CREATIVE & VISUAL ARTS',
      category: 'Creative & Visual Arts',
      icon: '🎨',
      color: '#f43f5e',
      glowColor: 'rgba(244,63,94,0.6)',
      tagline: 'Master traditional & contemporary visual arts from pencil to gallery',
      demand: 'High & Growing',
      avgSalary: '₹8–24 LPA',
      salaryRange: '₹8–24 LPA',
      growthRate: '+19%',
      avgMonths: 12,
      skills: [
        'Anatomical Perspective & Sketching',
        'Color Theory & Pigment Chemistry',
        'Medium Mastery (Oil, Acrylic & Watercolor)',
        'Composition & Chiaroscuro Lighting',
        'Contemporary Art History',
        'Gallery Curation & Exhibition Portfolio'
      ],
      radarStats: { math: 35, coding: 20, systems: 60, mlCore: 25, cloud: 30, product: 85 },
      roadmapPhases: [
        {
          phase: 'Visual Foundations & Anatomical Perspective',
          duration: '3 months',
          tasks: [
            'Line Weight Dynamics, Gesture & Sighting Techniques',
            '1-Point, 2-Point & 3-Point Architectural Perspective',
            'Human Skeletal & Muscle Anatomy for Life Drawing',
            'Tonal Value Scales, Core Shadows & Negative Space'
          ]
        },
        {
          phase: 'Pigments, Mediums & Color Chemistry',
          duration: '3 months',
          tasks: [
            'Color Wheels, Munsell System & Gamut Masking',
            'Oil Painting Techniques: Underpainting, Glazing & Impasto',
            'Acrylics, Gouache & Transparent Watercolor Washes',
            'Surface Preparation: Canvas Stretching, Gesso & Linen'
          ]
        },
        {
          phase: 'Conceptual Voice & Thematic Series',
          duration: '4 months',
          tasks: [
            'Defining a Distinct Conceptual Artistic Voice',
            'Art Movement Study: Impressionism to Neo-Expressionism',
            'Creating a Cohesive 10-Piece Thematic Exhibition Series',
            'Studio Peer Critiques & Written Artist Statements'
          ]
        },
        {
          phase: 'Exhibitions, Curation & Professional Launch',
          duration: '2 months',
          tasks: [
            'High-Resolution Art Archiving & Color-Correct Photography',
            'Building a Curated Digital Portfolio (ArtStation/Behance/Web)',
            'Submitting to Gallery Open Calls, Grants & Residencies',
            'Pricing Fine Art, Consignments & Limited Edition Print Sales'
          ]
        }
      ],
      resources: [
        { title: 'The Natural Way to Draw - Nicolaïdes', type: 'Book', url: 'https://archive.org' },
        { title: 'Color and Light - James Gurney', type: 'Guide', url: 'https://jamesgurney.com' },
        { title: 'MoMA: Modern Art & Ideas Program', type: 'Course', url: 'https://coursera.org' },
        { title: 'ArtStation & Behance Fine Art Showcase', type: 'Community', url: 'https://behance.net' }
      ]
    };
  }

  // 2. Design, Fashion, Interior, Animation, 3D, VFX
  if (
    t.includes('fashion') || t.includes('design') || t.includes('animat') || 
    t.includes('3d') || t.includes('interior') || t.includes('vfx') || t.includes('graphic')
  ) {
    return {
      title,
      cluster: 'DESIGN & VISUAL MEDIA',
      category: 'Design & Visual Media',
      icon: '✨',
      color: '#ec4899',
      glowColor: 'rgba(236,72,153,0.6)',
      tagline: 'Transform conceptual aesthetics into immersive visual experiences',
      demand: 'Very High',
      avgSalary: '₹10–30 LPA',
      salaryRange: '₹10–30 LPA',
      growthRate: '+24%',
      avgMonths: 10,
      skills: ['Visual Design Principles', 'Typography & Layout', 'Industry Digital Tools', 'Creative Concepting', 'Prototyping & Motion', 'Client Brief & Portfolio'],
      radarStats: { math: 40, coding: 45, systems: 70, mlCore: 35, cloud: 45, product: 90 },
      roadmapPhases: [
        {
          phase: 'Design Foundations & Aesthetic Sensibility',
          duration: '3 months',
          tasks: ['Visual Hierarchy, Grid Systems & Font Pairing', 'Color Psychology & Emotional Resonance', 'Concept Sketching & Digital Moodboards', 'Design History & Semiotics']
        },
        {
          phase: 'Creative Software Mastery & Vector Craft',
          duration: '3 months',
          tasks: ['Professional Suite Mastery (Figma/Adobe/Blender)', 'Vector & Raster Asset Production Pipelines', 'Interactive Prototyping & Motion Micro-interactions', 'Design Systems & Scalable Component Libraries']
        },
        {
          phase: 'Applied Projects & Complex Client Briefs',
          duration: '4 months',
          tasks: ['Executing 3 Multi-channel Real-world Case Studies', 'Cross-media Adaptation (Spatial, Print & Screen)', 'User Psychology & Accessibility (WCAG)', 'Iterative Feedback & Stakeholder Critique']
        },
        {
          phase: 'Portfolio Showcase, Pitching & Studio Launch',
          duration: '2 months',
          tasks: ['Curating a Case-Study Driven Portfolio', 'Personal Branding & Social Media Positioning', 'Pitching to Top Creative Studios & Agencies', 'Contracts, Licensing & Freelance Pricing Strategy']
        }
      ],
      resources: [
        { title: 'Interaction Design Foundation', type: 'Course', url: 'https://interaction-design.org' },
        { title: 'Dribbble & Behance Case Studies', type: 'Community', url: 'https://dribbble.com' },
        { title: 'Canva & Figma Design Academy', type: 'Tutorials', url: 'https://figma.com/resources' }
      ]
    };
  }

  // 3. Music, Audio, Sound Production, DJ
  if (t.includes('music') || t.includes('audio') || t.includes('sound') || t.includes('producer') || t.includes('singer')) {
    return {
      title,
      cluster: 'MUSIC & AUDIO ARTS',
      category: 'Music & Audio Arts',
      icon: '🎵',
      color: '#8b5cf6',
      glowColor: 'rgba(139,92,246,0.6)',
      tagline: 'Sculpt sonic landscapes from composition to spatial master',
      demand: 'High',
      avgSalary: '₹8–26 LPA',
      salaryRange: '₹8–26 LPA',
      growthRate: '+18%',
      avgMonths: 12,
      skills: ['Music Theory', 'DAW Production (Ableton/Logic)', 'Sound Synthesis', 'Mixing & EQ', 'Mastering (LUFS)', 'Distribution & Sync Licensing'],
      radarStats: { math: 50, coding: 35, systems: 75, mlCore: 30, cloud: 40, product: 80 },
      roadmapPhases: [
        {
          phase: 'Music Theory, Harmony & Ear Training',
          duration: '3 months',
          tasks: ['Scales, Intervals & Functional Chord Progressions', 'Rhythmic Meter, Polyrhythms & Groove', 'Critical Listening & Frequency Ear Training', 'MIDI Keyboard Performance Essentials']
        },
        {
          phase: 'DAW Engineering & Synthesizer Sound Design',
          duration: '3 months',
          tasks: ['DAW Architecture & Signal Flow (Ableton/Logic)', 'Subtractive, Wavetable & FM Sound Synthesis', 'Audio Recording Techniques & Vocal Pitch Editing', 'Sample Manipulation & Creative Granular Processing']
        },
        {
          phase: 'Mixing Dynamics, EQ & Spatial Polish',
          duration: '4 months',
          tasks: ['Gain Staging, Parametric EQ & Frequency Carving', 'Dynamic Compression, Sidechaining & Saturation', 'Reverb, Delay & Stereo Imaging Techniques', 'Stem Mastering & Loudness Optimization (LUFS Standards)']
        },
        {
          phase: 'EP Release, Sync Licensing & Live Show',
          duration: '2 months',
          tasks: ['Producing a 4-Track Cohesive EP Capstone', 'Digital Distribution & Spotify for Artists Pitching', 'Sync Licensing for Games, Commercials & Cinema', 'Live Performance Setup or Studio Client Roster']
        }
      ],
      resources: [
        { title: 'SoundGym Critical Listening Hub', type: 'Practice', url: 'https://soundgym.co' },
        { title: 'Berklee Online Production Resources', type: 'Course', url: 'https://online.berklee.edu' },
        { title: 'Tape Op Audio Journal', type: 'Articles', url: 'https://tapeop.com' }
      ]
    };
  }

  // 4. Robotics, Embedded Systems, IoT, Hardware, Drone Tech
  if (t.includes('robot') || t.includes('iot') || t.includes('embedded') || t.includes('hardware') || t.includes('drone')) {
    return {
      title,
      cluster: 'ROBOTICS & HARDWARE',
      category: 'Robotics & Hardware',
      icon: '🤖',
      color: '#06b6d4',
      glowColor: 'rgba(6,182,212,0.6)',
      tagline: 'Engineer intelligent physical machines combining circuits, code & kinematics',
      demand: 'Very High',
      avgSalary: '₹14–38 LPA',
      salaryRange: '₹14–38 LPA',
      growthRate: '+32%',
      avgMonths: 12,
      skills: ['Modern C/C++', 'Microcontrollers (ESP32/STM32)', 'Circuit & PCB Design (KiCad)', 'ROS 2 (Robot Operating System)', 'Kinematics & Control', 'Computer Vision & SLAM'],
      radarStats: { math: 85, coding: 80, systems: 95, mlCore: 70, cloud: 60, product: 65 },
      roadmapPhases: [
        {
          phase: 'Circuits, Microcontrollers & Embedded C++',
          duration: '3 months',
          tasks: ['Ohm’s Law, Analog/Digital Filters & Oscilloscopes', 'Embedded C/C++ & Memory Management', 'Hardware Communication (I2C, SPI, UART, CAN)', 'Prototyping with ESP32 & STM32 Boards']
        },
        {
          phase: 'Actuators, Power & Custom PCB Design',
          duration: '3 months',
          tasks: ['Brushless Motors, Servos & H-Bridge Drivers', 'KiCad Schematic Capture & Multi-layer PCB Routing', 'Power Regulation & LiPo Battery Management', 'Mechanical 3D CAD Enclosures in Fusion 360']
        },
        {
          phase: 'ROS 2, Kinematics & Computer Vision',
          duration: '4 months',
          tasks: ['ROS 2 Nodes, Topics, Actions & URDF Modeling', 'PID Velocity Control & Forward/Inverse Kinematics', 'OpenCV Vision Pipelines for Object Tracking', 'LiDAR Sensor Fusion & SLAM Navigation (Nav2)']
        },
        {
          phase: 'Autonomous Robot Capstone & Deployment',
          duration: '2 months',
          tasks: ['Building a Fully Autonomous Mobile Robot', 'Real-Time Operating Systems (FreeRTOS) Integration', 'Hardware Reliability Testing & Calibration', 'Documenting Open-Hardware Specs & Technical Demonstration']
        }
      ],
      resources: [
        { title: 'ROS 2 Official Documentation', type: 'Docs', url: 'https://docs.ros.org' },
        { title: 'All About Circuits Library', type: 'Guide', url: 'https://allaboutcircuits.com' },
        { title: 'Phil\'s Lab PCB Design Lectures', type: 'Video', url: 'https://youtube.com' }
      ]
    };
  }

  // 5. Healthcare, Biotech, Psychology, Medicine, Pharmacy
  if (t.includes('health') || t.includes('bio') || t.includes('medic') || t.includes('psych') || t.includes('doctor') || t.includes('nurse') || t.includes('pharma')) {
    return {
      title,
      cluster: 'HEALTHCARE & LIFE SCIENCES',
      category: 'Healthcare & Life Sciences',
      icon: '🧬',
      color: '#10b981',
      glowColor: 'rgba(16,185,129,0.6)',
      tagline: 'Advance clinical care and biomedical science through evidence-based practice',
      demand: 'Very High',
      avgSalary: '₹12–35 LPA',
      salaryRange: '₹12–35 LPA',
      growthRate: '+22%',
      avgMonths: 12,
      skills: ['Human Anatomy & Physiology', 'Biochemical Mechanisms', 'Clinical Assessment Protocols', 'Evidence-Based Research', 'Diagnostics & Therapeutics', 'Healthcare Ethics & Compliance'],
      radarStats: { math: 65, coding: 30, systems: 80, mlCore: 45, cloud: 40, product: 75 },
      roadmapPhases: [
        {
          phase: 'Scientific Foundations & Human Biology',
          duration: '3 months',
          tasks: ['Cellular Biology, Anatomy & Organ Systems', 'Biochemical Pathways & Pharmacokinetics', 'Medical Terminology & Clinical Records', 'Biosafety, Sanitation & Ethical Guidelines']
        },
        {
          phase: 'Diagnostic Methodologies & Practical Tools',
          duration: '3 months',
          tasks: ['Clinical Assessment & Patient Interviewing', 'Biostatistics, Epidemiology & Literature Review', 'Diagnostic Instrumentation & Lab Assays', 'Differential Diagnosis & Case Study Analysis']
        },
        {
          phase: 'Specialized Therapeutics & Clinical Rotations',
          duration: '4 months',
          tasks: ['Advanced Pathology / Behavioral Intervention', 'Supervised Clinical Practicum / Laboratory Research', 'Emergency Response Protocols & Drug Interactions', 'Patient Care Plans & Interdisciplinary Communication']
        },
        {
          phase: 'Board Credentialing, Capstone & Practice',
          duration: '2 months',
          tasks: ['Licensure / Board Examination Preparation', 'Publishing Clinical Audit / Research Thesis', 'Healthcare Regulatory Compliance (HIPAA / NABH)', 'Residency Placement or Clinical Practice Induction']
        }
      ],
      resources: [
        { title: 'PubMed Central Biomedical Archives', type: 'Research', url: 'https://ncbi.nlm.nih.gov/pmc/' },
        { title: 'WHO Global Health Learning Center', type: 'Docs', url: 'https://who.int' },
        { title: 'Coursera Clinical Research Specialization', type: 'Course', url: 'https://coursera.org' }
      ]
    };
  }

  // 6. Business, Finance, Marketing, Consulting, Banking
  if (t.includes('business') || t.includes('finance') || t.includes('market') || t.includes('consult') || t.includes('invest') || t.includes('bank') || t.includes('sales')) {
    return {
      title,
      cluster: 'BUSINESS & FINANCE',
      category: 'Business & Finance',
      icon: '📈',
      color: '#f59e0b',
      glowColor: 'rgba(245,158,11,0.6)',
      tagline: 'Drive corporate growth, investment thesis & high-impact financial strategies',
      demand: 'High',
      avgSalary: '₹14–40 LPA',
      salaryRange: '₹14–40 LPA',
      growthRate: '+21%',
      avgMonths: 10,
      skills: ['Financial Modeling', 'Corporate Strategy', 'Data Analytics (SQL/Excel)', 'Valuation & Dealmaking', 'Market Segmentation', 'Executive Presentations'],
      radarStats: { math: 75, coding: 40, systems: 75, mlCore: 50, cloud: 50, product: 90 },
      roadmapPhases: [
        {
          phase: 'Financial Literacy & Economic Foundations',
          duration: '3 months',
          tasks: ['Three-Statement Financial Accounting (P&L, Balance, Cash)', 'Micro & Macro Economic Driving Forces', 'Advanced Financial Modeling & DCF in Excel', 'Customer Segmentation & Value Propositions']
        },
        {
          phase: 'Quantitative Analytics & Market Strategy',
          duration: '3 months',
          tasks: ['Data Extraction & Business Intelligence with SQL', 'Core Unit Economics (CAC, LTV, Net Retention, Margins)', 'Competitive Advantage Analysis & Porter’s Five Forces', 'Multi-channel Go-To-Market Execution Plans']
        },
        {
          phase: 'Advanced Deals, Valuations & Strategy',
          duration: '4 months',
          tasks: ['M&A, LBO & Capital Allocation Frameworks', 'Scenario Analysis & Quantitative Risk Modeling', 'High-Stakes C-Suite Pitch Deck Creation', 'Negotiation Dynamics & Commercial Contracts']
        },
        {
          phase: 'Deal Memo Capstone & Executive Placement',
          duration: '2 months',
          tasks: ['Publishing an In-depth Investment / Strategy Capstone', 'Industry Certifications (CFA / FMVA / PMP)', 'Executive Alumni & Mentor Networking', 'Placement in Top Investment Banks, PE or Consultancies']
        }
      ],
      resources: [
        { title: 'Investopedia Financial Analysis Hub', type: 'Guide', url: 'https://investopedia.com' },
        { title: 'Harvard Business Review Case Studies', type: 'Articles', url: 'https://hbr.org' },
        { title: 'Corporate Finance Institute (CFI)', type: 'Course', url: 'https://corporatefinanceinstitute.com' }
      ]
    };
  }

  // 7. Civil Services, Law, Public Policy, UPSC, Judiciary
  if (t.includes('upsc') || t.includes('civil') || t.includes('ias') || t.includes('law') || t.includes('legal') || t.includes('gov') || t.includes('policy')) {
    return {
      title,
      cluster: 'PUBLIC POLICY & LAW',
      category: 'Public Policy & Governance',
      icon: '⚖️',
      color: '#eab308',
      glowColor: 'rgba(234,179,8,0.6)',
      tagline: 'Shape constitutional governance, legal justice & nation-building policies',
      demand: 'Prestigious & Selective',
      avgSalary: '₹12–30 LPA',
      salaryRange: '₹12–30 LPA',
      growthRate: '+15%',
      avgMonths: 12,
      skills: ['Constitutional Law & Polity', 'Public Administration', 'Analytical Essay Writing', 'Geopolitics & International Relations', 'Ethics & Integrity', 'Administrative Case Studies'],
      radarStats: { math: 40, coding: 20, systems: 85, mlCore: 25, cloud: 30, product: 85 },
      roadmapPhases: [
        {
          phase: 'Constitutional Core & Static Syllabus',
          duration: '3 months',
          tasks: ['Indian Constitution, Fundamental Rights & Governance Structure', 'Modern & Medieval World/National History', 'Physical & Economic Geography Fundamentals', 'Macroeconomic Planning & Fiscal Budget Analysis']
        },
        {
          phase: 'Current Affairs & Analytical Deep-Dive',
          duration: '4 months',
          tasks: ['Daily Editorial Synthesis & Issue-Based Note Making', 'International Treaties, Multilateral Forums & Diplomacy', 'Environmental Laws, Climate Agreements & Sci-Tech', 'Specialized Optional Subject Deep-Dive (Part 1)']
        },
        {
          phase: 'Answer Writing & Ethical Problem Solving',
          duration: '3 months',
          tasks: ['Timed Daily Descriptive Answer Writing Drills', 'Case Studies in Administrative Ethics & Moral Philosophy', 'Structuring Arguments with Precedents & Statistical Data', 'Advanced Optional Subject Mastery (Part 2)']
        },
        {
          phase: 'Simulated Board Mocks & Final Induction',
          duration: '2 months',
          tasks: ['Full-Length Simulated Multi-Day Examinations', 'Personality Test Drills with Expert Panels', 'Detailed Application Form (DAF) Profile Analysis', 'Final Current Affairs Revision & Mental Readiness']
        }
      ],
      resources: [
        { title: 'Press Information Bureau (PIB) Archives', type: 'Official', url: 'https://pib.gov.in' },
        { title: 'PRS Legislative Research Policy Briefs', type: 'Research', url: 'https://prsindia.org' },
        { title: 'Indian Constitutional Caselaw Repository', type: 'Legal', url: 'https://indiankanoon.org' }
      ]
    };
  }

  // 8. Universal High-Quality Fallback for ANY other custom role
  return {
    title,
    cluster: 'SPECIALIZED VOCATION',
    category: 'Specialized Discipline',
    icon: '🚀',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.6)',
    tagline: `Comprehensive mastery pathway to excel as a professional ${title}`,
    demand: 'High',
    avgSalary: '₹12–32 LPA',
    salaryRange: '₹12–32 LPA',
    growthRate: '+22%',
    avgMonths: 12,
    skills: [
      `Foundations of ${title}`,
      'Industry Tools & Techniques',
      'Applied Methodology',
      'Domain Problem Solving',
      'Quality & Standards',
      'Professional Capstone Portfolio'
    ],
    radarStats: { math: 65, coding: 60, systems: 75, mlCore: 50, cloud: 60, product: 75 },
    roadmapPhases: [
      {
        phase: `Phase 1: Foundations of ${title}`,
        duration: '3 months',
        tasks: [
          `Core Principles & Theoretical Basis of ${title}`,
          'Essential Tooling, Setup & Workflow Navigation',
          'Terminology, Key Concepts & Fundamental Standards',
          'First Hands-on Guided Exercise & Benchmark'
        ]
      },
      {
        phase: 'Phase 2: Applied Practice & Core Competencies',
        duration: '3 months',
        tasks: [
          `Practical Implementation of ${title} Workflows`,
          'Solving Real-world Domain Problems & Scenarios',
          'Intermediate Techniques & Industry Workflows',
          'Building Two Guided Mid-tier Practical Deliverables'
        ]
      },
      {
        phase: 'Phase 3: Advanced Specialization & Industry Standards',
        duration: '4 months',
        tasks: [
          'Advanced Methodologies & Complex Case Studies',
          'Quality Control, Optimization & Efficiency Standards',
          'Cross-disciplinary Collaboration & Best Practices',
          'Complex Portfolio Capstone Project Development'
        ]
      },
      {
        phase: 'Phase 4: Capstone Launch, Network & Career Readiness',
        duration: '2 months',
        tasks: [
          'Polishing a Professional Capstone Portfolio Showcase',
          'Industry Credentialing, Certification or Evaluation',
          'Professional Networking & Community Engagement',
          'Job Application, Pitching & Interview Preparedness'
        ]
      }
    ],
    resources: [
      { title: `${title} Fundamentals Masterclass`, type: 'Course', url: 'https://coursera.org' },
      { title: `Global ${title} Professional Hub`, type: 'Community', url: 'https://linkedin.com' },
      { title: 'Industry Best Practices Documentation', type: 'Docs', url: 'https://wikipedia.org' }
    ]
  };
}
