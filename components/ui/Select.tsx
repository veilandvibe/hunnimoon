import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  groupedOptions?: SelectOptionGroup[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, groupedOptions, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-pink-primary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-pink-primary/20 focus:border-pink-primary'
          } focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary bg-white ${className}`}
          {...props}
        >
          {groupedOptions ? (
            groupedOptions.map((group, groupIdx) => (
              <optgroup key={groupIdx} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          ) : (
            options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          )}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
