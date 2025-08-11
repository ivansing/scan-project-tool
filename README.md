# Scan Project Tool

A professional command-line application built with Node.js that analyzes project directory structures and file contents using OpenAI's API. This tool provides intelligent code analysis and project insights through customizable prompts and multiple AI models.

## Features

- **Intelligent Project Scanning**: Recursively analyzes project directories with smart exclusions for build artifacts, dependencies, and sensitive files
- **Selective File Analysis**: Processes source code files with support for JavaScript, Python, TypeScript/JSX, and JSON formats
- **OpenAI Integration**: Leverages multiple OpenAI models (GPT-3.5-turbo, GPT-4o-mini) for comprehensive code analysis
- **Flexible Configuration**: Command-line options for model selection and custom analysis prompts
- **Modular Architecture**: Clean separation of concerns with dedicated modules for scanning, analysis, and CLI operations
- **Production Ready**: Comprehensive test coverage with unit and integration tests

## Prerequisites

- **Node.js** v14 or later
- **npm** package manager
- **OpenAI API Key** with appropriate billing setup

## Installation

### 1. Environment Setup
```bash
git clone <repository-url>
cd scan_project
npm install
```

### 2. Configuration
Create a `.env` file in the project root:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Verification
```bash
npm test
npm run test:integration
```

### 4. Global Installation (Optional)
```bash
sudo ln -sf $(pwd)/src/cli.mjs /usr/local/bin/scan_project_tool
```

## Usage

### Project Structure Analysis
Analyze entire project directory with intelligent AI insights:
```bash
node src/cli.mjs --read --model gpt-4o-mini
```

### Individual File Analysis
Process specific source files with custom prompts:
```bash
node src/cli.mjs --file src/components/App.tsx --model gpt-3.5-turbo --prompt "Review this component for best practices"
```

### Command Line Options
| Option | Description | Example Values |
|--------|-------------|----------------|
| `--read` | Include file contents in project scan | - |
| `--file` | Analyze specific file | `src/index.js` |
| `--model` | OpenAI model selection | `gpt-3.5-turbo`, `gpt-4o-mini` |
| `--prompt` | Custom analysis prompt | `"Review for security issues"` |

### Supported File Types
- JavaScript (`.js`)
- Python (`.py`) 
- TypeScript/JSX (`.tsx`)
- JSON configuration (`.json`)

## Architecture

```
scan_project/
├── src/
│   ├── scanner.mjs       # File system scanning and content extraction
│   ├── analyzer.mjs      # OpenAI API integration and response handling  
│   └── cli.mjs           # Command-line interface and argument parsing
├── test/
│   ├── scanner-only.test.mjs    # Unit tests for core functionality
│   └── integration.test.mjs     # End-to-end CLI testing
├── package.json          # Dependencies and npm scripts
└── .env                  # Environment configuration (not tracked)
```

## Testing

The project includes comprehensive test coverage:

```bash
# Run unit tests
npm test

# Run integration tests  
npm run test:integration
```

**Test Coverage:**
- File system scanning operations
- Content filtering and exclusions
- CLI argument parsing
- Error handling scenarios
- OpenAI API integration points

## Technical Specifications

- **Runtime**: Node.js ES Modules
- **Dependencies**: OpenAI SDK, dotenv, file system utilities
- **Code Quality**: Modular design with separation of concerns
- **Error Handling**: Graceful degradation for network/API failures
- **Security**: Environment-based API key management

## Development Roadmap

- Multi-format export capabilities (JSON, Markdown, CSV)
- Advanced filtering and exclusion patterns  
- Integration with additional AI providers
- Performance optimization for large codebases
- Web interface development

## License

MIT License - See LICENSE file for details

## Author

Ivan Duarte

---

*Professional AI-powered code analysis tool for modern development workflows*

