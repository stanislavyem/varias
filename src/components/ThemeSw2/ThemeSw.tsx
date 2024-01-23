'use client'
import { useAppContext } from '../../hooks/useAppContext'
import './theme-sw.scss'



//switch the app theme
const ThemeSw = (): JSX.Element => {
	const { theme, setTheme }  = useAppContext()
	
	const onChangeTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setTheme(e.target.checked ? 'dark' : 'light')
	}

	return (
		<div className="theme-switcher-wrapper">
			<div className="theme-switcher">
				<input onChange={onChangeTheme} type="checkbox" id="themeSwitch" name="theme-switch" className="theme-switch__input" checked={theme === 'dark'}/>
				<label htmlFor="themeSwitch" className="theme-switch__label" aria-label='Switch the app theme'>
					<span aria-label='Switch theme'></span>
				</label>
			</div>
		</div>

	)
}


export default ThemeSw