import React, { type InputHTMLAttributes } from 'react'
import InputMask from 'react-input-mask'
import { NumericFormat } from 'react-number-format'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  preppend?: string | React.ReactNode
  append?: string | React.ReactNode
  labelClassName?: string
  mask?: string
  inputClassName?: string
  label?: string
  error?: string
  currency?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      append,
      mask,
      preppend,
      inputClassName,
      labelClassName,
      currency,
      label,
      error,
      disabled,
      onFocus,
      ...props
    },
    ref
  ) => {
    const baseInputClasses =
      'w-full h-full border-none bg-transparent text-sm font-medium outline-none placeholder:text-gray-300 px-4'

    const renderInput = () => {
      if (currency) {
        return (
          <NumericFormat
            allowNegative={false}
            className={`${baseInputClasses} ${inputClassName ?? ''}`}
            decimalScale={2}
            decimalSeparator=","
            disabled={disabled}
            getInputRef={ref}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={undefined}
            placeholder={props.placeholder}
            value={props.value as number}
          />
        )
      }

      if (mask) {
        return (
          <InputMask
            disabled={disabled}
            mask={mask}
            onBlur={props.onBlur}
            onChange={props.onChange}
            placeholder={props.placeholder}
            value={props.value}
          >
            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
              <input
                {...inputProps}
                className={`${baseInputClasses} ${inputClassName ?? ''}`}
                ref={ref}
              />
            )}
          </InputMask>
        )
      }

      return (
        <input
          {...props}
          className={`${baseInputClasses} ${inputClassName ?? ''}`}
          disabled={disabled}
          onFocus={undefined}
          ref={ref}
        />
      )
    }

    const inputId =
      props.id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div
        className={`block ${error ? 'border-red-500' : ''} ${
          props.className ?? ''
        }`}
      >
        {label && (
          <label
            className={`font-medium text-neutral-900 text-sm leading-tight ${labelClassName ?? ''}`}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}

        <div
          className={`flex items-center overflow-hidden rounded-sm border bg-white ${
            error ? 'border-red-500' : ''
          } ${props.className ?? ''}`}
        >
          {preppend && (
            <div className="flex h-full items-center justify-center ">
              {preppend}
            </div>
          )}
          <div
            className={`h-10 flex-grow ${disabled ? 'opacity-50' : ''}`}
            id={inputId}
          >
            {renderInput()}
          </div>
          {append && (
            <div className="flex h-full items-center justify-center ">
              {append}
            </div>
          )}
        </div>
        {error && <small className="text-red-500">{error}</small>}
      </div>
    )
  }
)

Input.displayName = 'Input'
