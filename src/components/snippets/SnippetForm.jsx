import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select } from '../ui/select'

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Textarea
          {...register('code_content', { required: 'Code content is required' })}
          placeholder="Your code here..."
          className="bg-slate-900 font-mono h-64"
        />
        {errors.code_content && (
          <p className="text-red-400 text-sm mt-1">{errors.code_content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <Select
            {...register('language')}
            className="bg-slate-900"
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