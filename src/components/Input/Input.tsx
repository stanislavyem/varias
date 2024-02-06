import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import './input.scss'
import { svgs } from '../../assets/icons/svgs'
import { inputChecker } from "@/assets/js/tools";
import { TInputValueTypes } from "@/interfaces";

interface IInput {
	labelText?: string
	name: string
	valueType: TInputValueTypes
	id: string
	inputType?: 'text' | 'date' | 'email' | 'password'
	required?: boolean
	datalist?: string[]
	placeholder?: string
	description?: string
	describedBy?: string
}

export interface IInputFunctions {
    getValue: () => string | undefined
    setValue: (value: string) => void
    getError: () => {
		errorText: string
		name: string
	} | null
}


//input block, with integrated check for errors, supports different types of input, has methods for getting error
const Input = forwardRef<IInputFunctions, IInput>(({labelText, datalist, name, id, inputType="text", required, valueType="skip", placeholder, description, describedBy}, ref): JSX.Element => {
    useImperativeHandle(ref, () => ({
        getValue() {
            return _input.current?.value 
        },
		setValue(value) {
			_input.current && (_input.current.value = value);
        },
		getError() {
			if (!_input.current) return {name: 'System Error', errorText: 'Error while checking errors. Please, contact us'}
			let errorText : string | null = checkOnErrors(_input?.current?.value)
			// if (errorText === null) return null
			return errorText === null ? null : {errorText, name}
		},
    }));

	const [error, setError] = useState<string | null>(null) //error text for input, in case of error
	const _input = useRef<HTMLInputElement | null>(null)

	//clear error text if retyping
    const onChangeText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (): void => {
		setError(null)
    }

	//check input for errors
	const checkOnErrors = (value: string): string | null => {
		const errText = inputChecker({value, valueType})
		setError(errText)
		return errText
	}

	//check for errors when focus moved out
    const onBlurInput: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e): void => {
		checkOnErrors(e.target.value)
    }

	//prevent sending form on press enter in input
	const onKeyPressed = (e: React.KeyboardEvent): void => {
		if (e.code === 'Enter') {
			e.preventDefault()
		}
	}

	return (
		<div className={`block_input ${error ? "incorrect-value" : ""}`} data-selector="input-block">
			{labelText && <label htmlFor={id}>{labelText}{required && <span aria-label="This is required field"> *</span>}</label>}
			<div className="input-wrapper">
				<input 
					ref={_input}
					data-selector="input"
					{...(description ? { 'aria-label': description } : {})}
					{...(describedBy ? { 'aria-describedby': describedBy } : {})}
					{...(error ? { 'aria-describedby': `${id}_error` } : {})}
					className="input-element" 
					id={id} 
					type={inputType} 
					onChange={onChangeText}
					onBlur={onBlurInput} 
					{...(datalist ? {'list': `${id}-datalist`} : {})}
					onKeyPress={onKeyPressed}
					{...(placeholder ? { 'placeholder': placeholder } : {})}
					/>
				{datalist && datalist.length > 0 && 
					<datalist id={`${id}-datalist`}>
						{datalist.map(item => (<option key={item} value={item} />))}
					</datalist>}
				{svgs(error ? 'show' : '').iconExclamation}
			</div>
			{error && <span id={`${id}_error`} aria-description='Error in this input' data-content="errorText">{`${error}`}</span>}	
		</div>
	)
})

Input.displayName = 'Input';

export default Input