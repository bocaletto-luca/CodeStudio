# CodeStudio

A browser-based, multi-language code editor with live preview, syntax highlighting, file load/save/reset, and theme toggling. Built on [CodeMirror 5](https://codemirror.net/), it supports over 20 languages—including Markdown, HTML/CSS, JavaScript, Python, C/C++, C#, SQL, and more—with live rendering where available (Markdown, HTML, JS console, JSON, Python via Skulpt, SQL via AlaSQL).

---

## Table of Contents

- [Features](#features)  
- [Supported Languages](#supported-languages)  
- [Quick Start](#quick-start)  
  - [Clone & Launch](#clone--launch)  
  - [Live Server](#live-server)  
- [Usage](#usage)  
- [Customization](#customization)  
- [Contributing](#contributing)  
- [License](#license)  
- [Author](#author)  

---

## Features

- Syntax highlighting for 20+ languages using CodeMirror 5  
- Live preview panes:  
  - Rendered Markdown (with [marked.js](https://github.com/markedjs/marked))  
  - Live HTML/CSS  
  - JavaScript console output capture  
  - JSON pretty-print  
  - Python execution via [Skulpt](https://github.com/skulpt/skulpt)  
  - SQL query results via [AlaSQL](https://github.com/agershun/alasql)  
- Fallback code view (`<pre>…</pre>`) for other languages (C, C++, C#, VB, Go, Rust, Swift, Kotlin, Bash, XML, YAML, PHP, Ruby, Word `.doc`)  
- LocalStorage auto-save per language tab  
- Load local files (infers language by extension)  
- Save code to disk with correct extension (e.g. `.py`, `.cpp`, `.md`, `.doc`)  
- Reset editor to default template  
- Light & dark themes with persisted preference  
- Fully responsive layout for desktop and mobile  

---

## Supported Languages

| Category              | Languages                                                           |
|-----------------------|---------------------------------------------------------------------|
| Markup & Data         | Markdown, HTML/CSS, XML, JSON, YAML                                 |
| Scripting & Web       | JavaScript, PHP, Ruby                                               |
| General-Purpose       | Python, Java, C, C++, C#, Visual Basic, Go, Rust, Swift, Kotlin     |
| Database & Shell      | SQL, Bash                                                           |
| Plain & Word          | Plain Text (`.txt`), MS Word Document (`.doc`)                      |

---

## Quick Start

### Clone & Launch

```bash
git clone https://github.com/bocaletto-luca/CodeStudio.git
cd CodeStudio
```

CodeStudio is a static web app—no build tools required.

### Live Server

Modern browsers block module/`fetch()` from `file://`. Serve files over HTTP:

- **Python 3**  
  ```bash
  python3 -m http.server 8000
  ```
- **Node.js**  
  ```bash
  npm install -g http-server
  http-server -p 8000
  ```

Open <http://localhost:8000> in your browser.

---

## Usage

1. **Select Language**  
   Choose from the dropdown to load the default code template and syntax mode.  
2. **Write Code**  
   Edit in the left pane; syntax highlighting updates instantly.  
3. **Live Preview**  
   Right pane updates on every keystroke for supported languages.  
4. **Load File**  
   Click 📂 to import a local file. Language auto-detects by extension.  
5. **Save File**  
   Click 💾 to download code with the proper extension (`.py`, `.cpp`, `.md`, etc.).  
6. **Reset**  
   Click ♻️ to restore the default starter code for the current language.  
7. **Theme Toggle**  
   Click 🌙/☀️ to switch light/dark themes (persisted in LocalStorage).  

---

## Customization

- **Add More Languages**  
  1. Include the CodeMirror mode `<script>` in `index.html`.  
  2. Add an `<option>` in the language `<select>`.  
  3. Define its mode in `main.js` → `MODES`, default template in `DEFAULTS`, and extension in `EXT`.  
  4. Implement preview logic in `updatePreview()` if needed.

- **Styling**  
  Tweak `style.css` for custom colors, fonts, or layout adjustments.

---

## Contributing

Contributions, issues, and feature requests are welcome!  
1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/my-feature`)  
3. Commit your changes (`git commit -m "Add my feature"`)  
4. Push to branch (`git push origin feature/my-feature`)  
5. Open a Pull Request  

Please follow the coding style already in use and test changes thoroughly.

---

## License

This project is licensed under the [GPL License](LICENSE).

---

## Author

**Bocaletto Luca**  
- GitHub: [@bocaletto-luca](https://github.com/bocaletto-luca)  
- Repository: [CodeStudio](https://github.com/bocaletto-luca/CodeStudio)
