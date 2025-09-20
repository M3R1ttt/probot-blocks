import * as Blockly from 'blockly/core'

const lifecycleHue = 210
const probotHue = 200

const lifecycleBlockDefinitions = [
  {
    type: 'probot_robot_init',
    message0: 'robotInit',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Robot açıldığında bir kez çalışır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
  {
    type: 'probot_robot_end',
    message0: 'robotEnd',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Robot kapanırken çağrılır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
  {
    type: 'probot_autonomous_init',
    message0: 'autonomousInit',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Otonom mod başlamadan önce bir kez çalışır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
  {
    type: 'probot_autonomous_loop',
    message0: 'autonomousLoop',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Otonom modda tekrar tekrar çalışır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
  {
    type: 'probot_teleop_init',
    message0: 'teleopInit',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Teleop mod başlamadan önce bir kez çalışır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
  {
    type: 'probot_teleop_loop',
    message0: 'teleopLoop',
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'BODY',
      },
    ],
    colour: lifecycleHue,
    tooltip: 'Teleop mod sırasında tekrar tekrar çalışır.',
    helpUrl: '',
    extensions: ['probot_lifecycle_extension'],
  },
]

const customBlockDefinitions = [
  {
    type: 'probot_nfr_motor',
    message0: 'NFRMotor %1 pin %2',
    args0: [
      {
        type: 'field_variable',
        name: 'INSTANCE',
        variable: 'motor',
      },
      {
        type: 'field_number',
        name: 'PIN',
        value: 1,
        min: 0,
        precision: 1,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: probotHue,
    tooltip: 'Belirtilen pine bağlı bir NFRMotor nesnesi oluşturur.',
    helpUrl: '',
  },
  {
    type: 'arduino_digital_write',
    message0: 'digitalWrite pin %1 durum %2',
    args0: [
      {
        type: 'field_number',
        name: 'PIN',
        value: 13,
        min: 0,
        precision: 1,
      },
      {
        type: 'field_dropdown',
        name: 'STATE',
        options: [
          ['HIGH', 'HIGH'],
          ['LOW', 'LOW'],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 50,
    tooltip: 'Bir pini HIGH ya da LOW seviyesine çeker.',
    helpUrl: '',
  },
  {
    type: 'arduino_delay',
    message0: 'delay %1 ms',
    args0: [
      {
        type: 'input_value',
        name: 'DELAY',
        check: 'Number',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 50,
    tooltip: 'Belirtilen süre boyunca bekler.',
    helpUrl: '',
  },
  {
    type: 'arduino_serial_print',
    message0: 'Serial.println %1',
    args0: [
      {
        type: 'input_value',
        name: 'TEXT',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 10,
    tooltip: 'Seri porta bir satır yazdırır.',
    helpUrl: '',
  },
]

let blocksRegistered = false

const lifecycleExtension = function (this: Blockly.Block) {
  this.setDeletable(false)
  this.setMovable(true)
}

export const registerProbotBlocks = () => {
  if (blocksRegistered) {
    return
  }

  Blockly.Extensions.register('probot_lifecycle_extension', lifecycleExtension)

  Blockly.common.defineBlocksWithJsonArray([
    ...lifecycleBlockDefinitions,
    ...customBlockDefinitions,
  ])

  blocksRegistered = true
}

export const lifecycleBlocks = [
  'probot_robot_init',
  'probot_robot_end',
  'probot_autonomous_init',
  'probot_autonomous_loop',
  'probot_teleop_init',
  'probot_teleop_loop',
]
