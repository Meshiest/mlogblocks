// forcefully update a block's style... :)
function forceColor(block, style) {
  const old = Blockly.Blocks[block].init;
  Blockly.Blocks[block].init = function() {
    old.bind(this)();
    this.setStyle('block_' + style);
  };
}

forceColor('controls_if', 'control');
forceColor('logic_ternary', 'control');
forceColor('controls_repeat_ext', 'loop');
forceColor('controls_for', 'loop');
forceColor('controls_whileUntil', 'loop');
forceColor('procedures_defreturn', 'control');
forceColor('procedures_defnoreturn', 'control');
forceColor('procedures_ifreturn', 'control');
forceColor('procedures_callreturn', 'control');
forceColor('procedures_callnoreturn', 'control');

// DISCLAIMER
// a large chunk of the below code is generated, then pasted in
// it will be refactored to be more modular at a later date
// it's complete garbage

Blockly.Blocks['mind_read'] = {
  init: function() {
    this.appendValueInput('CELL')
        .setCheck(null)
        .appendField('read')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST')
        .appendField('=');
    this.appendValueInput('INDEX')
        .setCheck(null)
        .appendField('at');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_memory');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_read'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'read',
    ['field', 'DEST'],
    ['value', 'CELL'],
    ['value', 'INDEX'],
  );

Blockly.Blocks['mind_write'] = {
  init: function() {
    this.appendValueInput('SOURCE')
        .setCheck(null)
        .appendField('write');
    this.appendValueInput('CELL')
        .setCheck(null)
        .appendField('to');
    this.appendValueInput('INDEX')
        .setCheck(null)
        .appendField('at');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_memory');
    this.setTooltip('');
//    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_write'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'write',
    ['value', 'SOURCE'],
    ['value', 'CELL'],
    ['value', 'INDEX'],
  );


Blockly.Blocks['mind_flush_draw'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('draw flush to')
        .appendField(new Blockly.FieldTextInput('text'), 'VAR');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_output');
    this.setTooltip('');
    //this.setHelpUrl('');
  }
};

Blockly.Mindustry['mind_flush_draw'] = block => 'drawflush ' + block.getFieldValue('VAR');

Blockly.Blocks['mind_flush_print'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('print flush to')
        .appendField(new Blockly.FieldTextInput('text'), 'VAR');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_output');
    this.setTooltip('');
    //this.setHelpUrl('');
  }
};

Blockly.Mindustry['mind_flush_print'] = block =>  'printflush ' + block.getFieldValue('VAR');

Blockly.Blocks['var_block_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('text'), 'VALUE');
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setStyle('block_variable');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['var_block_text'] = block => [block.getFieldValue('VALUE'), 0];

Blockly.Blocks['mind_set'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .appendField('set')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST')
        .appendField('=')
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_variable');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_set'] = function(block) {
  return Blockly.Mindustry.easyAssemble(block, 'set',
    ['field', 'DEST'],
    ['value', 'VALUE'],
  );
};

Blockly.Blocks['mind_get_link'] = {
  init: function() {
    this.appendValueInput('INDEX')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST')
        .appendField('= link#')
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_world');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_get_link'] = function(block) {
  return Blockly.Mindustry.easyAssemble(block, 'getlink',
    ['field', 'DEST'],
    ['value', 'VALUE'],
  );
};


const CONTROL_TYPES = {
  enabled: {inputs: ['TO']},
  configure: {inputs: ['TO']},
  shoot: {inputs: ['X', 'Y', 'SHOOT']},
  shootp: {inputs: ['UNIT', 'SHOOT']},
};

Blockly.Blocks['mind_control'] = {
  init: function() {
    this.appendValueInput('TARGET')
        .setCheck(null)
        .appendField('set')
        .appendField(new Blockly.FieldDropdown(
          MINDUSTRY_CONTROL_TARGETS,
          this.typeHandler.bind(this)
        ), 'ACTION')
        .appendField('of');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.controlType = this.getFieldValue('ACTION') || 'enabled';
    this.setStyle('block_world');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');

    this.updateShape();
  },

  typeHandler(type) {
    if (this.controlType !== type) {
      this.controlType = type;
      this.updateShape();
      // this.setTooltip();
    }
  },

  updateShape() {
    const fields = {
      TO: 'to',
      X: 'x',
      Y: 'y',
      UNIT: 'unit',
      SHOOT: 'shoot',
    };

    // iterate in reverse so i doesn't shift when we remove things
    for (let i = this.inputList.length-1; i >= 0; i--) {
      const input = this.inputList[i];
      if (fields[input.name]) {
        this.removeInput(input.name);
      }
    }

    const type = CONTROL_TYPES[this.controlType];
    for (const name of type.inputs) {
      this.appendValueInput(name)
        .appendField(fields[name]);
    }
  },
};

Blockly.Mindustry['mind_control'] = function(block) {
  const actionArgs = {
    enabled: [
      ['field', 'ACTION'],
      ['value', 'TARGET'],
      ['value', 'TO'],
      ['raw', '0'],
      ['raw', '0'],
      ['raw', '0'],
    ],
    configure: [
      ['field', 'ACTION'],
      ['value', 'TARGET'],
      ['value', 'TO'],
      ['raw', '0'],
      ['raw', '0'],
      ['raw', '0'],
    ],
    shoot: [
      ['field', 'ACTION'],
      ['value', 'TARGET'],
      ['value', 'X'],
      ['value', 'Y'],
      ['value', 'SHOOT'],
      ['raw', '0'],
    ],
    shootp: [
      ['field', 'ACTION'],
      ['value', 'TARGET'],
      ['value', 'UNIT'],
      ['value', 'SHOOT'],
      ['raw', '0'],
      ['raw', '0'],
    ],
  };

  const action = block.getFieldValue('ACTION');
  return Blockly.Mindustry.easyAssemble(block, 'control', ...actionArgs[action]);
};

Blockly.Blocks['mind_radar'] = {
  init: function() {
    this.appendValueInput('UNIT')
        .setCheck(null)
        .appendField('radar from');
    this.appendDummyInput('ORDER')
        .appendField('target')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target1')
        .appendField('and')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target2')
        .appendField('and')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target3')
    this.appendDummyInput()
        .appendField('order')
        .appendField(new Blockly.FieldTextInput('1'), 'ORDER')
        .appendField('sort')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_SORTS), 'SORT')
    this.appendDummyInput()
        .appendField('output')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_world');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_radar'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'radar',
    ['field', 'target1'],
    ['field', 'target2'],
    ['field', 'target3'],
    ['field', 'SORT'],
    ['value', 'UNIT'],
    ['field', 'ORDER'],
    ['field', 'DEST'],
  );

const globalHelper = (name, items, color='block_variable') => {
  Blockly.Blocks['global_' + name] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(
            items.map(i => ['@' + i, '@' + i]),
          ), 'NAME')
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setStyle(color);
      this.setTooltip('');
      //this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.Mindustry['global_' + name] = block => [block.getFieldValue('NAME'), 0];
};

globalHelper('liquid', MINDUSTRY_LIQUIDS, 'block_variable');
globalHelper('item', MINDUSTRY_ITEMS, 'block_variable');
globalHelper('self', MINDUSTRY_SELF, 'block_variable');
globalHelper('access', MINDUSTRY_ACCESS, 'block_variable');
globalHelper('unit', MINDUSTRY_UNITS, 'block_variable');

Blockly.Blocks['mind_sensor'] = {
  init: function() {
    this.appendValueInput('FIELD')
        .appendField('sense')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST')
        .appendField('=')
        .setCheck(null);
    this.appendValueInput('UNIT')
        .setCheck(null)
        .appendField('in');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_world');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_sensor'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'sensor',
    ['field', 'DEST'],
    ['value', 'UNIT'],
    ['value', 'FIELD'],
  );

Blockly.Blocks['mind_sensor_val'] = {
  init: function() {
    this.appendValueInput('FIELD')
        .appendField('sense')
        .setCheck(null);
    this.appendValueInput('UNIT')
        .setCheck(null)
        .appendField('in');
    this.setInputsInline(true);
    this.setOutput(true, null)
    this.setStyle('block_world');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_sensor_val'] = block => {
  const temp = Blockly.Mindustry.temp();
  return [Blockly.Mindustry.easyAssemble(block, 'sensor',
    ['raw', temp],
    ['value', 'UNIT'],
    ['value', 'FIELD'],
  ) + '\n' + temp, 0];
}

Blockly.Blocks['mind_print_text'] = {
  init: function() {
    this.appendValueInput('TEXT')
        .appendField('print')
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_output');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_print_text'] = block => {
  const aCode = Blockly.Mindustry.valueToCode(block, 'TEXT', 0);
  const [rawText, textBefore] = Blockly.Mindustry.extractVar(aCode);

  // check if this is a normal print or a variable print
  if (textBefore.length > 0 || !rawText.match(/^".*{.*}.*"$/)) {
    return textBefore.concat([
      'print ' + rawText
    ]).join('\n');
  }

  const prints = [];
  const quoteless = rawText.slice(1, -1); // remove quotes from text

  let str = '';
  let isBrace = false;
  for (let i = 0; i < quoteless.length; i++) {
    // start detecting a templated var - push the string in
    if (quoteless[i] == '{' && quoteless[i-1] !== '\\' && !isBrace) {
      if (str.length > 0)
        prints.push(`"${str.replace(/\\{/g, '{')}"`);
      str = '';
      isBrace = true;
    // stop detecting a templated var - push the var in
    } else if (quoteless[i] == '}' && isBrace) {
      if (str.length > 0)
        prints.push(str);
      str = '';
      isBrace = false;
    } else {
      // add a character to the string
      str = str + quoteless[i];
    }
  }

  // add last string if there is one
  if (str.length > 0 && !isBrace) prints.push(`"${str}"`);

  // build the prints
  return prints.map(text => 'print ' + text).join('\n');
}

Blockly.Blocks['mind_end'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('end');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_control');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_end'] = block => 'end';

Blockly.Blocks['mind_jump_label'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('label')
        .appendField(new Blockly.FieldTextInput('text'), 'LABEL');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_control');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_jump_label'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'ASM:LABEL',
    ['field', 'LABEL'],
  );

Blockly.Blocks['mind_jump_always'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('jump to')
        .appendField(new Blockly.FieldTextInput('text'), 'LABEL');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_control');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_jump_always'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'ASM:JUMP:ALWAYS',
    ['field', 'LABEL'],
    ['raw', 'always'],
    ['raw', '0'],
    ['raw', '0'],
  );

Blockly.Blocks['mind_jump_cond'] = {
  init: function() {
    this.appendValueInput('ARG_A')
        .setCheck(null)
        .appendField('jump to')
        .appendField(new Blockly.FieldTextInput('text'), 'LABEL')
        .appendField('if');
    this.appendValueInput('ARG_B')
        .setCheck(null)
        .appendField(new Blockly.FieldDropdown([
            ['==', 'equal'],
            ['not', 'notEqual'],
            ['<', 'lessThan'],
            ['<=', 'lessThanEq'],
            ['>', 'greaterThan'],
            ['>=', 'greaterThanEq'],
        ]), 'COND');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_control');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_jump_cond'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'ASM:JUMP',
    ['field', 'LABEL'],
    ['field', 'COND'],
    ['value', 'ARG_A'],
    ['value', 'ARG_B'],
  );


Blockly.Blocks['mind_unit_bind'] = {
  init: function() {
    this.appendValueInput('UNIT')
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('bind');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_unit');
    this.setTooltip('');
    //this.setHelpUrl('');
  }
};

Blockly.Mindustry['mind_unit_bind'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'ubind',
    ['value', 'UNIT'],
  );

Blockly.Blocks['mind_unit_radar'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('@unit radar')
        .appendField('target')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target1')
        .appendField('and')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target2')
        .appendField('and')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_TARGETS), 'target3');
    this.appendDummyInput()
        .appendField('order')
        .appendField(new Blockly.FieldTextInput('1'), 'ORDER')
        .appendField('sort')
        .appendField(new Blockly.FieldDropdown(MINDUSTRY_RADAR_SORTS), 'SORT')
        .appendField('output')
        .appendField(new Blockly.FieldTextInput('result'), 'DEST');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_unit');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['mind_unit_radar'] = block =>
  Blockly.Mindustry.easyAssemble(block, 'radar',
    ['field', 'target1'],
    ['field', 'target2'],
    ['field', 'target3'],
    ['field', 'SORT'],
    ['raw', '1'],
    ['field', 'ORDER'],
    ['field', 'DEST'],
  );

const LOCATE_TYPES = {
  ore: ['ORE'],
  building: ['TYPE', 'ENEMY', 'BUILDING'],
  spawn: ['BUILDING'],
  damaged: ['BUILDING'],
};

Blockly.Blocks['mind_unit_locate'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('find')
        .appendField(new Blockly.FieldDropdown([
          ['ore', 'ore'],
          ['building', 'building'],
          ['spawn', 'spawn'],
          ['damaged', 'damaged'],
        ], this.typeHandler.bind(this)), 'TARGET');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle('block_unit');
    this.setTooltip('');
    //this.setHelpUrl('http://www.example.com/');
    this.targetType = this.getFieldValue('TARGET');

    this.updateShape();
  },

  typeHandler(type) {
    if (this.targetType !== type) {
      this.targetType = type;
      this.updateShape();
      // this.setTooltip();
    }
  },

  updateShape() {
    // iterate in reverse so i doesn't shift when we remove things
    for (let i = this.inputList.length-1; i >= 0; i--) {
      const input = this.inputList[i];
      if (input.name) {
        this.removeInput(input.name);
      }
    }

    const type = LOCATE_TYPES[this.targetType];
    const hasField = name => type.includes(name);

    if (hasField('TYPE')) {
      this.appendValueInput('ENEMY')
          .appendField('type')
          .appendField(new Blockly.FieldDropdown(
            MINDUSTRY_LOCATE_BUILDINGS.map(b => [b, b])
          ), 'TYPE')
          .appendField('enemy');
    }

    if (hasField('ORE')) {
      this.appendValueInput('ORE')
          .appendField('ore');
    }

    const input = this.appendDummyInput('OUT')
        .appendField('outX')
        .appendField(new Blockly.FieldTextInput('outx'), 'OUT_X')
        .appendField('outY')
        .appendField(new Blockly.FieldTextInput('outy'), 'OUT_Y')
        .appendField('found')
        .appendField(new Blockly.FieldTextInput('found'), 'FOUND')

    if (hasField('BUILDING')) {
      input
        .appendField('building')
        .appendField(new Blockly.FieldTextInput('building'), 'BUILDING');
    }
  },
/*
  // store the rule type in xml
  mutationToDom() {
    const container = document.createElement('mutation');
    container.setAttribute('TARGET', this.targetType);
    return container;
  },

  // load rule type from xml
  domToMutation(xml) {
    const type = xml.getAttribute('TARGET');
    if (typeof type !== 'undefined')
      this.targetType = type;
    this.updateShape();
  }*/
};

Blockly.Mindustry['mind_unit_locate'] = block => {
  const targetArgs = {
    building: [
      ['field', 'TARGET'],
      ['field', 'TYPE'],
      ['value', 'ENEMY'],
      ['raw', '@copper'],
      ['field', 'OUT_X'],
      ['field', 'OUT_Y'],
      ['field', 'FOUND'],
      ['field', 'BUILDING'],
    ],
    ore: [
      ['field', 'TARGET'],
      ['raw', 'core'],
      ['raw', 'true'],
      ['value', 'ORE'],
      ['field', 'OUT_X'],
      ['field', 'OUT_Y'],
      ['field', 'FOUND'],
      ['raw', 'building'],
    ],
    spawn: [
      ['field', 'TARGET'],
      ['raw', 'core'],
      ['raw', 'true'],
      ['raw', '@copper'],
      ['field', 'OUT_X'],
      ['field', 'OUT_Y'],
      ['field', 'FOUND'],
      ['field', 'BUILDING'],
    ],
    damaged: [
      ['field', 'TARGET'],
      ['raw', 'core'],
      ['raw', 'true'],
      ['raw', '@copper'],
      ['field', 'OUT_X'],
      ['field', 'OUT_Y'],
      ['field', 'FOUND'],
      ['field', 'BUILDING'],
    ],
  };

  const target = block.getFieldValue('TARGET');
  return Blockly.Mindustry.easyAssemble(block, 'ulocate', ...targetArgs[target]);
};

const operatorHelper = (name, items, unary) => {
  Blockly.Blocks['mind_op_var_' + name] = {
    init: function() {
      if (!unary) {
        this.appendValueInput('A')
      }
      this.appendValueInput(unary ? 'A' : 'B')
          .appendField(new Blockly.FieldDropdown(items), 'OPERATOR')
      this.setInputsInline(!unary);
      this.setOutput(true, null);
      this.setStyle('block_variable');
      this.setTooltip('');
      //this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.Blocks['mind_op_set_' + name] = {
    init: function() {
      if (!unary) {
        this.appendValueInput('A')
          .appendField(new Blockly.FieldTextInput('result'), 'DEST')
          .appendField('=');
      }
      const val = this.appendValueInput(unary ? 'A' : 'B')
      if (unary) {
        val
          .appendField(new Blockly.FieldTextInput('result'), 'DEST')
          .appendField('=');
      }
      val.appendField(new Blockly.FieldDropdown(items), 'OPERATOR')
      this.setInputsInline(!unary);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle('block_variable');
      this.setTooltip('');
      //this.setHelpUrl('http://www.example.com/');
    }
  };

  const opFn = (destFn, varMode) => block => {
    const op = block.getFieldValue('OPERATOR');
    const aCode = Blockly.Mindustry.valueToCode(block, 'A', 0);
    const [a, aBefore] = Blockly.Mindustry.extractVar(aCode);
    let before, b;

    if (unary) {
      before = aBefore.join('\n');
    } else {
      const bCode = unary ? '' : Blockly.Mindustry.valueToCode(block, 'B', 1);
      const [bVal, bBefore] = Blockly.Mindustry.extractVar(bCode);
      b = bVal;

      before = [].concat(
        aBefore,
        bBefore,
      ).join('\n');
    }

    const dest = destFn(block);
    const code = `${before}\nop ${op} ${dest} ${a} ${unary ? a : b}` + (varMode ? `\n${dest}` : '');
    return varMode ? [code, 0] : code;
  }

  Blockly.Mindustry['mind_op_var_' + name] = opFn(() => Blockly.Mindustry.temp(), true);

  Blockly.Mindustry['mind_op_set_' + name] = opFn(block => block.getFieldValue('DEST'), false);
}

operatorHelper('binary', MINDUSTRY_BINARY_OPS);
operatorHelper('unary', MINDUSTRY_UNARY_OPS, true);

const easyHelper = ({prefix, op, style, name, args, numArgs}) => {
  Blockly.Blocks[prefix + name] = {
    init: function() {
      if (args.length === 1) {
          this.appendValueInput(args[0] || 'arg_0')
            .appendField(name)
            .appendField(args[0] || '');
      } else {
        this.appendDummyInput()
          .appendField(name);
        args.forEach((a, i) => {
          this.appendValueInput(a || 'arg_' + i)
              .appendField(a);
        });
      }
      this.setInputsInline(args.length !== 1);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setStyle(style);
      this.setTooltip('');
      //this.setHelpUrl('http://www.example.com/');
    }
  };

  Blockly.Mindustry[prefix + name] = function(block) {
    const vals = Array(numArgs).fill(['raw', '0']);
    args.forEach((arg, i) => {
      vals[i] = ['value', arg || 'arg_' + i]
    });

    return Blockly.Mindustry.easyAssemble(block,
      op,
      ['raw', name],
      ...vals,
    );
  };
};

Object.entries(MINDUSTRY_UNIT_CONTROL).map(([name, args]) =>
  easyHelper({
    prefix: 'mind_unit_control_',
    op: 'ucontrol',
    style: 'block_unit',
    name,
    args,
    numArgs: 5,
  }));

Object.entries(MINDUSTRY_DRAW_OPS).map(([name, args]) =>
  easyHelper({
    prefix: 'mind_draw_',
    op: 'draw',
    style: 'block_output',
    name,
    args,
    numArgs: 6,
  }));

Blockly.Blocks['loop_repeat_i'] = {
  init: function() {
    this.appendValueInput('TIMES')
        .setCheck(null)
        .appendField('repeat');
    this.appendDummyInput()
        .appendField('times with')
        .appendField(new Blockly.FieldTextInput('i'), 'VAR');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setStyle('block_loop');
    // this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['loop_repeat_i'] = function(block) {
  const timesCode = Blockly.Mindustry.valueToCode(block, 'TIMES', 0);
  const [timesVar, timesBefore] = Blockly.Mindustry.extractVar(timesCode);
  const varName = block.getFieldValue('VAR');
  const label = Blockly.Mindustry.temp();

  const body = Blockly.Mindustry.statementToCode(block, 'BODY');

  return timesBefore.concat([
    `set ${varName} 0`,
    `ASM:LABEL __loop${label}`,
    `ASM:JUMP __loop${label}_end greaterThanEq ${varName} ${timesVar}`,
    body,
    `op add ${varName} ${varName} 1`,
    `ASM:JUMP:ALWAYS __loop${label}`,
    `ASM:LABEL __loop${label}_end`,
  ]).join('\n');
};


Blockly.Blocks['loop_repeat_while'] = {
  init: function() {
    this.appendValueInput('COND')
        .setCheck(null)
        .appendField('repeat while');
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setStyle('block_loop');
    // this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['loop_repeat_while'] = function(block) {
  const condCode = Blockly.Mindustry.valueToCode(block, 'COND', 0);
  const [condVar, condBefore] = Blockly.Mindustry.extractVar(condCode);

  const label = Blockly.Mindustry.temp();

  const body = Blockly.Mindustry.statementToCode(block, 'BODY');

  return [].concat([
    `ASM:LABEL __loop${label}`
  ], condBefore, [
    `ASM:JUMP __loop${label}_end notEqual ${condVar} true`,
    body,
    `ASM:JUMP:ALWAYS __loop${label}`,
    `ASM:LABEL __loop${label}_end`,
  ]).join('\n');
};

Blockly.Blocks['loop_for'] = {
  init: function() {
    this.appendValueInput('INIT')
        .setCheck(null)
        .appendField('repeat from')
    this.appendValueInput('TO')
        .setCheck(null)
        .appendField('to');
    this.appendValueInput('STEP')
        .setCheck(null)
        .appendField('step');
    this.appendDummyInput()
        .appendField('with')
        .appendField(new Blockly.FieldTextInput('i'), 'VAR')
    this.appendStatementInput('BODY')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Up to but not including (i < x)');
    this.setStyle('block_loop');
    // this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Mindustry['loop_for'] = function(block) {
  const initCode = Blockly.Mindustry.valueToCode(block, 'INIT', 0);
  const [initVar, initBefore] = Blockly.Mindustry.extractVar(initCode);
  const toCode = Blockly.Mindustry.valueToCode(block, 'TO', 0);
  const [toVar, toBefore] = Blockly.Mindustry.extractVar(toCode);
  const stepCode = Blockly.Mindustry.valueToCode(block, 'STEP', 0);
  const [stepVar, stepBefore] = Blockly.Mindustry.extractVar(stepCode);

  const varName = block.getFieldValue('VAR');
  const label = Blockly.Mindustry.temp();

  const body = Blockly.Mindustry.statementToCode(block, 'BODY');

  return initBefore.concat([
    toBefore,
    stepCode,
    `set ${varName} ${initVar}`,
    `ASM:LABEL __loop${label}`,
    `ASM:JUMP __loop${label}_end greaterThanEq ${varName} ${toVar}`,
    body,
    `op add ${varName} ${varName} ${stepVar}`,
    `ASM:JUMP:ALWAYS __loop${label}`,
    `ASM:LABEL __loop${label}_end`,
  ]).join('\n');
};