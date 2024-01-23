'use client'
import { useAppContext } from '@/hooks/useAppContext'
import './lang-sw.scss'


const LangSw = (): JSX.Element => {
	const {lang, setLang} = useAppContext()

	const onChangeLang = (e: React.MouseEvent<HTMLButtonElement>): void => {
		setLang(lang === 'en' ? 'fr' : 'en')
	}

	return (
        <button 
            className={`sw_lang button_nostyle ${lang === 'en' ? 'en' : 'fr'}`} 
            onClick={onChangeLang} 
            aria-label={lang === 'en' ? `Switch language to French` : `FRFRFR`}
        >
            <div className="sw_lang__text lang_fr">EN</div>
            <div className="sw_lang__text lang_en">FR</div>
        </button>
	)
}


export default LangSw