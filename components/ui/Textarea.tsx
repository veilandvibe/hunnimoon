import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-pink-primary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 min-h-[48px] rounded-xl border-2 transition-all duration-200 text-base touch-manipulation bg-white ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-pink-primary/50 focus:border-pink-primary'
          } focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary placeholder:text-pink-primary/40 resize-none ${className}`}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
