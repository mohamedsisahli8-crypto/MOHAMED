import { EncyclopediaArticle } from '../types/app';

export const ENCYCLOPEDIA_ARTICLES: EncyclopediaArticle[] = [
  {
    id: 'relativity',
    discipline: 'physics',
    titleAr: 'النسبية الخاصة والعامة',
    titleEn: 'Special & General Relativity',
    subtitleAr: 'هندسة الزمكان وسرعة الضوء المطلقة والجاذبية',
    subtitleEn: 'Spacetime Geometry, Speed of Light, and Gravity',
    eraOrDomainAr: 'الفيزياء الحديثة · 1905–1915',
    eraOrDomainEn: 'Modern Physics · 1905–1915',
    summaryAr:
      'صاغ ألبرت أينشتاين النسبية الخاصة لتوحيد المكان والزمان في نسيج واحد سرعته الحدية هي سرعة الضوء في الفراغ، ثم وسّعها في النسبية العامة ليُفسر الجاذبية بوصفها انحناءً في نسيج الزمكان تسببه الكتلة والطاقة.',
    summaryEn:
      'Albert Einstein unified space and time into a single four-dimensional continuum governed by the invariant speed of light, then formulated General Relativity showing gravity as spacetime curvature caused by mass-energy.',
    keyLaws: [
      { nameAr: 'تكافؤ الكتلة والطاقة', nameEn: 'Mass-Energy Equivalence', formula: 'E = mc²' },
      { nameAr: 'معادلات أينشتاين للمجال', nameEn: 'Einstein Field Equations', formula: 'G_μν + Λg_μν = (8πG/c⁴) T_μν' },
      { nameAr: 'تمدد الزمن النسبي', nameEn: 'Time Dilation', formula: 'Δt′ = Δt / √(1 - v²/c²)' },
    ],
    factsAr: [
      'أقمار نظام الملاحة GPS تُصحح ساعاتها يومياً بمقدار 38 ميكروثانية بسبب النسبية.',
      'تنبأت النسبية العامة بالثقوب السوداء وموجات الجاذبية التي رُصدت فعلياً في مرصد LIGO عام 2015.',
      'ينحني الضوء عند مروره قرب الأجرام الضخمة، وهو ما يُعرف بعدسة الجاذبية.',
    ],
    factsEn: [
      'GPS satellites apply a 38-microsecond daily relativistic clock correction to remain accurate.',
      'General Relativity predicted black holes and gravitational waves, directly observed by LIGO in 2015.',
      'Massive galaxy clusters bend light from distant galaxies via gravitational lensing.',
    ],
  },
  {
    id: 'quantum-mechanics',
    discipline: 'physics',
    titleAr: 'ميكانيكا الكم والنموذج القياسي',
    titleEn: 'Quantum Mechanics & Standard Model',
    subtitleAr: 'سلوك المادة والطاقة عند المقاييس الذرية ودون الذرية',
    subtitleEn: 'Matter, Wavefunctions, and Fundamental Forces at Atomic Scales',
    eraOrDomainAr: 'الفيزياء الكمية · 1900–الآن',
    eraOrDomainEn: 'Quantum Physics · 1900–Present',
    summaryAr:
      'تصف ميكانيكا الكم الطبيعة الاحتمالية والموجية للجسيمات الأولية. يُصنف النموذج القياسي الجسيمات إلى كواركات وليبتونات وبوزونات حاملة للقوى النووية القوية والضعيفة والكهرومغناطيسية، وصولاً إلى بوزون هيغز المانح للكتلة.',
    summaryEn:
      'Quantum mechanics describes the wave-particle duality and probabilistic states of matter. The Standard Model classifies fundamental fermions (quarks, leptons) and force-carrying bosons including the Higgs boson.',
    keyLaws: [
      { nameAr: 'معادلة شرودنغر', nameEn: 'Schrödinger Equation', formula: 'iℏ ∂ψ/∂t = Ĥψ' },
      { nameAr: 'مبدأ عدم اليقين لهايزنبرغ', nameEn: 'Heisenberg Uncertainty', formula: 'Δx · Δp ≥ ℏ / 2' },
      { nameAr: 'طاقة الفوتون لبلانك', nameEn: 'Planck-Einstein Relation', formula: 'E = h · ν' },
    ],
    factsAr: [
      'التراكب الكمي والتشابك يمثلان الأساس الفيزيائي للحواسيب الكمية والتشفير الكمي.',
      'تعمل الترانزستورات الحديثة والليزر والرنين المغناطيسي الطبي بفضل قوانين الكم.',
    ],
    factsEn: [
      'Quantum superposition and entanglement underpin quantum computing and quantum cryptography.',
      'Modern transistors, lasers, LEDs, and MRI scanners rely directly on quantum phenomena.',
    ],
  },
  {
    id: 'thermodynamics',
    discipline: 'physics',
    titleAr: 'الديناميكا الحرارية والكهرومغناطيسية',
    titleEn: 'Thermodynamics & Electromagnetism',
    subtitleAr: 'قوانين الطاقة والإنتروبيا ومعادلات ماكسويل الأربع',
    subtitleEn: 'Laws of Energy, Entropy, and Maxwell’s Equations',
    eraOrDomainAr: 'الفيزياء الكلاسيكية · القرن 19',
    eraOrDomainEn: 'Classical Physics · 19th Century',
    summaryAr:
      'تحكم الديناميكا الحرارية تحولات الحرارة والشغل وتحدد سهم الزمن عبر زيادة الإنتروبيا، بينما توحّد معادلات ماكسويل الكهرباء والمغناطيسية والضوء بوصفها تجليات لمجال كهرومغناطيسي واحد.',
    summaryEn:
      'Thermodynamics governs energy conservation and the arrow of time via entropy, while Maxwell’s four equations unify electricity, magnetism, and light as electromagnetic waves.',
    keyLaws: [
      { nameAr: 'القانون الأول للديناميكا الحرارية', nameEn: 'First Law of Thermodynamics', formula: 'ΔU = Q - W' },
      { nameAr: 'إنتروبيا بولتزمان', nameEn: 'Boltzmann Entropy', formula: 'S = k_B · ln(Ω)' },
      { nameAr: 'قانون الغاز المثالي', nameEn: 'Ideal Gas Law', formula: 'P · V = n · R · T' },
    ],
    factsAr: [
      'كفاءة دورة كارنو الحرارية تحدد الحد النظري الأقصى لأي محرك حراري في الكون.',
      'استنتج ماكسويل سرعة الضوء نظرياً مباشرة من ثابتي النفاذية والسماحية للفراغ.',
    ],
    factsEn: [
      'Carnot efficiency defines the absolute theoretical maximum efficiency of any heat engine.',
      'Maxwell derived the speed of light theoretically from vacuum permittivity and permeability.',
    ],
  },
  {
    id: 'calculus-analysis',
    discipline: 'mathematics',
    titleAr: 'التفاضل والتكامل والتحليل الرياضي',
    titleEn: 'Calculus & Mathematical Analysis',
    subtitleAr: 'معدلات التغير الآنية، المساحات، والمتسلسلات اللانهائية',
    subtitleEn: 'Rates of Change, Integration, and Infinite Series',
    eraOrDomainAr: 'الرياضيات · نيوتن ولايبنتز',
    eraOrDomainEn: 'Mathematics · Newton & Leibniz',
    summaryAr:
      'يدرس التفاضل معدل التغير اللحظي وميل المماس للمنحنيات، بينما يحسب التكامل التراكم والمساحات والحجوم. وتربط المبرهنة الأساسية للتفاضل والتكامل بين العمليتين بوصفهما عمليتين متعاكستين.',
    summaryEn:
      'Differential calculus measures instantaneous rates of change and slopes, while integral calculus computes accumulation and area. The Fundamental Theorem of Calculus bridges them as inverse operations.',
    keyLaws: [
      { nameAr: 'المبرهنة الأساسية للتكامل', nameEn: 'Fundamental Theorem', formula: '∫_a^b f′(x) dx = f(b) - f(a)' },
      { nameAr: 'متطابقة أويلر الذهبية', nameEn: 'Euler’s Identity', formula: 'e^(iπ) + 1 = 0' },
      { nameAr: 'متسلسلة تايلور', nameEn: 'Taylor Series', formula: 'f(x) = Σ f^(n)(a)(x-a)^n / n!' },
    ],
    factsAr: [
      'المعادلات التفاضلية تصف حركة الكواكب وانتشار الحرارة وتدفق السوائل ونمو السكان.',
      'تحويل فورييه يُفكك أي إشارة صوتية أو صورة رقمية إلى مجموع ترددات جيبية.',
    ],
    factsEn: [
      'Differential equations model planetary orbits, heat diffusion, fluid dynamics, and epidemiology.',
      'Fourier transforms decompose any signal or image into constituent sinusoidal frequencies.',
    ],
  },
  {
    id: 'algebra-number-theory',
    discipline: 'mathematics',
    titleAr: 'الجبر ونظرية الأعداد والاحتمالات',
    titleEn: 'Algebra, Number Theory & Probability',
    subtitleAr: 'المصفوفات والأعداد الأولية والاستدلال البايزي',
    subtitleEn: 'Matrices, Prime Numbers, and Bayesian Inference',
    eraOrDomainAr: 'الرياضيات البحتة والتطبيقية',
    eraOrDomainEn: 'Pure & Applied Mathematics',
    summaryAr:
      'يُشكّل الجبر الخطي والمصفوفات لغة الفضاءات متعددة الأبعاد والرسوميات الحاسوبية، بينما تحمي الأعداد الأولية الاتصالات المصرفية عبر التشفير، وتقيس نظرية الاحتمالات وبايز عدم اليقين بدقة.',
    summaryEn:
      'Linear algebra powers 3D graphics and modern data science, prime number theory secures global internet encryption, and Bayesian probability quantifies uncertainty mathematically.',
    keyLaws: [
      { nameAr: 'مبرهنة بايز', nameEn: 'Bayes’ Theorem', formula: 'P(A|B) = P(B|A)P(A) / P(B)' },
      { nameAr: 'مبرهنة فيثاغورس المعممة', nameEn: 'Law of Cosines', formula: 'c² = a² + b² - 2ab cos(γ)' },
      { nameAr: 'مبرهنة الأعداد الأولية', nameEn: 'Prime Number Theorem', formula: 'π(x) ~ x / ln(x)' },
    ],
    factsAr: [
      'الخوارزمي وضع أسس علم الجبر المستقل في كتابه المختصر في حساب الجبر والمقابلة ببغداد.',
      'يوجد عدد لا نهائي من الأعداد الأولية كما برهن إقليدس قبل أكثر من ألفَي عام.',
    ],
    factsEn: [
      'Al-Khwarizmi established algebra as an independent mathematical discipline in 9th-century Baghdad.',
      'Euclid proved over 2,000 years ago that there are infinitely many prime numbers.',
    ],
  },
  {
    id: 'chemical-bonding',
    discipline: 'chemistry',
    titleAr: 'الروابط الكيميائية والتفاعلات',
    titleEn: 'Chemical Bonding & Reactions',
    subtitleAr: 'الروابط التساهمية والأيونية والرقم الهيدروجيني pH',
    subtitleEn: 'Covalent, Ionic, Metallic Bonds & Acid-Base Equilibrium',
    eraOrDomainAr: 'الكيمياء العامة والعضوية',
    eraOrDomainEn: 'General & Organic Chemistry',
    summaryAr:
      'تتفاعل الذرات للوصول إلى استقرار إلكترونات التكافؤ عبر التشارك (التساهمية) أو الانتقال (الأيونية). وتحدد سرعة التفاعلات والاتزان الحمضي-القاعدي سلوك المواد الحيوية والصناعية.',
    summaryEn:
      'Atoms bond to achieve stable valence shells through electron sharing (covalent) or transfer (ionic). Reaction kinetics and acid-base equilibria govern industrial and biological chemistry.',
    keyLaws: [
      { nameAr: 'الرقم الهيدروجيني', nameEn: 'pH Definition', formula: 'pH = -log₁₀[H⁺]' },
      { nameAr: 'طاقة غيبس الحرة', nameEn: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS' },
      { nameAr: 'معادلة أرينيوس', nameEn: 'Arrhenius Equation', formula: 'k = A · e^(-Ea / RT)' },
    ],
    factsAr: [
      'جابر بن حيان أسس المنهج التجريبي في الكيمياء وابتكر التقطير والعديد من الأحماض المعدنية.',
      'الرابطة الهيدروجينية بين جزيئات الماء تفسر ارتفاع درجة غليانه وتمدده عند التجمد.',
    ],
    factsEn: [
      'Hydrogen bonding gives water its remarkably high boiling point and ability to sustain life.',
      'Every change of 1 unit on the pH scale represents a 10-fold shift in hydrogen ion concentration.',
    ],
  },
  {
    id: 'genetics-cell',
    discipline: 'biology',
    titleAr: 'الخلية والحمض النووي والوراثة',
    titleEn: 'Cell Biology, DNA & Genetics',
    subtitleAr: 'الشيفرة الوراثية، الميتوكوندريا، وتقنيات تحرير الجينوم',
    subtitleEn: 'Genetic Code, Cellular Organelles, and CRISPR',
    eraOrDomainAr: 'الأحياء الجزيئية والوراثة',
    eraOrDomainEn: 'Molecular Biology & Genetics',
    summaryAr:
      'الخلية هي الوحدة البنائية والوظيفية لجميع الكائنات الحية. يحمل جزيء DNA الحلزوني المزدوج التعليمات الوراثية عبر أربع قواعد نيتروجينية (A, T, C, G) تُنسخ إلى RNA وتُترجم إلى بروتينات.',
    summaryEn:
      'The cell is the fundamental unit of all life. Double-helix DNA encodes hereditary instructions in four nucleotide bases (A, T, C, G), transcribed to RNA and translated into proteins.',
    keyLaws: [
      { nameAr: 'العقيدة المركزية للبيولوجيا', nameEn: 'Central Dogma', formula: 'DNA → mRNA → Protein' },
      { nameAr: 'معادلة التنفس الخلوي', nameEn: 'Cellular Respiration', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
    ],
    factsAr: [
      'يحتوي الجينوم البشري على نحو 3 مليارات زوج قاعدي وحوالي 20 ألف جين مشفّر للبروتين.',
      'طول الحمض النووي داخل خلية بشرية واحدة إذا فُكّ يصل إلى قرابة مترين.',
    ],
    factsEn: [
      'The human genome spans ~3 billion base pairs and roughly 20,000 protein-coding genes.',
      'Unspooled DNA from a single human cell measures roughly 2 meters in length.',
    ],
  },
  {
    id: 'human-anatomy',
    discipline: 'biology',
    titleAr: 'تشريح جسم الإنسان والطب الحديث',
    titleEn: 'Human Anatomy & Physiology',
    subtitleAr: 'الجهاز العصبي، الدورة الدموية، والمناعة البشرية',
    subtitleEn: 'Nervous, Cardiovascular, and Immune Systems',
    eraOrDomainAr: 'الطب ووظائف الأعضاء',
    eraOrDomainEn: 'Medicine & Physiology',
    summaryAr:
      'يتكامل جسم الإنسان عبر أحد عشر جهازاً حيوياً، يقودها الدماغ بنحو 86 مليار عصبون، ويضخ القلب نحو 7,000 لتر دم يومياً عبر شبكة أوعية دموية يبلغ طولها قرابة 100 ألف كيلومتر.',
    summaryEn:
      'The human body integrates eleven organ systems, led by a brain of ~86 billion neurons and a heart pumping ~7,000 liters of blood daily through ~100,000 km of vessels.',
    keyLaws: [
      { nameAr: 'النتاج القلبي', nameEn: 'Cardiac Output', formula: 'CO = HR × SV' },
      { nameAr: 'مؤشر كتلة الجسم', nameEn: 'Body Mass Index', formula: 'BMI = mass(kg) / height(m)²' },
    ],
    factsAr: [
      'وصف ابن النفيس الدورة الدموية الصغرى (الرئوية) بدقة في القرن الثالث عشر الميلادي.',
      'يمثل الدماغ 2% من وزن الجسم لكنه يستهلك نحو 20% من إجمالي الأكسجين والطاقة.',
    ],
    factsEn: [
      'Ibn al-Nafis accurately described pulmonary blood circulation in the 13th century.',
      'Though only 2% of body mass, the human brain consumes ~20% of total oxygen and glucose.',
    ],
  },
  {
    id: 'cosmology-earth',
    discipline: 'earth_space',
    titleAr: 'علم الكونيات وبنية كوكب الأرض',
    titleEn: 'Cosmology & Earth Sciences',
    subtitleAr: 'الانفجار العظيم، الثقوب السوداء، والصفائح التكتونية',
    subtitleEn: 'Big Bang, Black Holes, Atmosphere & Plate Tectonics',
    eraOrDomainAr: 'الفلك وعلوم الأرض',
    eraOrDomainEn: 'Astrophysics & Geology',
    summaryAr:
      'تشير القياسات الفلكية إلى أن عمر الكون يبلغ 13.8 مليار سنة منذ الانفجار العظيم. أما كوكب الأرض فيتميز بغلاف جوي واقٍ وصفائح تكتونية متحركة ونواة حديدية تولد مجالاً مغناطيسياً يحمي الحياة من الرياح الشمسية.',
    summaryEn:
      'Cosmological observations place the age of the universe at 13.8 billion years. Earth sustains life through a protective atmosphere, dynamic plate tectonics, and a geomagnetic core shield.',
    keyLaws: [
      { nameAr: 'قانون هابل لتمدد الكون', nameEn: 'Hubble-Lemaître Law', formula: 'v = H₀ · d' },
      { nameAr: 'نصف قطر شفارتزشيلد للثقب الأسود', nameEn: 'Schwarzschild Radius', formula: 'r_s = 2GM / c²' },
      { nameAr: 'قانون الجذب العام', nameEn: 'Universal Gravitation', formula: 'F = G(m₁m₂) / r²' },
    ],
    factsAr: [
      'يتكون الغلاف الجوي للأرض من 78% نيتروجين، 21% أكسجين، و0.93% أرغون.',
      'التلسكوب الفضائي جيمس ويب يلتقط ضوء المجرات الأولى بالأشعة تحت الحمراء.',
    ],
    factsEn: [
      'Earth’s dry atmosphere comprises 78% nitrogen, 21% oxygen, and 0.93% argon.',
      'The James Webb Space Telescope observes the earliest galaxies in deep infrared wavelengths.',
    ],
  },
  {
    id: 'islamic-golden-age',
    discipline: 'history',
    titleAr: 'العصر الذهبي للعلوم والحضارات العالمية',
    titleEn: 'World Civilizations & Scientific Golden Ages',
    subtitleAr: 'من وادي الرافدين ومصر إلى بيت الحكمة والنهضة الحديثة',
    subtitleEn: 'From Mesopotamia & Egypt to Baghdad’s House of Wisdom & Modern Era',
    eraOrDomainAr: 'التاريخ العالمي · 3500 ق.م – الآن',
    eraOrDomainEn: 'World History · 3500 BCE – Present',
    summaryAr:
      'بُنيت المعرفة الإنسانية تراكمياً عبر حضارات وادي الرافدين ووادي النيل والإغريق والهند والصين، وبلغت ذروة التبادل العلمي في بيت الحكمة ببغداد والأندلس مع ابن الهيثم والخوارزمي والبيروني وابن سينا، ممهدةً لعصر النهضة والثورات الصناعية والرقمية.',
    summaryEn:
      'Human knowledge accumulated across Mesopotamia, Egypt, Greece, India, and China, flourishing in the Islamic Golden Age with Ibn al-Haytham, Al-Khwarizmi, Al-Biruni, and Ibn Sina, paving the path to the Renaissance and Information Age.',
    keyLaws: [
      { nameAr: 'المنهج التجريبي لابن الهيثم', nameEn: 'Ibn al-Haytham Scientific Method', formula: 'الملاحظة ← الفرضية ← التجربة ← البرهان' },
      { nameAr: 'خوارزمية البحث والترتيب', nameEn: 'Algorithmic Legacy', formula: 'Al-Khwarizmi → Algorithm' },
    ],
    factsAr: [
      'قاس أبو الريحان البيروني نصف قطر الأرض في القرن الحادي عشر بدقة تجاوزت 99%.',
      'أسست فاطمة الفهرية جامعة القرويين في فاس عام 859م، وهي أقدم مؤسسة تعليم عالٍ مستمرة.',
    ],
    factsEn: [
      'Al-Biruni calculated Earth’s radius in the 11th century with greater than 99% accuracy.',
      'Al-Qarawiyyin in Fez (founded 859 CE) is recognized as the oldest continually operating university.',
    ],
  },
  {
    id: 'world-geography',
    discipline: 'geography',
    titleAr: 'جغرافيا الأرض والقارات والمحيطات',
    titleEn: 'Physical Geography, Continents & Oceans',
    subtitleAr: 'المناخ، التضاريس، السكان، والمدارات الجغرافية',
    subtitleEn: 'Continents, Oceans, Climates & Global Cartography',
    eraOrDomainAr: 'الجغرافيا الطبيعية والبشرية',
    eraOrDomainEn: 'Physical & Human Geography',
    summaryAr:
      'تغطي المحيطات 71% من سطح الأرض بينما تتوزع اليابسة على 7 قارات. يحدد ميل محور الأرض البالغ 23.44° تعاقب الفصول الأربعة والمناطق المناخية من خط الاستواء حتى القطبين.',
    summaryEn:
      'Oceans cover 71% of Earth’s surface across five basins, while landmasses span seven continents. Earth’s 23.44° axial tilt drives seasons and climate belts from equator to poles.',
    keyLaws: [
      { nameAr: 'محيط الأرض الاستوائي', nameEn: 'Equatorial Circumference', formula: '40,075 km' },
      { nameAr: 'أعمق نقطة محيطية (تشالنجر)', nameEn: 'Mariana Trench Depth', formula: '−10,935 m' },
      { nameAr: 'أعلى قمة (إيفرست)', nameEn: 'Mount Everest Elevation', formula: '+8,848.86 m' },
    ],
    factsAr: [
      'المحيط الهادئ أكبر مساحةً من جميع قارات اليابسة مجتمعة.',
      'نهر النيل ونهر الأمازون هما أطول وأغزر نظامين نهريين على كوكب الأرض.',
    ],
    factsEn: [
      'The Pacific Ocean covers more surface area than all Earth’s continents combined.',
      'The Nile and the Amazon represent the longest and highest-discharge river systems on Earth.',
    ],
  },
  {
    id: 'computer-science',
    discipline: 'computing',
    titleAr: 'علوم الحاسوب والخوارزميات والذكاء',
    titleEn: 'Computer Science, Algorithms & Architecture',
    subtitleAr: 'تعقيد الخوارزميات، معمارية المعالجات، والشبكات والتشفير',
    subtitleEn: 'Algorithmic Complexity, CPU Architecture, Networks & Cryptography',
    eraOrDomainAr: 'الحوسبة · تورينغ وفون نيومان',
    eraOrDomainEn: 'Computing · Turing & von Neumann',
    summaryAr:
      'ترتكز الحوسبة الحديثة على معمارية فون نيومان والنظام الثنائي (0 و1) وبوابات المنطق الرقمي. وتقاس كفاءة الخوارزميات برمز Big-O بينما يضمن التشفير الحديث RSA وAES وSHA-256 أمن البيانات الرقمية.',
    summaryEn:
      'Modern computing rests on binary logic gates, von Neumann architecture, and asymptotic complexity (Big-O), while protocols like TCP/IP, TLS, AES, and SHA-256 power the global internet.',
    keyLaws: [
      { nameAr: 'كفاءة البحث الثنائي', nameEn: 'Binary Search Complexity', formula: 'O(log₂ n)' },
      { nameAr: 'إنتروبيا شانون للمعلومات', nameEn: 'Shannon Entropy', formula: 'H(X) = -Σ p(x) log₂ p(x)' },
      { nameAr: 'قانون أمدال للتوازي', nameEn: 'Amdahl’s Law', formula: 'S(s) = 1 / ((1 - p) + p/s)' },
    ],
    factsAr: [
      'يحتوي المعالج الدقيق الحديث على عشرات المليارات من الترانزستورات بمقياس نانومتري.',
      'صاغت آدا لوفليس أول خوارزمية منشورة للحوسبة الآلية في القرن التاسع عشر.',
    ],
    factsEn: [
      'Modern processors integrate tens of billions of nanometer-scale transistors on silicon.',
      'Ada Lovelace published the first formal computer algorithm in the 19th century.',
    ],
  },
];
