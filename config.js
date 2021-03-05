const MINDUSTRY_LIQUIDS = [
  'water', 'slag', 'oil', 'cryofluid',
];

const MINDUSTRY_ITEMS = [
  'copper', 'lead', 'metaglass',
  'graphite', 'sand', 'coal',
  'titanium', 'thorium', 'scrap',
  'silicon', 'plastanium', 'phase-fabric',
  'surge-alloy', 'spore-pod', 'blast-compound',
  'pyratite',
];

const MINDUSTRY_SELF = [
  'this',
  'unit',
  'links',
  'counter',
  'time',
];

const MINDUSTRY_ACCESS = [
  'totalItems',
  'enabled',
  'firstItem',
  'totalLiquids',
  'totalPower',
  'itemCapacity',
  'liquidCapacity',
  'powerCapacity',
  'powerNetStored',
  'powerNetCapacity',
  'powerNetIn',
  'powerNetOut',
  'ammo',
  'ammoCapacity',
  'health',
  'maxHealth',
  'heat',
  'efficiency',
  'rotation',
  'x',
  'y',
  'shootX',
  'shootY',
  'timescale',
  'range',
  'shooting',
  'mineX',
  'mineY',
  'mining',
  'team',
  'type',
  'flag',
  'controlled',
  'commanded',
  'controller',
  'dead',
  'size',
  'boosting',
  'name',
  'config',
  'payloadCount',
  'payloadType',
];

const MINDUSTRY_BLOCKS = {
  crafting: [
    'silicon-smelter', 'silicon-crucible', 'kiln', 'graphite-press', 'plastanium-compressor', 'multi-press', 'phase-weaver', 'surge-smelter', 'pyratite-mixer', 'blast-mixer', 'cryofluid-mixer',
    'melter', 'separator', 'disassembler', 'spore-press', 'pulverizer', 'incinerator', 'coal-centrifuge',
  ],

  sandbox: [
    'power-source', 'power-void', 'item-source', 'item-void', 'liquid-source', 'liquid-void', 'illuminator',
  ],

  defense: [
    'copper-wall', 'copper-wall-large', 'titanium-wall', 'titanium-wall-large', 'plastanium-wall', 'plastanium-wall-large', 'thorium-wall', 'thorium-wall-large', 'door', 'door-large',
    'phase-wall', 'phase-wall-large', 'surge-wall', 'surge-wall-large', 'mender', 'mend-projector', 'overdrive-projector', 'overdrive-dome', 'force-projector', 'shock-mine',
    'scrap-wall', 'scrap-wall-large', 'scrap-wall-huge', 'scrap-wall-gigantic', 'thruster',
  ],

  transport: [
    'conveyor', 'titanium-conveyor', 'plastanium-conveyor', 'armored-conveyor', 'distributor', 'junction', 'item-bridge', 'phase-conveyor', 'sorter', 'inverted-sorter', 'router',
    'overflow-gate', 'underflow-gate', 'mass-driver', 'payload-conveyor', 'payload-router',
  ],

  liquid: [
    'mechanical-pump', 'rotary-pump', 'thermal-pump', 'conduit', 'pulse-conduit', 'plated-conduit', 'liquid-router', 'liquid-tank', 'liquid-junction', 'bridge-conduit', 'phase-conduit',
  ],

  power: [
    'combustion-generator', 'thermal-generator', 'steam-generator', 'differential-generator', 'rtg-generator', 'solar-panel', 'large-solar-panel', 'thorium-reactor',
    'impact-reactor', 'battery', 'battery-large', 'power-node', 'power-node-large', 'surge-tower', 'diode',
  ],

  production: [
    'mechanical-drill', 'pneumatic-drill', 'laser-drill', 'blast-drill', 'water-extractor', 'oil-extractor', 'cultivator',
  ],

  storage: [
    'core-shard', 'core-foundation', 'core-nucleus', 'vault', 'container', 'unloader',
  ],

  turrets: [
    'duo', 'scatter', 'scorch', 'hail', 'arc', 'wave', 'lancer', 'swarmer', 'salvo', 'fuse', 'ripple', 'cyclone', 'foreshadow', 'spectre', 'meltdown', 'segment', 'parallax', 'tsunami'
  ],

  units: [
    'command-center',
    'ground-factory', 'air-factory', 'naval-factory',
    'additive-reconstructor', 'multiplicative-reconstructor', 'exponential-reconstructor', 'tetrative-reconstructor',
    'repair-point', 'resupply-point',
  ],

  logic: [
    'message', 'switch-block', 'micro-processor', 'logic-processor', 'hyper-processor', 'large-logic-display', 'logic-display', 'memory-cell', 'memory-bank',
  ],

  campaign: [
    'launch-pad', 'launch-pad-large', 'interplanetary-accelerator',
  ],
};

const MINDUSTRY_UNITS = [
  'poly', 'mono', 'flare', 'mace', 'dagger', 'crawler',
  'fortress', 'scepter', 'reign',
  'nova', 'pulsar', 'quasar', 'vela', 'corvus', 'atrax',
  'spiroct', 'arkyid', 'toxopid', 'eclipse',
  'horizon', 'zenith', 'antumbra',
  'mega', 'quad', 'oct', 'alpha', 'beta', 'gamma',
  'risso', 'minke', 'bryde', 'sei', 'omura', 'block',
];

const MINDUSTRY_CONTROL_TARGETS = [
  'enabled',
  'configure',
  'shoot',
  'shootp',
  'color',
].map(t => [t, t]);

const MINDUSTRY_RADAR_TARGETS = [
  'any',
  'enemy',
  'ally',
  'player',
  'attacker',
  'flying',
  'boss',
  'ground',
].map(t => [t, t]);

const MINDUSTRY_RADAR_SORTS = [
  'distance',
  'health',
  'shield',
  'armor',
  'maxHealth',
].map(t => [t, t]);

const MINDUSTRY_LOCATE_BUILDINGS = [
  'core', 'storage', 'generator', 'turret',
  'factory', 'repair', 'rally', 'battery',
  'resupply', 'reactor', 'unitModifier', 'extinguisher',
];

const MINDUSTRY_UNIT_CONTROL = {
  stop: [],
  move: ['x', 'y'],
  flag: ['value'],
  approach: ['x', 'y', 'radius'],
  target: ['x', 'y', 'shoot'],
  targetp: ['unit', 'shoot'],
  itemDrop: ['to', 'amount'],
  itemTake: ['from', 'item', 'amount'],
  mine: ['x', 'y'],
  build: ['x', 'y', 'block', 'rotation', 'config'],
  getBlock: ['x', 'y', 'type', 'building'],
  pathfind: [],
  boost: ['enable'],
  payDrop: [],
  payTake: ['takeUnits'],
  within: ['x', 'y', 'radius', 'result'],
};

const MINDUSTRY_DRAW_OPS = {
  clear: ['r', 'g', 'b'],
  color: ['r', 'g', 'b', 'a'],
  stroke: [''],
  line: ['x', 'y', 'x2', 'y2'],
  rect: ['x', 'y', 'width', 'height'],
  poly: ['x', 'y', 'sides', 'radius', 'rotation'],
  lineRect: ['x', 'y', 'width', 'height'],
  linePoly: ['x', 'y', 'sides', 'radius', 'rotation'],
  triangle: ['x', 'y', 'x2', 'y2', 'x3', 'y3'],
  image: ['x', 'y', 'image', 'size', 'rotation'],
};

const MINDUSTRY_JUMP_OPS = [
  ['==', 'equal'],
  ['===', 'strictEqual'],
  ['not', 'notEqual'],
  ['<', 'lessThan'],
  ['<=', 'lessThanEq'],
  ['>', 'greaterThan'],
  ['>=', 'greaterThanEq'],
];

const JUMPABLE_OPS = [
  'equal',
  'strictEqual',
  'notEqual',
  'lessThan',
  'lessThanEq',
  'greaterThan',
  'greaterThanEq',
];

const MINDUSTRY_BINARY_OPS = [
  ['+', 'add'],
  ['-', 'sub'],
  ['*', 'mul'],
  ['/', 'div'],
  ['//', 'idiv'],
  ['%', 'mod'],
  ['^', 'pow'],

  ['and', 'land'],
  ['not', 'notEqual'],
  ['==', 'equal'],
  ['===', 'strictEqual'],

  ['<', 'lessThan'],
  ['<=', 'lessThanEq'],
  ['>', 'greaterThan'],
  ['>=', 'greaterThanEq'],

  ['<<', 'shl'],
  ['>>', 'shr'],
  ['or', 'or'],
  ['b-and', 'and'],
  ['xor', 'xor'],

  ['min', 'min'],
  ['max', 'max'],

  //soon
  ['angle', 'angle'],
  ['len', 'len'],

  ['noise', 'noise'],
];

const MINDUSTRY_UNARY_OPS = [
  ['floor', 'floor'],
  ['ceil', 'ceil'],
  ['abs', 'abs'],
  ['sqrt', 'sqrt'],
  ['rand', 'rand'],
  ['sin', 'sin'],
  ['cos', 'cos'],
  ['tan', 'tan'],
  ['log', 'log'],
  ['log10', 'log10'],
  ['flip', 'not'],
];

// for image icons... it's all fluids, items, above blocks, units
// https://github.com/Anuken/Mindustry/search?q=%22-icon-logic%22
//