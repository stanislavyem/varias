import { TLang } from '../../interfaces'
import './input-hider.scss'



interface IProps {
    hidden: boolean
    lang: TLang
    onClick: () => void
}

const InputHider: React.FC<IProps> = ({hidden, onClick, lang}): JSX.Element => {
    return (
        <button 
            className={`input-hider button_nostyle ${hidden ? 'hide' : ''}`} 
            onClick={onClick} 
            aria-label={hidden ? 
                lang === 'en' ? 'Unhide password text' : 'Показать текст пароля'
                : lang === 'en' ? 'Hide password text' : 'Скрыть текст пароля'}
            >
            <svg className='icon_eye' viewBox='0 0 193.5 116'>
                <circle className='eye pupil' cx='96.8' cy='58' r='24'/>
                <path className='eye eyelid' d='M5,58L5,58C23.4,26.3,57.6,5,96.8,5c39.3,0,73.8,21.3,91.8,53l0,0c0,0-26.7,53-91.8,53S5,58,5,58z'/>
            </svg>
        </button>
    )
}


export default InputHider