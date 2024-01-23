import { TInputTypes, TLang } from "@/interfaces"
import { screenNames, screenSizes } from "./consts"

export const makeImageSizes = (params: Partial<Record<typeof screenNames[number], string>>): string => {
	return screenNames
		.filter(size => params[size])
		.reverse()
		.map(size => `(min-width: ${screenSizes[size]}px) ${params[size]}`)
		.join(', ')
}


// get paren element and return array of all selectable elements inside
const getSelectableElements = (_parent: HTMLElement | null): HTMLElement[] => {
    if (!_parent) return []
    const selectableElements = 'a[href]:not([tabindex="-1"]), button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    return Array
        .from(_parent.querySelectorAll(selectableElements) || [])
        .filter(
            el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
        ) as HTMLElement[]
}



interface ILockFocusInside {
    _parentElement: HTMLElement //parent element for locking focus inside it
    initialFocused?: number //the order of selected element by default
    returnFocus?: boolean //return focus to the element selected before lockFocus
}

interface ILockFocusInsideOutput {
    focusNext: () => void; //select next focusable element
    focusPrev: () => void; //select prev focusable element
    destroy: () => void; //remove listeners and return focus (if returnFocus is true)
    focusOn: (index: number) => void; //set focus on the element with 'index' order
    rebuild: () => void; //reselect all the selectable elements (i.e., in case the content changed)
}


//lock focus inside parent element
export const lockFocusInside = ({ _parentElement, initialFocused = 0, returnFocus = true }: ILockFocusInside): ILockFocusInsideOutput => {
    let selected = initialFocused
    let focusableEls = getSelectableElements(_parentElement)
    const _prevFocusedElement = document.activeElement as HTMLElement


    const keyPressed = (e: KeyboardEvent) => {
        if (e.code !== 'Tab') return

        e.preventDefault();
        if (!e.shiftKey) {
            selected++;
            (selected > focusableEls.length - 1) && (selected = 0);
        } else {
            selected--;
            (selected < 0) && (selected = focusableEls.length - 1);
        }
        focusableEls[selected].focus()
        e.stopPropagation()
    };

    _parentElement.addEventListener("keydown", keyPressed);


    return {
        focusNext: () => {
            selected++;
            (selected > focusableEls.length - 1) && (selected = 0);
            focusableEls[selected].focus()
        },
        focusPrev: () => {
            selected--;
            (selected < 0) && (selected = focusableEls.length - 1);
            focusableEls[selected].focus()
        },
        destroy: () => {
            _parentElement.removeEventListener("keydown", keyPressed);
            if (returnFocus && _prevFocusedElement) {
                _prevFocusedElement.focus()
            }
        },
        focusOn: (index: number) => {
            focusableEls[index]?.focus()
        },
        rebuild: () => {  //in case all the content inside _parentElement was changed, trying to save selected focused element in focus
            const element = focusableEls[selected]
            focusableEls = getSelectableElements(_parentElement)
            focusableEls.forEach((el, i) => {
                if (el === element) {
                    el.focus();
                    selected = i;
                }
            })

        }
    }
}




interface IInputChecker {
    value: string
    type: TInputTypes //check type
	lang: TLang
}


//get value and value type for checking
export const inputChecker = ({ value, type, lang }: IInputChecker): string | null => {
    if (type === 'name') {
        if (value.length === 0) return lang === 'en' ? 'Please enter the name' : 'FR Please enter the name'
        if (value.length > 60) return lang === 'en' ? 'Name is too long, please check' : 'FR Name is too long, please check'
        if (!/^[a-zA-Z\- ]*$/.test(value)) return lang === 'en' ? 'Please use only latin letters or "-"' : 'FR Please use only latin letters or "-"'
    }
    // if (type === 'country') {
    //     if (value.length < 2) return 'Please enter the country'
    //     if (value.length > 60) return 'Please enter country correctly'
    //     if (!/^[a-zA-z- ]*$/.test(value)) return 'Please use only latin letters or "-"'
    // }
    // if (type === 'date') {
    //     const inputDate = new Date(value)
    //     if (String(inputDate) === 'Invalid Date') return 'Please enter the date of birth in mm/dd/yyyy format'
    //     if (inputDate < new Date("1900-01-01")) return 'Date is too early'
    //     if (inputDate > new Date()) return 'Please check the date'
    // }
    return null
}


