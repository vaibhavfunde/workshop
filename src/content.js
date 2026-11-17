// ─────────────────────────────────────────────────────────────
//  All website copy lives here — edit freely.
//  The order of `layers` must match the order of layers in the
//  matching 3D file (src/scene/*.jsx).
// ─────────────────────────────────────────────────────────────

export const company = {
  name: 'Funde Engineering',
  titleLines: ['Funde', 'Engineering'],
  tagline: 'Repair. Weld. Turn. Press. Cut.',
  blurb:
    'A working engineering shop. Bring us the broken part, the worn shaft or the drawing — one workshop, four core machines, one finished job.',
}

// ⚠ Placeholders — replace with your real details before publishing.
export const contact = {
  phone: '+91 00000 00000',
  whatsapp: '+91 00000 00000',
  email: 'your-email@example.com',
  address: 'Belapur Budruk, behind JTS High School — PIN 413715',
  hours: 'Working hours — add yours here',
}

// Each machine's layers are the CUSTOMER WORKS done on it (title, which service it belongs to,
// what we do, typical jobs). Layer order matches the order of parts in the 3D file.
export const machines = [
  {
    "id": "lathe",
    "name": "Lathe Machine",
    "tag": "Turning · Facing · Threading",
    "services": [
      "Lathe Machine Works",
      "Machine Repairs"
    ],
    "intro": "Bring us shafts, bushes, pulleys or a worn part to copy — the lathe turns it to size. Scroll to see the five kinds of work we do on it.",
    "layers": [
      {
        "title": "Spare Parts Made to Sample",
        "service": "Machine Repairs",
        "body": "No drawing? Bring the broken or worn part. We measure it, turn a new one in the right steel and fit-check it against the machine it belongs to.",
        "note": "Pins, spacers, collars, rollers, couplings, adaptors."
      },
      {
        "title": "Thread Cutting",
        "service": "Lathe Machine Works",
        "body": "External and internal threads cut to the pitch you need — new studs and screws, or damaged threads recut so the nut runs smoothly again.",
        "note": "Studs, bolts, lead screws, threaded fittings, nipples."
      },
      {
        "title": "Shaft & Rod Turning",
        "service": "Lathe Machine Works",
        "body": "Plain, stepped and tapered shafts turned to your size and finish. Worn journals are built up and re-turned, so a good shaft does not go to scrap.",
        "note": "Motor and pump shafts, axles, spindles, rollers."
      },
      {
        "title": "Bush, Pulley & Sleeve Making",
        "service": "Lathe Machine Works",
        "body": "Bores, outer diameters and faces turned to a precise fit. We make new bushes and sleeves, and re-bore pulleys and flanges that have worn oversize.",
        "note": "Bearing bushes, pulleys, flanges, wheel hubs, sleeves."
      },
      {
        "title": "Long Shaft & Drilling Work",
        "service": "Lathe Machine Works",
        "body": "Long shafts are supported at the far end so they stay straight while they are turned, and centre drilling, boring and reaming are done on the same set-up.",
        "note": "Long rollers, conveyor shafts, boring and reaming jobs."
      }
    ]
  },
  {
    "id": "press",
    "name": "Hydraulic Press",
    "tag": "Straightening · Bending · Fitting",
    "services": [
      "Hydraulic Press Work",
      "Machine Repairs"
    ],
    "intro": "Pressing, straightening and bending under controlled force. Scroll to see the five kinds of work we do on the hydraulic press.",
    "layers": [
      {
        "title": "Bearing & Bush Fitting",
        "service": "Hydraulic Press Work",
        "body": "Bearings, bushes and sleeves are pressed in and out squarely, with steady force, so the part and its housing are not damaged.",
        "note": "Motor, gearbox and wheel bearings; bronze bushes."
      },
      {
        "title": "Shaft Straightening",
        "service": "Hydraulic Press Work",
        "body": "Bent shafts and bars are checked and pressed back straight — often saving the cost of a new one.",
        "note": "Bent motor shafts, axles, rods, spindles."
      },
      {
        "title": "Pulley, Gear & Wheel Pressing",
        "service": "Hydraulic Press Work",
        "body": "Tight-fit pulleys, gears, couplings and wheels are pressed off a shaft without hammering or heating, and fitted back at the right position.",
        "note": "Pulleys, gears, couplings, wheel hubs, flywheels."
      },
      {
        "title": "Plate Bending & Forming",
        "service": "Hydraulic Press Work",
        "body": "Plates, flats and sections are bent, flattened and formed to shape using the right punch and die.",
        "note": "Brackets, flats, angles, clamps, dished plates."
      },
      {
        "title": "Dismantling Seized Parts",
        "service": "Machine Repairs",
        "body": "Rusted and seized pins, bushes and fittings that hand tools cannot move are pushed out under controlled load, so the part can be reused.",
        "note": "Seized pins, sleeves, liners, old bushes."
      }
    ]
  },
  {
    "id": "welder",
    "name": "Arc Welding Machine",
    "tag": "Fusing · Fabricating · Repairing",
    "services": [
      "Arc Welding",
      "Machine Repairs"
    ],
    "intro": "From gates to broken machine parts — scroll to see the five kinds of welding work we take up with the arc welder.",
    "layers": [
      {
        "title": "On-Site Welding",
        "service": "Arc Welding",
        "body": "Too big to move? The welder is wheeled to your site, so heavy structures are welded where they stand.",
        "note": "Gates, shed frames, tanks, installed machinery."
      },
      {
        "title": "Fabrication",
        "service": "Arc Welding",
        "body": "Frames, stands, gates, grills and tables made from your drawing or idea — cut, fitted and welded into a finished piece.",
        "note": "Gates, grills, stands, trolleys, tables, racks."
      },
      {
        "title": "Heavy-Duty Welding",
        "service": "Arc Welding",
        "body": "Long seams and thick plate welded in several runs, with the machine kept cool so the joint is strong all the way through.",
        "note": "Tanks, trailers, structural beams, hoppers."
      },
      {
        "title": "Sheet & Light Welding",
        "service": "Arc Welding",
        "body": "Current is set carefully for thin sheet so it does not burn through, giving clean, neat joints.",
        "note": "Sheet boxes, guards, ducts, thin tubes."
      },
      {
        "title": "Crack & Broken Part Repair",
        "service": "Machine Repairs",
        "body": "Cracked castings, broken lugs and worn surfaces are welded and built up, then machined back to size when needed.",
        "note": "Broken brackets, cracked housings, worn shafts, buckets."
      }
    ]
  },
  {
    "id": "cutter",
    "name": "Gas Cutting Set",
    "tag": "Oxy-Fuel · Plate · Sections",
    "services": [
      "Gas Cutting",
      "Machine Repairs"
    ],
    "intro": "Fast, straight cuts through thick steel. Scroll to see the five kinds of cutting work we do with the gas cutting set.",
    "layers": [
      {
        "title": "On-Site Cutting",
        "service": "Gas Cutting",
        "body": "The set sits on a trolley and goes to the work, so heavy steel can be cut where it is, without lifting it.",
        "note": "Structures, tanks, beams, installed equipment."
      },
      {
        "title": "Plate Cutting to Size",
        "service": "Gas Cutting",
        "body": "Steel plate cut to your size or marked line, with the gas pressure set right for a clean, square edge.",
        "note": "Base plates, flanges, flats, gussets."
      },
      {
        "title": "Scrap & Dismantling Cutting",
        "service": "Gas Cutting",
        "body": "Old machines, tanks and structures are cut into manageable pieces safely, with flashback protection in use throughout.",
        "note": "Old machines, scrap steel, rusted structures."
      },
      {
        "title": "Bar, Pipe & Section Cutting",
        "service": "Gas Cutting",
        "body": "Round bars, pipes, angles and beams cut cleanly to length with a steady hand.",
        "note": "Round bar, heavy pipe, channels, I-beams."
      },
      {
        "title": "Bevelling & Shape Cutting",
        "service": "Gas Cutting",
        "body": "Plate edges bevelled ready for strong welded joints, and shapes and circles cut out of plate.",
        "note": "Weld preparation, circles, openings, profiles."
      }
    ]
  }
]

// Services ↔ machines.  2 = main machine for the job · 1 = supports the job
export const services = [
  {
    name: 'Machine Repairs',
    desc: 'Worn shafts rebuilt, cracks welded, bearings and bushes pressed out and in, broken parts cut out and remade — all four machines get used.',
    map: { lathe: 2, press: 2, welder: 2, cutter: 2 },
  },
  {
    name: 'Lathe Machine Works',
    desc: 'Shafts, bushes, pulleys, spacers and threads turned to your drawing or to match a sample.',
    map: { lathe: 2, press: 0, welder: 0, cutter: 0 },
  },
  {
    name: 'Arc Welding',
    desc: 'Fabrication, joint welding and crack repair on steel structures, frames and machine parts.',
    map: { lathe: 0, press: 0, welder: 2, cutter: 1 },
  },
  {
    name: 'Hydraulic Press Work',
    desc: 'Pressing bearings and bushes, straightening shafts, bending and forming metal under controlled load.',
    map: { lathe: 0, press: 2, welder: 0, cutter: 0 },
  },
  {
    name: 'Gas Cutting',
    desc: 'Cutting plate, bars and sections to size, bevelling edges, and removing old or damaged fittings.',
    map: { lathe: 0, press: 0, welder: 0, cutter: 2 },
  },
]

export const about = {
  headline: 'A workshop that keeps machines — and the people behind them — running.',
  paras: [
    'Funde Engineering is a general engineering workshop. Customers bring us worn, broken or half-finished work and we put it back in service: machines repaired, parts turned on the lathe, joints arc-welded, metal pressed and cut to size.',
    'Everything runs on four core machines — a lathe, a hydraulic press, an arc welder and a gas cutter. That is why one visit can cover a whole job instead of sending you from shop to shop.',
  ],
  stats: [
    { n: '1993', label: 'Established' },
    { n: '10,000+', label: 'Trusted customers' },
    { n: '2,00,000', label: 'Jobs completed' },
  ],
  quote: {
    text: 'Once you join the Funde family, you are our customer for life — and often for generations.',
    by: 'Funde Engineering · Since 1993',
  },
  values: [
    {
      t: 'Straight answers',
      d: 'We tell you what the job needs, what it will cost and how long it will take before we start.',
    },
    {
      t: 'Repair before replace',
      d: 'A part that can be rebuilt on the lathe or welded back to strength should not be scrapped.',
    },
    {
      t: 'Made to fit',
      d: 'Work is turned and fitted to your drawing, your sample or the part it has to mate with.',
    },
  ],
  steps: [
    { t: 'Bring it in', d: 'The broken part, the machine, or just a drawing.' },
    { t: 'Inspect & quote', d: 'We diagnose it and agree the work and price.' },
    { t: 'Repair or make', d: 'Turned, welded, pressed or cut on the right machine.' },
    { t: 'Test & hand over', d: 'Checked for fit before it goes back to work.' },
  ],
}

// ── Founder & co-founder ─────────────────────────────────────
// ⚠ PLACEHOLDERS — replace names, bios and facts with the real ones (in BOTH languages:
// here and in content.mr.js). Drop the photos into  public/team/founder.jpg  and
// public/team/cofounder.jpg  (portrait, roughly 4:5). Until a photo exists, a silhouette shows.
export const team = {
  eyebrow: 'The people',
  title: 'Meet the team',
  members: [
    {
      role: 'Founder',
      name: 'Founder Name',
      photo: 'team/founder.jpg',
      bio: 'Leads the workshop, plans every job and signs off the work before it goes back to the customer.',
      facts: [
        { k: 'Experience', v: 'Add years here' },
        { k: 'Speciality', v: 'Add speciality here' },
        { k: 'Based in', v: 'Add city here' },
      ],
    },
    {
      role: 'Co-Founder',
      name: 'Co-Founder Name',
      photo: 'team/cofounder.jpg',
      bio: 'Runs the day-to-day on the shop floor — machine work, quotes and keeping customers updated.',
      facts: [
        { k: 'Experience', v: 'Add years here' },
        { k: 'Speciality', v: 'Add speciality here' },
        { k: 'Based in', v: 'Add city here' },
      ],
    },
  ],
}

// ── Interface text ───────────────────────────────────────────
export const ui = {
  nav: { machines: 'Machines', services: 'Services', about: 'About', quote: 'Get a quote', switchTo: 'मराठी', switchLabel: 'Switch to Marathi' },
  hero: {
    eyebrow: 'Engineering workshop · Since 1993 · Belapur Budruk',
    chips: ['Machine Repairs', 'Arc Welding', 'Lathe Works', 'Hydraulic Press', 'Gas Cutting'],
    cue: 'Scroll — take the machine apart',
  },
  chapter: {
    machine: 'Machine',
    servicesLabel: 'Services this machine delivers',
    layer: 'Work',
    overview: 'Overview',
    assembled: 'What we do on this machine',
    keep: 'Keep scrolling',
    hint: 'Each kind of work we do on this machine appears as it opens up.',
    workshop: 'Typical jobs',
  },
  services: {
    eyebrow: 'What we do',
    title: 'Every service, and the machine',
    accent: 'behind it',
    lede: 'Each job lands on the machine built for it. The dots show which machine carries a service — a filled dot is the main machine, a ring means it supports the job.',
    col: 'Service',
    main: 'Main machine',
    support: 'Supports the job',
  },
  about: { eyebrow: 'About', how: 'How a job runs' },
  contact: {
    eyebrow: 'Get a quote',
    title: 'Bring us the',
    accent: 'job.',
    lede: 'Broken part, worn shaft, or a drawing that needs making — tell us what it is and we will tell you what it takes.',
    call: 'Call',
    email: 'Email',
    visit: 'Visit the workshop',
    hours: 'Hours',
  },
}
