// main.js
document.addEventListener('DOMContentLoaded', () => {
  // default code templates
  const DEFAULTS = {
    markdown: '# Hello, Markdown!\n\n* Item 1\n* Item 2',
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Preview</title></head>
<body><h1>Hello, HTML!</h1></body>
</html>`,
    javascript: `// Hello, JS!\nconsole.log('Hello from CodeStudio');`
  };

  // Mode mapping
  const MODES = {
    markdown: 'markdown',
    html:     'htmlmixed',
    javascript: 'javascript'
  };

  let current = 'markdown';

  // UI refs
  const selLang = document.getElementById('language');
  const btnSave = document.getElementById('save');
  const btnReset= document.getElementById('reset');
  const btnTheme= document.getElementById('theme');
  const preview = document.getElementById('preview');
  const textarea= document.getElementById('editor');

  // restore theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  btnTheme.textContent = savedTheme==='dark' ? '☀️ Light' : '🌙 Dark';

  // init CodeMirror
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: MODES[current],
    lineNumbers: true,
    theme: savedTheme==='dark' ? 'dracula' : 'default'
  });

  // render preview
  function updatePreview() {
    const code = editor.getValue();
    if (current==='markdown') {
      preview.innerHTML = marked.parse(code);
    } else if (current==='html') {
      preview.innerHTML = code;
    } else {
      let out = '';
      const orig = console.log;
      console.log = (...args) => (out += args.join(' ') + '\n');
      try { new Function(code)(); }
      catch(e){ out += 'Error: '+ e.message;}
      console.log = orig;
      preview.innerHTML = `<pre>${out}</pre>`;
    }
  }

  // load language
  function loadLang(lang) {
    current = lang;
    editor.setOption('mode', MODES[lang]);
    editor.setValue(DEFAULTS[lang]);
    updatePreview();
  }

  // initial
  loadLang(current);

  // events
  editor.on('change', updatePreview);
  selLang.addEventListener('change', e => loadLang(e.target.value));
  btnSave.addEventListener('click', () => {
    const ext = current==='html'? 'html' : current==='javascript'? 'js' : 'md';
    const blob = new Blob([editor.getValue()], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  btnReset.addEventListener('click', () => {
    if (confirm('Reset editor to default?')) {
      editor.setValue(DEFAULTS[current]);
      updatePreview();
    }
  });
  btnTheme.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    document.body.classList.toggle('light', !isDark);
    editor.setOption('theme', isDark?'dracula':'default');
    const t = isDark?'dark':'light';
    btnTheme.textContent = isDark?'☀️ Light':'🌙 Dark';
    localStorage.setItem('theme', t);
  });
});
