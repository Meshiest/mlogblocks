Blockly.Mindustry = new Blockly.Generator('Mindustry');

// Escape a string
const escapeStr = str => str
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"');

Blockly.Mindustry.init = workspace => {
  Blockly.Mindustry._functions = [];
  Blockly.Mindustry._tempVars = 0;
};

Blockly.Mindustry.finish = code => {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l.length);

  // TODO: compiler optimizations can go here
  // scan labels from lines
  const labels = {};
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('ASM:LABEL')) {
      const [line] = lines.splice(i, 1);
      const label = line.split(' ')[1];
      console.debug('[asm] detected label', label, 'at line', i);
      labels[label] = i--;
    }
  }

  console.debug('[asm] detected labels:', labels);

  // insert labels as line numbers
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('ASM:JUMP')) {
      // break line by spaces
      const [_, label, ...args] = lines[i].split(' ');

      // figure out which line the label pointed to
      const lineNum = typeof labels[label] === 'undefined' ? -1 : labels[label];
      console.debug('[asm] inserting label', label, '->', lineNum, 'into jump at', i);

      // create the new line
      let newLine = `jump ${lineNum} ${args.join(' ')}`;
      if (lines[i].startsWith('ASM:JUMP:ALWAYS')) {
        newLine = 'set @counter ' + lineNum;
      }


      // insert replace the old line
      lines.splice(i, 1, newLine);
    }
  }

  return lines.join('\n') + '\n';
};

Blockly.Mindustry.scrubNakedValue = function(line) {
  return line + '\n';
};

Blockly.Mindustry.temp = () => {
  return '_temp'+Blockly.Mindustry._tempVars++;
};

Blockly.Mindustry.extractVar = code => {
  const lines = (code || '').split('\n').filter(l => l);
  if (lines.length === 0) return ['', []];
  return [lines.pop(), lines];
};

// easy assembly of generic instructions
Blockly.Mindustry.easyAssemble = (block, op, ...args) => {
  const before = [];
  const argVals = [];
  for (const [type, name] of args) {
    let value = type === 'field'
      ? block.getFieldValue(name) || '0'
      : type === 'value'
        ? Blockly.Mindustry.valueToCode(block, name, 0) || '0'
        : type === 'raw' ? name : (()=>{throw new Error('invalid arg type in ' + op)})();

    if (type === 'value') {
      const [valVar, valBefore] = Blockly.Mindustry.extractVar(value);
      before.push(...valBefore);
      value = valVar;
    }
    argVals.push(value);
  }

  const code = (before.length > 0 ? before.join('\n') + '\n' : '') +
    op + ' ' +
    argVals.join(' ');

  return code;
}

// concat statements together
Blockly.Mindustry.scrub_ = function(block, code, opt_thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = opt_thisOnly ? '' : Blockly.Mindustry.blockToCode(nextBlock);
  console.log('Returning', code + '\n' + nextCode)
  return code + '\n' + nextCode;
};
