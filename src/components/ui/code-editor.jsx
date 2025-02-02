import React from 'react'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

const CodeEditor = ({ value, onChange, language, readOnly = false }) => {
  const highlight = code => {
    return Prism.highlight(
      code,
      Prism.languages[language] || Prism.languages.markup,
      language
    )
  }

  return (
    <div className="rounded-lg overflow-hidden bg-slate-900 font-mono">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        readOnly={readOnly}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          minHeight: readOnly ? 'auto' : '200px'
        }}
        className="text-slate-300"
      />
    </div>
  )
}

export default CodeEditor 