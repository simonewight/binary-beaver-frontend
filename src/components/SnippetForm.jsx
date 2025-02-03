import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  code_content: z.string().min(1, 'Code content is required'),
  description: z.string().optional(),
  is_public: z.boolean().optional(),
})

const SnippetForm = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(snippetSchema),
    defaultValues: initialData || {
      title: '',
      language: 'javascript',
      code_content: '',
      description: '',
      is_public: true,
    }
  })

  const [code, setCode] = useState(initialData?.code_content || '')
  const [language, setLanguage] = useState(initialData?.language || 'javascript')
  const [lineCount, setLineCount] = useState(1)

  const updateLineCount = (newCode) => {
    const lines = newCode.split('\n').length
    setLineCount(lines)
  }

  useEffect(() => {
    updateLineCount(code)
  }, [code])

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, code_content: code })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title and Language inputs stay the same */}
      
      {/* Code Editor with Line Numbers */}
      <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Code
        </label>
        <div className="relative bg-slate-800 rounded-lg overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-end px-2 py-4 select-none text-slate-500 font-mono text-sm">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
          <Editor
            value={code}
            onValueChange={newCode => {
              setCode(newCode)
              updateLineCount(newCode)
            }}
            highlight={code => Prism.highlight(code, Prism.languages[language] || Prism.languages.markup)}
            padding={16}
            style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              paddingLeft: '3.5rem',
              minHeight: '200px',
              backgroundColor: 'transparent',
              color: '#fff',
            }}
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>

      {/* Rest of the form stays the same */}
    </form>
  )
}

export default SnippetForm 