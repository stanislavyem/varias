"use client"
import { IModalFunctions } from "@/components/Modal/Modal";
import { IAppState, TLang, TTheme } from "@/interfaces";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext<IAppState | undefined>(undefined)


export const Context = ({children}: {children: JSX.Element[] | JSX.Element}): JSX.Element => {

	const [modal, setModal] = useState<React.RefObject<IModalFunctions>>()
	const [theme, setTheme] = useState<TTheme>(global.window?.localStorage.getItem('theme') as TTheme || 'light')  
	const [lang, setLang] = useState<TLang>('en') 
	const [loaded, setLoaded] = useState<boolean>(false)


	const loadParams = async () => {
		const lng: TLang = await localStorage.getItem('lang') as TLang || 'en'
		setLoaded(true)
		setLang(lng)
	}

	useEffect(() => {
		loadParams()
	}, [])
	

	useEffect(() => {
		document.body.classList.toggle('dark', theme === 'dark')
		localStorage.setItem('theme', theme)
	}, [theme])

	
	useEffect(() => {
		if (!loaded) return 
		localStorage.setItem('lang', lang)
		document.querySelector('html')?.setAttribute('lang', lang)
	}, [lang])
	

	const appState: IAppState = { 
		theme, setTheme,
		lang, setLang, 
		modal, setModal,
	}


	return (
		<AppContext.Provider value={appState}>
			{children}
		</AppContext.Provider>
	)

}

