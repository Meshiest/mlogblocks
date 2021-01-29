Blockly.Mindustry['procedures_defreturn'] = block => {
  const func = block.getFieldValue('NAME').replace(/ /g, '_');

  const branch = Blockly.Mindustry.statementToCode(block, 'STACK');
  const returnCode = Blockly.Mindustry.valueToCode(block, 'RETURN', 0);
  const [returnVar, returnBefore] = Blockly.Mindustry.extractVar(returnCode);

  const lines = [
    `ASM:LABEL __func_${func}`,
    branch,
    ...returnBefore,
    `set __returnVar ${returnVar}`,
    'set @counter __popstack',
  ];

  return lines.join('\n');
};

Blockly.Mindustry['procedures_defnoreturn'] =
    Blockly.Mindustry['procedures_defreturn'];

Blockly.Mindustry['procedures_callreturn'] = block => {
  return [Blockly.Mindustry['procedures_callnoreturn'](block) + '\n__returnVar', 0];
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
    'op add __popstack @counter 1',
    `ASM:JUMP:ALWAYS __func_${func}`,
  )

  return lines.join('\n');
};

Blockly.Mindustry['procedures_ifreturn'] = block => {
  // Conditionally return value from a procedure.
  const condCode = Blockly.Mindustry.valueToCode(block, 'CONDITION', 0);
  const [condVar, condBefore] = Blockly.Mindustry.extractVar(condCode);

  const returnCode = Blockly.Mindustry.valueToCode(block, 'RETURN', 0);
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
      `set __returnVar ${returnVar}`,
    );
  }

  condBefore.push(
    'set @counter __popstack',
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
