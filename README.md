# 🤖 Probot Blocks

**Probot Blocks** is a block-based coding tool compatible with probot-lib. This tool allows you to easily program your robotics projects using visual blocks and generates C++ code that can be used in Arduino IDE.

## 🚀 Features

- **Visual Block Editor**: Google Blockly-based drag-and-drop interface
- **Probot-lib Compatibility**: Full integration with NFR Probot library
- **Live Code Preview**: Real-time C++ code display while editing blocks
- **Project Management**: Save/load block projects (.probot.json format)
- **Arduino IDE Compatibility**: Direct .ino file download
- **Turkish Interface**: Complete Turkish user experience
- **Driver Station Integration**: Automatic password generation and management
- **Responsive Design**: Optimal usage on desktop and tablet devices

## 🛠 Technologies

- **React 19** + **TypeScript** - Modern frontend development
- **Vite** - Fast development and build system
- **Google Blockly** - Visual programming editor
- **Highlight.js** - Code syntax highlighting
- **probot-lib** - NFR Robotics library support

## 📦 Installation

### Requirements
- Node.js 18+
- npm or yarn

### Running the Project

```bash
# Clone the repository
git clone https://github.com/your-username/probot-blocks.git
cd probot-blocks

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run at `http://localhost:5173`.

### Production Build

```bash
# Create build
npm run build

# Preview build
npm run preview
```

## 🎯 Usage

### Basic Usage

1. **Block Selection**: Choose blocks from the category menu on the left
2. **Block Placement**: Drag and drop blocks into the workspace
3. **Code Preview**: View the generated C++ code in the right panel
4. **Project Saving**: Save your project with the "Download Blocks" button
5. **Arduino IDE Transfer**: Download Arduino sketch with ".ino Download" button

### Block Categories

- **Control**: Loops, conditions, flow control
- **Logic**: Boolean operations, comparisons
- **Math**: Arithmetic operations, math functions
- **Text**: String operations and manipulation
- **Lists**: Array operations
- **Variables**: Variable definition and usage
- **Arduino**: Basic Arduino functions (digitalWrite, delay, Serial.print)
- **Probot**: NFR Probot-lib special blocks (motor control, sensors)

### Probot Lifecycle Blocks

Probot framework lifecycle functions:
- `robotInit`: Runs once when the robot starts
- `robotEnd`: Called when the robot shuts down
- `autonomousInit`: Runs before autonomous mode starts
- `autonomousPeriodic`: Runs continuously in autonomous mode
- `teleopInit`: Runs before teleop mode starts
- `teleopPeriodic`: Runs continuously in teleop mode

## 📁 Project Structure

```
probot-blocks/
├── src/
│   ├── blockly/          # Blockly configuration
│   │   ├── blocks.ts     # Custom block definitions
│   │   └── generator.ts  # C++ code generator
│   ├── App.tsx           # Main application component
│   ├── App.css          # Style file
│   └── main.tsx         # Application entry point
├── public/              # Static files
├── dist/                # Build output
└── package.json         # Project configuration
```

## 🔧 Development

### Adding Custom Blocks

To add new blocks, edit the `src/blockly/blocks.ts` file:

```typescript
// New block definition
const myCustomBlock = {
  type: 'my_custom_block',
  message0: 'Custom Block %1',
  args0: [
    {
      type: 'input_value',
      name: 'INPUT'
    }
  ],
  colour: 160,
  tooltip: 'This is my custom block',
  helpUrl: ''
}
```

### Code Generator Update

Add the code generator for the new block in `src/blockly/generator.ts`:

```typescript
javascriptGenerator.forBlock['my_custom_block'] = function(block, generator) {
  const input = generator.valueToCode(block, 'INPUT', Order.NONE) || '""'
  return `myCustomFunction(${input});\n`
}
```

### Lint and Type Check

```bash
# ESLint check
npm run lint

# TypeScript type check
npm run type-check
```

## 📖 API Documentation

### Probot Blocks

#### NFR Motor Block
```cpp
// Block: probot_nfr_motor
// Generated code:
nfr.forward(100);    // Move forward
nfr.backward(50);    // Move backward
nfr.turnRight(75);   // Turn right
nfr.turnLeft(75);    // Turn left
nfr.stop();          // Stop
```

### Driver Station Integration

The application automatically generates a Driver Station password and includes it in the project. Password format: `PB-XXX-XXX` (e.g., PB-A2F-9K3)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Commit Message Format

This project uses [Conventional Commits](https://conventionalcommits.org/) standard:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Build system, dependency updates

## 📝 License

This project has dual licensing:
- **Open Source Usage**: MIT License - see `LICENSE` file
- **Commercial Usage**: Commercial license required - see `LICENSE-commercial` file

For detailed information, contact NFR Robotics.

## 🏢 About NFR Robotics

NFR Robotics is Turkey's leading robotics education and technology development company. Probot Blocks is an open-source project developed for educational institutions and robotics enthusiasts.

**Contact:**
- Web: [nfr.com.tr](https://nfr.com.tr)
- Email: info@nfr.com.tr

## 🙏 Acknowledgments

- [Google Blockly](https://developers.google.com/blockly) - Visual programming editor
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting

---

**Probot Blocks** - Bring your robotics projects to life easily! 🚀🤖