const solarized = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
};

function lighten(col, amt) {
  const num = parseInt(col.slice(1), 16);
  const r = Math.max(Math.min((num >> 16) + amt, 255), 0);
  const b = Math.max(Math.min(((num >> 8) & 0x00FF) + amt, 255), 0);
  const g = Math.max(Math.min((num & 0x0000FF) + amt, 255), 0);
  const newColor = g | (b << 8) | (r << 16);
  return '#' + newColor.toString(16);
}

const lazyColor = (primary, secondary) => ({
  colourPrimary: primary,
  colourSecondary: secondary || lighten(primary, 40),
  colourTertiary: primary,
});


function load() {
  // configure workspace
  const blocklyArea = document.getElementById('blocklyArea');
  const blocklyDiv = document.getElementById('blocklyDiv');
  const workspace = Blockly.inject(blocklyDiv, {
    toolbox: document.getElementById('toolbox'),
    sounds: false,
    zoom: {
      wheel: false,
      startScale: 1.0,
      maxScale: 2,
      minScale: 0.2,
      scaleSpeed: 1.2
    },
    move: {
        scrollbars: true,
        drag: true,
        wheel: false,
    },
    grid: {
      spacing: 40,
      length: 4,
      colour: solarized.base03,
      snap: false
    },
    theme: {
      blockStyles: {
        block_memory: lazyColor(solarized.blue),
        block_output: lazyColor(solarized.red),
        block_control: lazyColor(solarized.magenta),
        block_loop: lazyColor(solarized.violet),
        block_variable: lazyColor(solarized.cyan),
        block_world: lazyColor(solarized.green),
        block_unit: lazyColor(solarized.yellow),
      },
      categoryStyles: {
        category_memory: {colour: solarized.blue},
        category_output: {colour: solarized.red},
        category_control: {colour: solarized.magenta},
        category_loop: {colour: solarized.violet},
        category_variable: {colour: solarized.cyan},
        category_world: {colour: solarized.green},
        category_unit: {colour: solarized.yellow},
      },
      componentStyles: {
        workspaceBackgroundColour: '#000',
        toolboxBackgroundColour: solarized.base03,
        toolboxForegroundColour: solarized.base3,
        flyoutBackgroundColour: solarized.base01,
        flyoutForegroundColour: '#fff',
        scrollbarColour: solarized.base02,
        scrollbarOpacity: 0.2,
        insertionMarkerColour: solarized.base0,
        insertionMarkerOpacity: 0.2,
        markerColour: '#fff',
        cursorColour: '#fff',
      },
      fontStyle: {
        family: 'monospace',
        weight: 'normal',
        size: 12
      },
    },
  });

  window.getCode = () => Blockly.Mindustry.workspaceToCode(workspace);

  // resize workspace when window updates
  const resizeHandler = e => {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    } while (element);

    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
  };

  window.addEventListener('resize', resizeHandler, false);
  resizeHandler();
  Blockly.svgResize(workspace);
  const saveInducingEvents = [
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_MOVE,
  ];
  workspace.addChangeListener(e => {
    if (saveInducingEvents.includes(e.type)) {
      localStorage.autosave = getCodeAsXml()
    }
  });

  loadCode(localStorage.autosave);
}

function getCodeAsXml() {
  const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  return Blockly.Xml.domToText(xml);
}

function loadCode(code, clear=true) {
  if (!code) return;
  if (clear) Blockly.mainWorkspace.clear();

  const xml = Blockly.Xml.textToDom(code);
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}

// keybinds
document.addEventListener('keydown', async e => {
  if (e.code === 'KeyS' && e.ctrlKey) {
    e.preventDefault();
    if (e.shiftKey) {
      const code = Blockly.Mindustry.workspaceToCode(Blockly.mainWorkspace);
      console.log(code);
      await navigator.clipboard.writeText(code);
      console.log('[save] copied code to clipboard');
    } else {
      console.log('[save] saved code');
      await navigator.clipboard.writeText(getCodeAsXml());
    }
  }
});

document.addEventListener('DOMContentLoaded', load);
