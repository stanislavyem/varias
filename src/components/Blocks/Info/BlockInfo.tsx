import React from 'react'
import './block-info.scss'
import Image from 'next/image'


interface IBlockInfo {
	header?: string
	text: string[]
	img: {
		src: string
		alt: string
		pos: 'rt' | 'rb' |'lt' | 'lb'
	}
}

const BlockInfo: React.FC<IBlockInfo> = ({header, text, img}): JSX.Element => {
	return (
		<div className={`block_info img_${img.pos[0] === 'r' ? 'right' : 'left'} img_${img.pos[1] === 't' ? 'top' : 'bottom'}`}>
			<div className="block_info__text">
				{header && <h2>{header}</h2>}
				{text.map((t, i) => <p key={i}>{t}</p>)}
			</div>
			<div className="block_info__image">
				<div className="img-wrapper">
					<Image 
						src={img.src}
						alt={img.alt}
					/>
				</div>
			</div>
		</div>
	)
}

export default BlockInfo