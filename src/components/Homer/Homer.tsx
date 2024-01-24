'use client'
import { useEffect, useMemo, useRef } from 'react'
import './homer.scss'
import { debounce } from '../../assets/js/tools';
import { svgs } from '@/assets/icons/svgs';
import { scrollThreshold } from '@/assets/js/consts';

const Homer = () => {
	const _homer = useRef<HTMLButtonElement>(null)

	const onHomerClicked = (): void => {
       document.body.scrollTop = 0; // For Safari
       document.documentElement.scrollTop = 0;
    }



	const checkScroll = () => {
		//test
		const screenHeight = screen?.height || 100;
		const threshold =  screenHeight * scrollThreshold
		const scrolled = document.body.scrollTop > threshold || document.documentElement.scrollTop > threshold
		_homer.current?.classList.toggle('scrolled', scrolled)
	}
 
    const checkScrollDebounced: (...args: any[]) => void = debounce(checkScroll, 150)


    useEffect(() => {       
        document.addEventListener('scroll', checkScrollDebounced)
        return () => document.removeEventListener('scroll', checkScrollDebounced)
    }, []) 


	return (
        <button 
            className={`homer button_nostyle`} 
            data-testid="homer" 
			ref={_homer}
            onClick={onHomerClicked} 
            title={'Go to the top of the page'} 
            aria-label={'Go to the top of the page'} 
            tabIndex={-1}
        >
            {svgs().iconHomer}
        </button>
	)
}


export default Homer