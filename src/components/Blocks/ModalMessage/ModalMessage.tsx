import './modal-message.scss'


interface IModalMessage {
	header: string
	texts: string[]
	status: 'success' | 'error' | 'info'
	button: string
	onClick: () => void
}

const ModalMessage: React.FC<IModalMessage> = ({header, texts, button, status, onClick}): JSX.Element => {
	return (
		<div className={`modal-message modal-message_${status}`}>
			<h2>{header}</h2>
			{texts.map((text,i) => <p key={i}>{text}</p>)}
			<button className='button_square' onClick={onClick}>{button}</button>
		</div>
	)
}


export default ModalMessage