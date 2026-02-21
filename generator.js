Blockly.Mindustry = new Blockly.Generator('Mindustry');

// Escape a string
const escapeStr = str => str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

Blockly.Mindustry.init = workspace => {
  Blockly.Mindustry._functions = [];
  Blockly.Mindustry._tempVars = 0;
  if (!Blockly.Mindustry.variableDB_) {
    Blockly.Mindustry.variableDB_ = new Blockly.Names(
      Blockly.Mindustry.RESERVED_WORDS_
    );
  } else {
    Blockly.Mindustry.variableDB_.reset();
  }
  Blockly.Mindustry.variableDB_.setVariableMap(workspace.getVariableMap());
};

Blockly.Mindustry.finish = code => {
  const lines = code
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length);

  // TODO: compiler optimizations can go here
  // - functions only invoked once can be spliced into the function call
  // - functions never invoked can be removed
  // - op <cond> that immediately go into a jump can be put in the jump
  // - set temp followed by another set with the same var can be collapsed
  //
  // scan labels from lines

  // optimize out redundant instructions
  let reduced = 0;
  for (let i = 1; i < lines.length; i++) {
    // cut out needless ops before a jump
    if (lines[i].startsWith('ASM:JUMP ') && lines[i - 1].startsWith('op ')) {
      const prevLine = lines[i - 1].match(
        /^op (?<op>equal|notEqual|strictEqual|lessThan|lessThanEq|greaterThan|greaterThanEq) (?<tempVar>_temp\d+) (?<rest>.+)$/
      );
      const curLine = lines[i].match(
        /^ASM:JUMP (?<label>[^ ]+) notEqual (?<tempVar>_temp\d+) false$/
      );
      if (
        curLine &&
        prevLine &&
        curLine.groups.tempVar === prevLine.groups.tempVar
      ) {
        lines[
          i
        ] = `ASM:JUMP ${curLine.groups.label} ${prevLine.groups.op} ${prevLine.groups.rest}`;
        lines.splice(i - 1, 1);
        reduced++;
      }

      // fold comparison op into select condition
    } else if (lines[i].startsWith('select ') && lines[i - 1].startsWith('op ')) {
      const prevLine = lines[i - 1].match(
        /^op (?<op>equal|notEqual|strictEqual|lessThan|lessThanEq|greaterThan|greaterThanEq) (?<tempVar>_temp\d+) (?<rest>.+)$/
      );
      const curLine = lines[i].match(
        /^select (?<dest>[^ ]+) notEqual (?<tempVar>_temp\d+) false (?<rest>.+)$/
      );
      if (
        curLine &&
        prevLine &&
        curLine.groups.tempVar === prevLine.groups.tempVar
      ) {
        lines[
          i
        ] = `select ${curLine.groups.dest} ${prevLine.groups.op} ${prevLine.groups.rest} ${curLine.groups.rest}`;
        lines.splice(i - 1, 1);
        reduced++;
      }

      // cut out sets with a temp when the temp was set the line before
    } else if (lines[i].startsWith('set ') && lines[i - 1].startsWith('op ')) {
      const prevLine = lines[i - 1].match(
        /^op (?<op>\w+) (?<tempVar>_temp\d+) (?<rest>.+)/
      );
      const curLine = lines[i].match(/^set (?<var>.+) (?<tempVar>_temp\d+)$/);
      if (
        curLine &&
        prevLine &&
        curLine.groups.tempVar === prevLine.groups.tempVar
      ) {
        lines[
          i
        ] = `op ${prevLine.groups.op} ${curLine.groups.var} ${prevLine.groups.rest}`;
        lines.splice(i - 1, 1);
        reduced++;
      }
    }
  }

  console.debug('[asm] optimized out', reduced, 'lines');

  // Remove `ASM:JUMP <VAR> notEqual true true`
  for (let i = 0; i < lines.length; i++) {
    if (/^ASM:JUMP .+? notEqual true true$/.test(lines[i])) {
      lines.splice(i, 1);
      i--;
    }
  }

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
      console.debug(
        '[asm] inserting label',
        label,
        '->',
        lineNum,
        'into jump at',
        i
      );

      // create the new line
      let newLine = `jump ${lineNum} ${args.join(' ')}`;
      if (lines[i].startsWith('ASM:JUMP:ALWAYS')) {
        newLine = `jump ${lineNum} always true true`;
      }

      // insert replace the old line
      lines.splice(i, 1, newLine);
    }
  }

  console.debug('[asm] compiled', lines.length, 'lines');
  Blockly.Mindustry.variableDB_.reset();

  return lines.join('\n') + '\n';
};

Blockly.Mindustry.scrubNakedValue = function (line) {
  return line + '\n';
};

Blockly.Mindustry.temp = () => {
  return '_temp' + Blockly.Mindustry._tempVars++;
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
    let value =
      type === 'field'
        ? block.getFieldValue(name) || '0'
        : type === 'value'
        ? Blockly.Mindustry.valueToCode(block, name, 0) || '0'
        : type === 'raw'
        ? name
        : (() => {
            throw new Error('invalid arg type in ' + op);
          })();

    if (type === 'value') {
      const [valVar, valBefore] = Blockly.Mindustry.extractVar(value);
      before.push(...valBefore);
      value = valVar;
    }
    argVals.push(value);
  }

  const code =
    (before.length > 0 ? before.join('\n') + '\n' : '') +
    op +
    ' ' +
    argVals.join(' ');

  return code;
};

// concat statements together
Blockly.Mindustry.scrub_ = function (block, code, opt_thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = opt_thisOnly ? '' : Blockly.Mindustry.blockToCode(nextBlock);
  return code + '\n' + nextCode;
};
