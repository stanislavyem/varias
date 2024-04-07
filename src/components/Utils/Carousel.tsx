// carousel.tsx
"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import './carousel.scss'

const Carousel = ({ data }: {
    data: {
        title: string,
        info: string,
        image: string
    }[]
}) => {
    // State and Ref initialization
    const [currentImg, setCurrentImg] = useState(0)
    const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 })
    const carouselRef = useRef(null)

    // useEffect to get the initial carousel size
    useEffect(() => {
        let elem = carouselRef.current as unknown as HTMLDivElement
        let { width, height } = elem.getBoundingClientRect()
        if (carouselRef.current) {
            setCarouselSize({
                width,
                height: height,
            })
        }
    }, [])

    return (
        <div>
            {/* Carousel container */}
            <div className='carousel-container'>
                {/* Image container */}
                <div
                    ref={carouselRef}
                    style={{
                        left: -currentImg * carouselSize.width
                    }}
                    className='carousel-images-container'>
                    {/* Map through data to render images */}
                    {data.map((v, i) => (
                        <div key={i} className='relative shrink-0 w-full h-full'>
                            <div>
                                <Image
                                    className='pointer-events-none'
                                    alt={`carousel-image-${i}`}
                                    fill
                                    src={v.image || "https://random.imagecdn.app/500/500"}
                                />
                            </div>
                            <div className='carousel-text-container'>
                                {v.title && <h2>{v.title}</h2>}
                                {v.info && <p>{v.info}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className='carousel-nav-container'>
                <button
                    disabled={currentImg === 0}
                    onClick={() => setCurrentImg(prev => prev - 1)}
                    className={`border px-4 py-2 font-bold ${currentImg === 0 && 'opacity-50'}`}
                >
                    {"<"}
                </button>
                <button
                    disabled={currentImg === data.length - 1}
                    onClick={() => setCurrentImg(prev => prev + 1)}
                    className={`border px-4 py-2 font-bold ${currentImg === data.length - 1 && 'opacity-50'}`}
                >
                    {">"}
                </button>
            </div>
        </div>
    )
}

export default Carousel