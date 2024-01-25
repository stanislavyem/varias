import './info-text.scss'

interface IInfoText {
	header?: string
	text: string[]
}

const InfoText: React.FC<IInfoText> = ({header, text}):JSX.Element => {
	return (
		<div className='block_info-text'>
			{header && <h2>{header}</h2>}
			{text.map((t, i) => <p key={i}>{t}</p>)}
		</div>
	)
}


export default InfoText