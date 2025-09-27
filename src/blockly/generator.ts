import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript'

const getVariableName = (block: Blockly.Block, fieldName: string) => {
  const variableName = block.getFieldValue(fieldName)
  // Use Blockly's proper API for variable name generation
  return javascriptGenerator.getVariableName(variableName)
}

const lifecycleOrder: Array<{ type: string; signature: string }> = [
  { type: 'probot_robot_init', signature: 'void robotInit()' },
  { type: 'probot_robot_end', signature: 'void robotEnd()' },
  { type: 'probot_autonomous_init', signature: 'void autonomousInit()' },
  { type: 'probot_autonomous_loop', signature: 'void autonomousLoop()' },
  { type: 'probot_teleop_init', signature: 'void teleopInit()' },
  { type: 'probot_teleop_loop', signature: 'void teleopLoop()' },
]

const indentCode = (code: string, level = 1) => {
  if (!code.trim()) {
    return '  '.repeat(level) + '// Henüz blok eklenmedi'
  }

  const indentation = '  '.repeat(level)
  return code
    .split('\n')
    .filter((line, index, array) => !(line.trim() === '' && index === array.length - 1))
    .map((line) => (line.trim().length ? `${indentation}${line}` : ''))
    .join('\n')
}

const sanitise = (code: string) => {
  let result = code
  result = result.replace(/var\s+/g, 'auto ')
  result = result.replace(/let\s+/g, 'int ')
  result = result.replace(/for \(auto /g, 'for (int ')
  result = result.replace(/for \(int ([^)]+); ([^;]+); ([^)]+)\+\+\)/g, 'for (int $1; $2; $3++)')
  result = result.replace(/Number\(([^)]+)\)/g, '$1')
  result = result.replace(/Math\./g, '')
  result = result.replace(/window\.alert/g, 'Serial.println')
  return result.trimEnd()
}

javascriptGenerator.forBlock['probot_nfr_motor'] = function (block) {
  const name = getVariableName(block, 'INSTANCE')
  const pin = block.getFieldValue('PIN')
  return `NFRMotor ${name}(${pin});\n`
}

javascriptGenerator.forBlock['arduino_digital_write'] = function (block) {
  const pin = block.getFieldValue('PIN')
  const state = block.getFieldValue('STATE')
  return `digitalWrite(${pin}, ${state});\n`
}

javascriptGenerator.forBlock['arduino_delay'] = function (block) {
  const value = javascriptGenerator.valueToCode(block, 'DELAY', Order.NONE) || '0'
  return `delay(${value});\n`
}

javascriptGenerator.forBlock['arduino_serial_print'] = function (block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""'
  return `Serial.println(${text});\n`
}

javascriptGenerator.forBlock['arduino_serial_print_raw'] = function (block) {
  const text = javascriptGenerator.valueToCode(block, 'TEXT', Order.NONE) || '""'
  return `Serial.print(${text});\n`
}

javascriptGenerator.forBlock['controls_repeat_ext'] = function (block) {
  const repeats = javascriptGenerator.valueToCode(block, 'TIMES', Order.ASSIGNMENT) || '0'
  const branch = javascriptGenerator.statementToCode(block, 'DO')
  // Use a simple counter variable name for C++ loops
  const loopVar = 'i'
  return `for (int ${loopVar} = 0; ${loopVar} < ${repeats}; ${loopVar}++) {\n${branch}}\n`
}

export const generateProbotCode = (workspace: Blockly.Workspace, password = 'ProBot1234') => {
  javascriptGenerator.init(workspace)

  const prologue = [
    '// Generated with Probot Blocks',
    '',
    '#include <Arduino.h>',
    '#include <probot.h>',
    '',
    `PROBOT_SET_DRIVER_STATION_PASSWORD("${password.replace(/"/g, '\\"')}");`,
    '// TODO: Şifreyi ve gerekli ek kütüphaneleri ihtiyaçlarınıza göre güncelleyin',
  ]

  const sections = lifecycleOrder.map(({ type, signature }) => {
    const block = workspace.getBlocksByType(type, false)[0]
    if (!block) {
      return `${signature} {\n  // Bu yaşam döngüsü bloğu henüz eklenmedi\n}`
    }

    const body = javascriptGenerator.statementToCode(block, 'BODY')
    const cleaned = sanitise(body)
    return `${signature} {\n${indentCode(cleaned)}\n}`
  })

  javascriptGenerator.finish('')

  return [...prologue, ...sections].join('\n\n')
}

export const lifecycleBlockOrder = lifecycleOrder
