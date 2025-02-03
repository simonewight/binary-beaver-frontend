import React, { useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'  // Dark theme
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'  // For HTML

const CodeBlock = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll()
  }, [code, language])

  // Map our language names to Prism's
  const languageMap = {
    python: 'python',
    javascript: 'javascript',
    html: 'markup',
    css: 'css',
  }

  const prismLanguage = languageMap[language.toLowerCase()] || 'markup'

  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
      <pre className="overflow-x-auto">
        <code className={`language-${prismLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock 