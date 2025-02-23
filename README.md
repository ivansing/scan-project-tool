# Scan Project Tool

Scan Project Tool is a command-line application built in Node.js that scans your project's directory structure, optionally reads file contents, and sends the information to OpenAI's API for analysis. The tool supports customization options such as choosing the OpenAI model and providing a custom analysis prompt.

## Features

- **Project Scanning:** Recursively scans a project directory, excluding directories and files that would overwhelm the analysis (e.g., `node_modules`, `.env`, and `package-lock.json`).
- **File Reading:** Optionally reads contents of files with allowed extensions (`.js`, `.py`, `.tsx`, `.json`).
- **OpenAI Integration:** Sends project structure or individual file content to the OpenAI API for detailed analysis.
- **Customization Options:** Use CLI flags to specify the model (e.g., `gpt-3.5-turbo`, `gpt-4o-mini`) and to provide a custom prompt.
- **Modular Design:** Organized into separate modules for scanning, analyzing, and CLI orchestration for easy maintenance and future enhancements.

## Prerequisites

- **Node.js** (v14 or later)
- **NPM** (comes with Node.js)
- An **OpenAI API Key**

Create a `.env` file in the project root with the following content:
```dotenv
OPENAI_API_KEY=your_openai_api_key_here
```
## Installation
### 1. Clone the Repository:
```
git clone https://github/ivansing/scan-project-tool.git
cd scan_project
```

### 2. Install Dependencies:

```
npm install
```

### 3. Global Installation (Optional):

To run the tool globally, you can create a symlink to the CLI module. For example:

```
sudo ln -sf $(pwd)/src/cli.mjs /usr/local/bin/scan_project_tool
```
This allows you to execute the tool from any directory using the command:

```
scan_project_tool [options]
```

## Usage
### Scanning the Entire Project

To scan your project structure (excluding node_modules, .env, and package-lock.json), pretty-print the structure, and analyze it via OpenAI:

```
scan_project_tool --read --model gpt-3.5-turbo
```
### Analyzing a Specific File

To read a specific file and send its content to OpenAI for analysis, use the --file flag:

```
scan_project_tool --file path/to/your/file.ext --model gpt-3.5-turbo --prompt "Analyze this file code."
```
**Note: The file must have one of the allowed extensions** (`.js`, `.py`, `.tsx`, `.json`).

### Customization Options
- `--model`: Specify the OpenAI model to use (e.g., `gpt-3.5-turbo`, `gpt-4o-mini`).
- `--prompt`: Provide a custom prompt for analysis.

Example:

```
scan_project_tool --file src/app/page.tsx --model gpt-3.5-turbo --prompt "Analyze this Next.js page code."
```

## Project Structure

The project is organized in a modular way for maintainability:

```
scan_project/
├── package.json
├── .env
├── src/
│   ├── scanner.mjs       # Module for scanning the project and reading files.
│   ├── analyzer.mjs      # Module for interacting with the OpenAI API.
│   └── cli.mjs           # Main CLI module that orchestrates the tool.
└── README.md             # Documentation and usage instructions.
```

**Optional: If you prefer a dedicated directory for executables, you can create a `bin/` folder and place a small wrapper file that imports `src/cli.mjs`.**

## Future Enhancements

- **Additional Analysis Features:** Extend analysis with more detailed insights or integrate other APIs.
- **Improved Error Handling & Logging:** Enhance diagnostics and add fallback behaviors.
- **Customizable Output Formats:** Support output in JSON, Markdown, or other formats.
- **Graphical User Interface:** Develop a web interface for interactive use.
- **Commercial Licensing:** Explore opportunities to commercialize the tool with premium features and support.

## License

This project is licensed under the MIT License. 

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For major changes, open an issue first to discuss what you would like to change.

## Contact

For questions or support, please contact Ivan Duarte.


```
Feel free to modify and expand upon this README to better fit your project’s specific needs and your future plans for selling or enhancing the tool.
```

