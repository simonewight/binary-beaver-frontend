import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'jsx', label: 'React (JSX)' },
]

const SnippetForm = ({ initialData, onSubmit, submitLabel = 'Save' }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      code_content: '',
      language: 'python',
      is_public: true,
    }
  })

  const [code, setCode] = useState(initialData?.code_content || '')
  const [lineCount, setLineCount] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState(initialData?.language || 'python')

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
      <div>
        <Input
          {...register('title', { required: 'Title is required' })}
          placeholder="Snippet title"
          className="bg-slate-900"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="bg-slate-900 h-24"
        />
      </div>

      <div>
        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[auto,1fr]">
            {/* Line numbers */}
            <div className="bg-slate-800/50 border-r border-slate-700/50 py-4 px-2 select-none text-slate-500 font-mono text-sm text-right">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            
            {/* Editor */}
            <div>
              <Editor
                value={code}
                onValueChange={newCode => {
                  setCode(newCode)
                  updateLineCount(newCode)
                }}
                highlight={code => Prism.highlight(code, Prism.languages[selectedLanguage] || Prism.languages.markup)}
                padding={16}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  minHeight: '256px',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  lineHeight: '1.5rem',
                }}
                className="min-h-[256px] w-full"
                textareaClassName="focus:outline-none"
                placeholder="Your code here..."
              />
            </div>
          </div>
        </div>
        {errors.code_content && (
          <p className="text-red-400 text-sm mt-1">{errors.code_content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <Select
            {...register('language')}
            className="bg-slate-900"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_public')}
            className="mr-2"
          />
          <label className="text-slate-300">Public snippet</label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-white font-medium"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  )
}

export default SnippetForm 