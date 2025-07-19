// main.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Default code templates
  const DEFAULTS = {
    markdown: '# Hello, Markdown!\n\n* Item 1\n* Item 2',
    html: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Preview</title></head>
<body><h1>Hello, HTML!</h1></body></html>`,
    xml: `<note>\n  <to>User</to>\n  <from>CodeStudio</from>\n  <body>Hello, XML!</body>\n</note>`,
    json: `{\n  "name": "Alice",\n  "age": 30\n}`,
    yaml: `name: Bob\nage: 25\nskills:\n  - JS\n  - Python`,
    javascript: `// JS example\nconsole.log('Hello from JS');`,
    php: `<?php echo "Hello from PHP!"; ?>`,
    ruby: `# Ruby example\nputs 'Hello from Ruby'`,
    python: `# Python example\nprint("Hello from Python")`,
    java: `// Java example\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java");\n  }\n}`,
    c: `// C example\n#include <stdio.h>\nint main() {\n  printf("Hello from C\\n");\n  return 0;\n}`,
    cpp: `// C++ example\n#include <iostream>\nint main() {\n  std::cout << "Hello from C++\\n";\n  return 0;\n}`,
    csharp: `// C# example\nusing System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello from C#");\n  }\n}`,
    vb: `\' VB example\nModule Module1\n  Sub Main()\n    Console.WriteLine("Hello from VB")\n  End Sub\nEnd Module`,
    go: `// Go example\npackage main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello from Go")\n}`,
    rust: `// Rust example\nfn main() {\n  println!("Hello from Rust");\n}`,
    swift: `// Swift example\nprint("Hello from Swift")`,
    kotlin: `// Kotlin example\nfun main() {\n  println("Hello from Kotlin")\n}`,
    sql: `-- SQL example\nCREATE TABLE people(id INT, name TEXT);\nINSERT INTO people VALUES(1,'Alice'),(2,'Bob');\nSELECT * FROM people;`,
    bash: `# Bash example\necho "Hello from Bash"`,
    text: 'Simple plain-text file.\nNo special preview.',
    doc: 'Preview not available for .doc files.'
  };

  // 2. CodeMirror modes
  const MODES = {
    markdown:  'markdown',
    html:      'htmlmixed',
    xml:       'xml',
    json:      'application/json',
    yaml:      'yaml',
    javascript:'javascript',
    php:       'application/x-httpd-php',
    ruby:      'ruby',
    python:    'python',
    java:      'text/x-java',
    c:         'text/x-csrc',
    cpp:       'text/x-c++src',
    csharp:    'text/x-csharp',
    vb:        'text/x-vb',
    go:        'go',
    rust:      'rust',
    swift:     'swift',
    kotlin:    'text/x-kotlin',
    sql:       'sql',
    bash:      'shell',
    text:      null,
    doc:       null
  };

  // 3. File extensions
  const EXT = {
    markdown:'md', html:'html', xml:'xml', json:'json', yaml:'yaml',
    javascript:'js', php:'php', ruby:'rb', python:'py', java:'java',
    c:'c', cpp:'cpp', csharp:'cs', vb:'vb', go:'go', rust:'rs',
    swift:'swift', kotlin:'kt', sql:'sql', bash:'sh', text:'txt', doc:'doc'
  };

  // 4. UI refs
  const selLang = document.getElementById('language');
  const btnLoad = document.getElementById('load');
  const fileIn  = document.getElementById('file-input');
  const btnSave = document.getElementById('save');
  const btnReset= document.getElementById('reset');
  const btnTheme= document.getElementById('theme');
  const preview = document.getElementById('preview');
  const ta      = document.getElementById('editor');

  // 5. Restore theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  btnTheme.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';

  // 6. Init CodeMirror
  const editor = CodeMirror.fromTextArea(ta, {
    mode: MODES[selLang.value],
    lineNumbers: true,
    theme: savedTheme === 'dark' ? 'dracula' : 'default'
  });

  // 7. Escape HTML
  function esc(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  }

  // 8. Update preview
  async function updatePreview() {
    const lang = selLang.value;
    const code = editor.getValue();
    localStorage.setItem(`code-${lang}`, code);

    const noPrev = '<pre>Preview non disponibile</pre>';
    switch (lang) {
      case 'markdown':
        preview.innerHTML = marked.parse(code);
        break;
      case 'html':
        preview.innerHTML = code;
        break;
      case 'xml':
      case 'yaml':
      case 'bash':
      case 'php':
      case 'ruby':
      case 'java':
      case 'c':
      case 'cpp':
      case 'csharp':
      case 'vb':
      case 'go':
      case 'rust':
      case 'swift':
      case 'kotlin':
      case 'text':
        preview.innerHTML = `<pre>${esc(code)}</pre>`;
        break;
      case 'json':
        try {
          const obj = JSON.parse(code);
          preview.innerHTML = `<pre>${esc(JSON.stringify(obj,null,2))}</pre>`;
        } catch (e) {
          preview.innerHTML = `<pre style="color:red">Error: ${esc(e.message)}</pre>`;
        }
        break;
      case 'javascript': {
        let out = '';
        const orig = console.log;
        console.log = (...args) => (out += args.join(' ') + '\n');
        try { new Function(code)(); }
        catch (e) { out += 'Error: '+e.message; }
        console.log = orig;
        preview.innerHTML = `<pre>${esc(out)}</pre>`;
        break;
      }
      case 'python': {
        if (!window.Sk) {
          preview.innerHTML = noPrev;
          break;
        }
        let out = '';
        function outf(txt) { out += txt; }
        Sk.configure({ output: outf, read: f => Sk.builtinFiles['files'][f] });
        await Sk.misceval.asyncToPromise(() =>
          Sk.importMainWithBody('<stdin>', false, code, true)
        )
        .then(() => preview.innerHTML = `<pre>${esc(out)}</pre>`)
        .catch(err => preview.innerHTML = `<pre style="color:red">Error: ${esc(err.toString())}</pre>`);
        break;
      }
      case 'sql': {
        if (!window.alasql) {
          preview.innerHTML = noPrev;
          break;
        }
        try {
          const res = alasql(code);
          if (!Array.isArray(res) || res.length === 0) {
            preview.innerHTML = '<pre>No result</pre>';
            break;
          }
          const table = Array.isArray(res[0]) ? res[0] : res;
          const cols  = Array.isArray(table[0])
                        ? table[0].map((_,i)=>`col${i+1}`)
                        : Object.keys(table[0]);
          const head  = `<tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>`;
          const rows  = table.map(r=>{
            const vals = Array.isArray(r) ? r : cols.map(c=>r[c]);
            return `<tr>${vals.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`;
          }).join('');
          preview.innerHTML = `<table>${head}${rows}</table>`;
        } catch (e) {
          preview.innerHTML = `<pre style="color:red">Error: ${esc(e.message)}</pre>`;
        }
        break;
      }
      case 'doc':
      default:
        preview.innerHTML = noPrev;
    }
  }

  // 9. Load language + code
  function loadLanguage(lang, override) {
    selLang.value = lang;
    editor.setOption('mode', MODES[lang]);
    const code = override !== undefined
               ? override
               : localStorage.getItem(`code-${lang}`) || DEFAULTS[lang];
    editor.setValue(code);
    editor.refresh();            // <— force redraw
    updatePreview();
  }

  // 10. Initial
  loadLanguage(selLang.value);

  // 11. Event bindings
  editor.on('change', updatePreview);

  selLang.addEventListener('change', () => loadLanguage(selLang.value));

  btnLoad.addEventListener('click', () => fileIn.click());
  fileIn.addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    const map = {
      md:'markdown', markdown:'markdown',
      html:'html', htm:'html',
      xml:'xml', json:'json',
      yaml:'yaml', yml:'yaml',
      js:'javascript', php:'php',
      rb:'ruby', py:'python',
      java:'java', c:'c', cpp:'cpp',
      cs:'csharp', vb:'vb',
      go:'go', rs:'rust',
      swift:'swift', kt:'kotlin',
      sql:'sql', sh:'bash',
      txt:'text', doc:'doc'
    };
    const lang = map[ext] || 'text';
    const reader = new FileReader();
    reader.onload = () => loadLanguage(lang, reader.result);
    reader.readAsText(f);
    fileIn.value = '';
  });

  btnSave.addEventListener('click', () => {
    const lang = selLang.value;
    const ext  = EXT[lang] || 'txt';
    const mime = ext === 'doc' ? 'application/msword' : 'text/plain';
    const blob = new Blob([editor.getValue()], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  btnReset.addEventListener('click', () => {
    if (!confirm('Ripristinare il codice di default?')) return;
    localStorage.removeItem(`code-${selLang.value}`);
    editor.setValue(DEFAULTS[selLang.value]);
    editor.refresh();
    updatePreview();
  });

  btnTheme.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    document.body.classList.toggle('light', !isDark);
    editor.setOption('theme', isDark ? 'dracula' : 'default');
    const theme = isDark ? 'dark' : 'light';
    btnTheme.textContent = isDark ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('theme', theme);
  });
});
