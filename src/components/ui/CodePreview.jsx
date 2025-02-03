import React, { useEffect, useState } from 'react'
import Prism from 'prismjs'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './button'
import { toast } from 'react-hot-toast'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './tooltip'

const CodePreview = ({ code, language }) => {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    Prism.highlightAll()
  }, [code, language, expanded])

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

  return (
    <div className="relative group bg-slate-900 rounded-lg">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
        <Tooltip>
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
        </Tooltip>
      </div>

      <div className="relative">
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px]' : 'max-h-[150px]'}`}>
          <pre className={`language-${prismLanguage} p-4`}>
            <code className={`language-${prismLanguage}`}>
              {code}
            </code>
          </pre>
        </div>
        
        {!expanded && code.split('\n').length > 5 && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        )}
      </div>

      {code.split('\n').length > 5 && (
        <div className="flex justify-center py-2 bg-slate-900 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show more
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CodePreview 