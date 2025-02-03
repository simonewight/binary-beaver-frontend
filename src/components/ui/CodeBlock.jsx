import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'  // Dark theme
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'  // For HTML
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from './button'
import { toast } from 'react-hot-toast'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from './tooltip'

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [code, language])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  const handleViewRaw = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Map our language names to Prism's
  const languageMap = {
    python: 'python',
    javascript: 'javascript',
    typescript: 'typescript',
    jsx: 'jsx',
    tsx: 'tsx',
    html: 'markup',
    css: 'css',
    json: 'json',
    java: 'java',
    sql: 'sql',
    bash: 'bash',
    shell: 'bash',
  }

  const prismLanguage = languageMap[language.toLowerCase()] || 'markup'

  // Generate line numbers
  const lines = code.split('\n').length
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)

  return (
    <TooltipProvider>
      <div className="relative group bg-slate-900 rounded-lg">
        {/* Language badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-slate-800 text-cyan-400 z-20">
          {language}
        </div>

        {/* Action buttons with tooltips */}
        <div className="absolute top-2 right-16 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={handleViewRaw}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Raw Code</p>
            </TooltipContent>
          </TooltipRoot>

          <TooltipRoot>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy Code'}</p>
            </TooltipContent>
          </TooltipRoot>
        </div>

        <div className={`code-container ${expanded ? 'expanded' : ''}`}>
          <div className="flex relative">
            {/* Line numbers - Updated padding and line height */}
            <div className="hidden md:block pl-4 pr-4 py-4 text-right bg-slate-800/50 rounded-l-lg select-none">
              {lineNumbers.map(num => (
                <div key={num} className="text-slate-500 text-sm leading-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Code content - Updated padding and line height */}
            <div className="overflow-x-auto w-full p-4">
              <pre className="language-${prismLanguage} overflow-x-auto">
                <code className={`language-${prismLanguage} leading-6`}>
                  {code}
                </code>
              </pre>
            </div>
          </div>

          {code.split('\n').length > 15 && !expanded && (
            <Button
              variant="ghost"
              size="sm"
              className="expand-button"
              onClick={() => setExpanded(true)}
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default CodeBlock 