import Link from 'next/link'
import './info-markets.scss'
import Image from 'next/image'

interface IInfoMarkets {
	header?: string
	text: string[]
	links: {
		src: string
		alt: string
		href: string
	}[]
}

const InfoMarkets: React.FC<IInfoMarkets> = ({header, text, links}):JSX.Element => {
	return (
		<div className='block_info-markets'>
			{header && <h2>{header}</h2>}
			{text.map((t, i) => <p key={i}>{t}</p>)}
			<div className="links">
				{links.map(item => {
					return (
						<Link href={item.href} key={item.href} target='_blank' aria-label={item.alt}>
							<Image 
								src={item.src}
								alt={item.alt}
							/>
						</Link>
					)
				})}
			</div>
		</div>
	)
}


export default InfoMarkets