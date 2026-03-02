const $ = document.querySelector.bind(document);
const $$ = (q, el) => Array.from((el || document).querySelectorAll(q));

// debounce fn
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const resetCopy = debounce(el => el.classList.remove('copied'), 1000);
const resetErrors = debounce(el => el.classList.remove('errors'), 2000);

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
  const b = Math.max(Math.min(((num >> 8) & 0x00ff) + amt, 255), 0);
  const g = Math.max(Math.min((num & 0x0000ff) + amt, 255), 0);
  const newColor = g | (b << 8) | (r << 16);
  return '#' + newColor.toString(16);
}

const lazyColor = (primary, secondary) => ({
  colourPrimary: primary,
  colourSecondary: lighten(primary, 40),
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
      scaleSpeed: 1.2,
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
      snap: false,
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
        category_memory: { colour: solarized.blue },
        category_output: { colour: solarized.red },
        category_control: { colour: solarized.magenta },
        category_loop: { colour: solarized.violet },
        category_variable: { colour: solarized.cyan },
        category_world: { colour: solarized.green },
        category_unit: { colour: solarized.yellow },
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
        size: 12,
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
  const autosave = debounce(
    () => (localStorage.autosave = getCodeAsXml()),
    500,
  );
  workspace.addChangeListener(e => {
    if (saveInducingEvents.includes(e.type)) {
      autosave();
    }
  });

  loadCode(localStorage.autosave);

  $('#copymlogBtn').addEventListener('click', clickCopy);
  $('#copyxmlBtn').addEventListener('click', clickSave);
  $('#exportBtn').addEventListener('click', clickExport);
  $('#clearBtn').addEventListener('click', clickClear);
}

function getCodeAsXml() {
  const xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  return Blockly.Xml.domToText(xml);
}

function loadCodeFromFile(clear = true) {
  // Create file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xml';
  fileInput.style.display = 'none'; // Hide the actual button

  fileInput.onchange = function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const code = reader.result;
      // load the file
      loadCode(code, clear);

      // Remove the file input element from the DOM (to prevent lots of hidden buttons)
      document.body.removeChild(fileInput);
    };

    reader.readAsText(file);
  };

  // Append the file input element to the body
  document.body.appendChild(fileInput);

  // Open the file input menu
  fileInput.click();
}

function loadCode(code, clear = true) {
  if (!code) return;
  if (clear) Blockly.mainWorkspace.clear();

  const xml = Blockly.Xml.textToDom(code);
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}

let shiftDown = false;
const multiSelection = new Set(); // block IDs for multi-select
let multiClipboard = null; // array of toCopyData() results for multi-paste

function getMultiSelectedBlocks() {
  var workspace = Blockly.mainWorkspace;
  var blocks = [];
  multiSelection.forEach(function (id) {
    var block = workspace.getBlockById(id);
    if (block) blocks.push(block);
  });
  return blocks;
}

function clearMultiSelection() {
  getMultiSelectedBlocks().forEach(function (block) {
    block.removeSelect();
  });
  multiSelection.clear();
}

function addToMultiSelection(block) {
  multiSelection.add(block.id);
  block.addSelect();
}

function removeFromMultiSelection(block) {
  multiSelection.delete(block.id);
  block.removeSelect();
}

// keybinds
document.addEventListener('keydown', async e => {
  const workspace = Blockly.mainWorkspace;
  shiftDown = e.shiftKey;
  if (e.code === 'KeyS' && e.ctrlKey) {
    e.preventDefault();
    if (!e.shiftKey) {
      clickCopy();
    } else {
      clickSave();
    }
  }

  if (e.code === 'KeyO' && e.ctrlKey) {
    e.preventDefault();
    loadCodeFromFile(!e.shiftKey);
  }

  if (e.code === 'KeyE' && e.ctrlKey) {
    e.preventDefault();
    clickExport();
  }

  if (e.code === 'Delete' && e.shiftKey && e.ctrlKey) {
    e.preventDefault();
    clickClear();
  }

  if (!Blockly.selected && multiSelection.size === 0 && !workspace.keyboardAccessibilityMode) {
    for (let i = 0; i < 7; i++) {
      if (e.key === i + 1 + '') {
        workspace.getToolbox().selectItemByPosition(i);
      }
    }
  }
});

document.addEventListener('keyup', e => {
  shiftDown = e.shiftKey;
});

async function clickCopy() {
  const workspace = Blockly.mainWorkspace;
  try {
    const code = Blockly.Mindustry.workspaceToCode(workspace);
    console.log(code);
    await navigator.clipboard.writeText(code);
    console.log('[save] copied code to clipboard');
    $('#copymlogBtn').classList.add('copied');
    resetCopy($('#copymlogBtn'));
  } catch (err) {
    console.error(err);
    $('#copymlogBtn').classList.add('errors');
    resetErrors($('#copymlogBtn'));
  }
}

async function clickSave() {
  try {
    console.log('[save] saved code');
    await navigator.clipboard.writeText(getCodeAsXml());
    $('#copyxmlBtn').classList.add('copied');
    resetCopy($('#copyxmlBtn'));
  } catch (err) {
    $('#copyxmlBtn').classList.add('errors');
    resetErrors($('#copyxmlBtn'));
  }
}

function clickExport() {
  const name = prompt('Enter a file name', localStorage.lastName || 'project');
  if (typeof name === 'object') return;
  localStorage.lastName = name;
  $('#download').href =
    'data:text/xml;charset=utf-8,' + encodeURIComponent(getCodeAsXml());
  $('#download').download = name + '.xml';
  $('#download').click();
}

function clickClear() {
  const workspace = Blockly.mainWorkspace;
  if (confirm('Do you really want to clear all your code?')) {
    workspace.clear();
  }
}

// Unified paste handler: XML import from system clipboard, or internal clipboard paste
document.addEventListener('paste', e => {
  var workspace = Blockly.mainWorkspace;
  if (workspace.options.readOnly || Blockly.Gesture.inProgress()) return;

  const pasteData = e.clipboardData.getData('Text').trim();

  if (
    pasteData.startsWith(
      '<xml xmlns="https://developers.google.com/blockly/xml">',
    )
  ) {
    // XML import from system clipboard
    e.preventDefault();
    var before = new Set(workspace.getAllBlocks(false).map(function (b) { return b.id; }));
    Blockly.Events.disable();
    try {
      loadCode(pasteData, false);
    } finally {
      Blockly.Events.enable();
    }
    Blockly.Events.setGroup(true);
    var offset = Blockly.SNAP_RADIUS || 20;
    clearMultiSelection();
    var allBlocks = workspace.getAllBlocks(false);
    for (var i = 0; i < allBlocks.length; i++) {
      var block = allBlocks[i];
      if (!before.has(block.id)) {
        if (!block.getParent()) {
          block.moveBy(offset, -offset);
          addToMultiSelection(block);
          Blockly.selected = block;
        }
        if (!block.isShadow()) {
          Blockly.Events.fire(new Blockly.Events.BlockCreate(block));
        }
      }
    }
    Blockly.Events.setGroup(false);
  } else if (multiClipboard && multiClipboard.length > 1) {
    // Internal multi-block paste
    e.preventDefault();
    Blockly.Events.setGroup(true);
    clearMultiSelection();
    var offset = Blockly.SNAP_RADIUS || 20;
    multiClipboard.forEach(function (data) {
      var xml = data.xml.cloneNode(true);
      Blockly.Events.disable();
      var block;
      try {
        block = Blockly.Xml.domToBlock(xml, workspace);
      } finally {
        Blockly.Events.enable();
      }
      var x = parseInt(xml.getAttribute('x'), 10) || 0;
      var y = parseInt(xml.getAttribute('y'), 10) || 0;
      block.moveBy(x + offset, y - offset);
      if (Blockly.Events.isEnabled() && !block.isShadow()) {
        Blockly.Events.fire(new Blockly.Events.BlockCreate(block));
      }
      addToMultiSelection(block);
      Blockly.selected = block;
    });
    Blockly.Events.setGroup(false);
  } else if (Blockly.clipboardXml_) {
    // Internal single-block paste
    e.preventDefault();
    Blockly.paste();
  }
});

// Patch Blockly dropdown menus to support type-to-filter
(function () {
  var origHandleKeyEvent = Blockly.Menu.prototype.handleKeyEvent_;

  Blockly.Menu.prototype.handleKeyEvent_ = function (e) {
    if (!this.menuItems_.length) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Tab selects highlighted item
    if (e.keyCode === 9) {
      var highlighted = this.highlightedItem_;
      if (highlighted) highlighted.performAction();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Backspace removes last typed char
    if (e.keyCode === 8) {
      if (this._searchBuffer && this._searchBuffer.length > 0) {
        this._searchBuffer = this._searchBuffer.slice(0, -1);
        this._applyFilter();
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }

    // Escape clears filter first, then closes menu
    if (e.keyCode === 27) {
      if (this._searchBuffer) {
        this._searchBuffer = '';
        this._applyFilter();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    // Printable character — add to search buffer
    if (e.key && e.key.length === 1 && !e.shiftKey) {
      if (!this._searchBuffer) this._searchBuffer = '';
      this._searchBuffer += e.key.toLowerCase();
      this._applyFilter();
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Default handling (arrows, enter, space, home, end)
    origHandleKeyEvent.call(this, e);
  };

  Blockly.Menu.prototype._applyFilter = function () {
    var items = this.menuItems_;
    var query = this._searchBuffer || '';
    var firstVisible = null;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var el = item.getElement();
      if (!el) continue;

      var text = el.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        el.style.display = '';
        item._filtered = false;
        if (!firstVisible) firstVisible = item;
      } else {
        el.style.display = 'none';
        item._filtered = true;
      }
    }

    // If nothing matches, show the currently selected item as fallback
    if (!firstVisible && this.selectedMenuItem_) {
      var selEl = this.selectedMenuItem_.getElement();
      if (selEl) {
        selEl.style.display = '';
        this.selectedMenuItem_._filtered = false;
        firstVisible = this.selectedMenuItem_;
      }
    }

    // Highlight first visible if current is hidden
    if (firstVisible && (!this.highlightedItem_ || this.highlightedItem_._filtered)) {
      this.setHighlighted(firstVisible);
    }

    this._updateSearchIndicator();
  };

  // Skip filtered items during arrow key navigation
  Blockly.Menu.prototype.highlightHelper_ = function (a, b) {
    a += b;
    for (var c; (c = this.menuItems_[a]); a += b) {
      if (c.isEnabled() && !c._filtered) {
        this.setHighlighted(c);
        break;
      }
    }
  };

  Blockly.Menu.prototype._updateSearchIndicator = function () {
    var el = this.getElement();
    if (!el) return;

    var indicator = el.querySelector('.menu-search-indicator');
    if (!this._searchBuffer) {
      if (indicator) indicator.remove();
      return;
    }

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'menu-search-indicator';
      el.insertBefore(indicator, el.firstChild);
    }
    indicator.textContent = this._searchBuffer;
  };

  // Clear search state when menu is disposed
  var origDispose = Blockly.Menu.prototype.dispose;
  Blockly.Menu.prototype.dispose = function () {
    this._searchBuffer = '';
    origDispose.call(this);
  };
})();

// Multi-block selection support
(function () {
  // --- Patch BlockSvg.prototype.select ---
  var origSelect = Blockly.BlockSvg.prototype.select;
  Blockly.BlockSvg.prototype.select = function () {
    if (this.isShadow() && this.getParent()) {
      this.getParent().select();
      return;
    }
    if (this.isInFlyout || this.workspace.keyboardAccessibilityMode) {
      origSelect.call(this);
      return;
    }

    if (shiftDown) {
      // Shift-click: toggle this block in/out of multi-selection
      if (multiSelection.has(this.id)) {
        removeFromMultiSelection(this);
        if (Blockly.selected === this) {
          Blockly.selected = null;
          var remaining = getMultiSelectedBlocks();
          if (remaining.length > 0) {
            Blockly.selected = remaining[remaining.length - 1];
          }
        }
      } else {
        // First shift-click: also add the previously single-selected block
        if (Blockly.selected && !multiSelection.has(Blockly.selected.id)) {
          addToMultiSelection(Blockly.selected);
        }
        addToMultiSelection(this);
        Blockly.selected = this;
      }
    } else if (multiSelection.has(this.id)) {
      // Clicking an already multi-selected block: keep selection, just update primary
      Blockly.selected = this;
    } else {
      // Normal click: clear multi-selection, do standard single select
      clearMultiSelection();
      origSelect.call(this);
      multiSelection.add(this.id);
    }
  };

  // --- Patch BlockSvg.prototype.unselect ---
  var origUnselect = Blockly.BlockSvg.prototype.unselect;
  Blockly.BlockSvg.prototype.unselect = function () {
    multiSelection.delete(this.id);
    origUnselect.call(this);
  };

  // --- Patch Gesture.prototype.doWorkspaceClick_ ---
  var origDoWorkspaceClick = Blockly.Gesture.prototype.doWorkspaceClick_;
  Blockly.Gesture.prototype.doWorkspaceClick_ = function (a) {
    if (!(a.shiftKey && this.creatorWorkspace_.keyboardAccessibilityMode)) {
      clearMultiSelection();
    }
    origDoWorkspaceClick.call(this, a);
  };

  // --- Re-register Delete shortcut ---
  Blockly.ShortcutRegistry.registry.register({
    name: Blockly.ShortcutItems.names.DELETE,
    preconditionFn: function (workspace) {
      return !workspace.options.readOnly && multiSelection.size > 0;
    },
    callback: function (workspace, e) {
      e.preventDefault();
      if (Blockly.Gesture.inProgress()) return false;
      Blockly.Events.setGroup(true);
      var blocks = getMultiSelectedBlocks();
      Blockly.selected = null;
      multiSelection.clear();
      blocks.forEach(function (block) {
        if (block.isDeletable() && !block.workspace.isFlyout) {
          block.dispose(true, true);
        }
      });
      Blockly.Events.setGroup(false);
      return true;
    },
  }, true);

  // --- Re-register Copy shortcut ---
  Blockly.ShortcutRegistry.registry.register({
    name: Blockly.ShortcutItems.names.COPY,
    preconditionFn: function (workspace) {
      return !workspace.options.readOnly &&
        !Blockly.Gesture.inProgress() &&
        multiSelection.size > 0;
    },
    callback: function () {
      Blockly.hideChaff();
      var blocks = getMultiSelectedBlocks().filter(function (b) {
        return b.isDeletable() && b.isMovable();
      });
      if (blocks.length === 0) return false;
      if (blocks.length === 1) {
        Blockly.copy(blocks[0]);
        multiClipboard = null;
      } else {
        multiClipboard = blocks.map(function (block) {
          return block.toCopyData();
        });
        Blockly.copy(blocks[blocks.length - 1]);
      }
      return true;
    },
  }, true);

  // --- Re-register Cut shortcut ---
  Blockly.ShortcutRegistry.registry.register({
    name: Blockly.ShortcutItems.names.CUT,
    preconditionFn: function (workspace) {
      return !workspace.options.readOnly &&
        !Blockly.Gesture.inProgress() &&
        multiSelection.size > 0;
    },
    callback: function () {
      var blocks = getMultiSelectedBlocks().filter(function (b) {
        return b.isDeletable() && b.isMovable() && !b.workspace.isFlyout;
      });
      if (blocks.length === 0) return false;
      // Copy
      if (blocks.length === 1) {
        Blockly.copy(blocks[0]);
        multiClipboard = null;
      } else {
        multiClipboard = blocks.map(function (block) {
          return block.toCopyData();
        });
        Blockly.copy(blocks[blocks.length - 1]);
      }
      // Delete
      Blockly.Events.setGroup(true);
      Blockly.selected = null;
      multiSelection.clear();
      blocks.forEach(function (block) {
        block.dispose(true, true);
      });
      Blockly.Events.setGroup(false);
      return true;
    },
  }, true);

  // --- Re-register Paste shortcut ---
  // Always returns false so the browser fires a paste event,
  // which is handled by the unified paste handler above.
  Blockly.ShortcutRegistry.registry.register({
    name: Blockly.ShortcutItems.names.PASTE,
    preconditionFn: function () { return false; },
    callback: function () { return false; },
  }, true);

  // --- Patch BlockDragger for multi-drag ---
  var origStartBlockDrag = Blockly.BlockDragger.prototype.startBlockDrag;
  Blockly.BlockDragger.prototype.startBlockDrag = function (a, b) {
    this._multiDragFollowers = [];
    if (multiSelection.has(this.draggingBlock_.id) && multiSelection.size > 1) {
      var dragId = this.draggingBlock_.id;
      var blocks = getMultiSelectedBlocks();
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].id !== dragId) {
          this._multiDragFollowers.push({
            block: blocks[i],
            startXY: blocks[i].getRelativeToSurfaceXY(),
          });
        }
      }
    }
    origStartBlockDrag.call(this, a, b);
  };

  // Move followers visually during drag
  var origDragBlock = Blockly.BlockDragger.prototype.dragBlock;
  Blockly.BlockDragger.prototype.dragBlock = function (a, b) {
    origDragBlock.call(this, a, b);
    var followers = this._multiDragFollowers;
    if (followers && followers.length > 0) {
      var delta = this.pixelsToWorkspaceUnits_(b);
      for (var i = 0; i < followers.length; i++) {
        var f = followers[i];
        if (f.block.workspace) {
          f.block.translate(
            f.startXY.x + delta.x,
            f.startXY.y + delta.y,
          );
        }
      }
    }
  };

  var origEndBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag;
  Blockly.BlockDragger.prototype.endBlockDrag = function (a, b) {
    var startXY = this.startXY_;
    var followers = this._multiDragFollowers || [];
    // Save event group so follower moves share the same undo group
    var group = Blockly.Events.getGroup();
    origEndBlockDrag.call(this, a, b);

    if (followers.length > 0 && this.draggingBlock_.workspace) {
      var endXY = this.draggingBlock_.getRelativeToSurfaceXY();
      var dx = endXY.x - startXY.x;
      var dy = endXY.y - startXY.y;
      if (dx !== 0 || dy !== 0) {
        Blockly.Events.setGroup(group);
        followers.forEach(function (f) {
          if (f.block.workspace) {
            // Reset visual position before moveBy to avoid double-movement
            f.block.translate(f.startXY.x, f.startXY.y);
            f.block.moveBy(dx, dy);
          }
        });
        Blockly.Events.setGroup(false);
      }
    }
  };
})();

document.addEventListener('DOMContentLoaded', load);
/**/
