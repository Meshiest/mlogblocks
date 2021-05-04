Blockly.Mindustry['procedures_defreturn'] = block => {
  const func = block.getFieldValue('NAME').replace(/ /g, '_');

  const oldFunc = Blockly.Mindustry._currFunc;
  Blockly.Mindustry._currFunc = func;

  const branch = Blockly.Mindustry.statementToCode(block, 'STACK');
  const returnCode = Blockly.Mindustry.valueToCode(block, 'RETURN', 0);
  const [returnVar, returnBefore] = Blockly.Mindustry.extractVar(returnCode);

  Blockly.Mindustry._currFunc = oldFunc;

  const lines = [
    `ASM:LABEL __func_${func}`,
    branch,
    ...returnBefore,
    `set __returnVar${func} ${returnVar}`,
    `set @counter __popstack${func}`,
  ];

  return lines.join('\n');
};

Blockly.Mindustry['procedures_defnoreturn'] =
    Blockly.Mindustry['procedures_defreturn'];

Blockly.Mindustry['procedures_callreturn'] = block => {
  const func = block.getFieldValue('NAME').replace(/ /g, '_');
  return [Blockly.Mindustry['procedures_callnoreturn'](block) + '\n__returnVar' + func, 0];
};

Blockly.Mindustry['procedures_callnoreturn'] = block => {
  const func = block.getFieldValue('NAME').replace(/ /g, '_');

  const variables = block.getVars();
  const lines = variables.flatMap((v, i) => {
    const varCode = Blockly.Mindustry.valueToCode(block, 'ARG' + i, 0);
    const [varName, varBefore] = Blockly.Mindustry.extractVar(varCode);
    return varBefore.concat([
      `set ${variables[i]} ${varName}`,
    ]);
  });

  lines.push(
    // don't update the pop pointer in a recursive function
    Blockly.Mindustry._currFunc === func
      ? ''
      : `op add __popstack${func} @counter 1`,
    `ASM:JUMP:ALWAYS __func_${func}`,
  )

  return lines.join('\n');
};

Blockly.Mindustry['procedures_ifreturn'] = block => {
  // Conditionally return value from a procedure.
  const condCode = Blockly.Mindustry.valueToCode(block, 'CONDITION', 0);
  const [condVar, condBefore] = Blockly.Mindustry.extractVar(condCode);

  const returnCode = Blockly.Mindustry.valueToCode(block, 'VALUE', 0);
  const [returnVar, returnBefore] = Blockly.Mindustry.extractVar(returnCode);

  const label = Blockly.Mindustry.temp();

  condBefore.push(
    `ASM:JUMP __ifreturn${label} notEqual ${condVar} false`,
    `ASM:JUMP:ALWAYS __ifreturnelse${label}`,
    `ASM:LABEL __ifreturn${label}`,
  );

  if (block.hasReturnValue_) {
    condBefore.push(
      ...returnBefore,
      `set __returnVar${Blockly.Mindustry._currFunc} ${returnVar}`,
    );
  }

  condBefore.push(
    `set @counter __popstack${Blockly.Mindustry._currFunc}`,
    `ASM:LABEL __ifreturnelse${label}`
  );

  return condBefore.join('\n');
};

Blockly.Mindustry['controls_if'] = block => {
  // If/elseif/else condition.
  const label = Blockly.Mindustry.temp();

  const code = [];
  const branchCode = [];

  for (let i = 0; block.getInput('IF' + i); i++) {
    const condCode = Blockly.Mindustry.valueToCode(block, 'IF' + i, 0);
    const [condVar, condBefore] = Blockly.Mindustry.extractVar(condCode);

    code.push(
      ...condBefore,
      `ASM:JUMP __if_${label}_${i} notEqual ${condVar} false`,
    );

    branchCode.push(
      `ASM:LABEL __if_${label}_${i}`,
      Blockly.Mindustry.statementToCode(block, 'DO' + i),
      `ASM:JUMP:ALWAYS __if_${label}_end`,
    );
  }

  // the last jump is redundant as it would jump to the next line
  branchCode.pop();

  return [].concat(
    code,
    block.getInput('ELSE')
      ? Blockly.Mindustry.statementToCode(block, 'ELSE')
      : [],
    [`ASM:JUMP:ALWAYS __if_${label}_end`],
    branchCode,
    [`ASM:LABEL __if_${label}_end`],
  ).join('\n');

};

Blockly.Mindustry['controls_ifelse'] = Blockly.Mindustry['controls_if'];

Blockly.Mindustry['logic_ternary'] = block => {
  const label = Blockly.Mindustry.temp();
  const returnVar = `__ternary${label}_return`;
  const code = [];
  const branchCode = [];

  const condCode = Blockly.Mindustry.valueToCode(block, 'IF', 0);
  const [condVar, condBefore] = Blockly.Mindustry.extractVar(condCode);

  const thenCode = Blockly.Mindustry.valueToCode(block, 'THEN', 0);
  const [thenVar, thenBefore] = Blockly.Mindustry.extractVar(thenCode);

  const elseCode = Blockly.Mindustry.valueToCode(block, 'ELSE', 0);
  const [elseVar, elseBefore] = Blockly.Mindustry.extractVar(elseCode);

  return [[].concat(
    // run the condition code
    condBefore,
    // jump to the condition label if true
    [`ASM:JUMP __ternary${label} notEqual ${condVar} false`],
    // otherwise run else/if false code
    elseBefore,
    [
      // set the return variable to the else output
      `set ${returnVar} ${elseVar}`,
      `ASM:JUMP:ALWAYS __ternary${label}_end`,
      // label for if true branch
      `ASM:LABEL __ternary${label}`,
    ],
    // run the if true code
    thenBefore,
    [
      // set the return variable to the if true output
      `set ${returnVar} ${thenVar}`,
      // end label
      `ASM:LABEL __ternary${label}_end`,
    ],
    // final line is the variable id
    returnVar,
  ).join('\n'), 0];
};