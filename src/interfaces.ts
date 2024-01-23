import { IModalFunctions } from "./components/Modal/Modal"

export interface IAppState { //all the state of the app
	theme: TTheme
	setTheme: React.Dispatch<React.SetStateAction<TTheme>>
	lang: TLang
	setLang: React.Dispatch<React.SetStateAction<TLang>>
	modal: React.RefObject<IModalFunctions> | undefined//access to modal window
	setModal: (newModal: React.RefObject<IModalFunctions>) => void //set new modal window
}

export type TTheme = 'dark' | 'light'
export type TLang = 'en' | 'fr' //add ch, ...


export interface INavItem {
	title: Record<TLang, string>
	link: string
}


export type TInputTypes = 'name' | 'letters' | 'letters+' | 'email' | 'any' | 'numbers' |'numbers+'
//numbers: 0-9
//numbers+: 0-9,(),+,-
//letters: letters
//letters+: letters,-,(),numbers
//email: email
//any: any