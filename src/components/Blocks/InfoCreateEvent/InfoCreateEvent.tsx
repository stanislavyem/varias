'use client'
import Link from 'next/link'
import './info-create-event.scss'
import { linkPrivacy, linkTerms } from '@/assets/js/consts'
import Input, { IInputFunctions } from '@/components/Input/Input'
import { useRef } from 'react'
import { useAppContext } from '@/hooks/useAppContext'
import ModalMessage from '../ModalMessage/ModalMessage'



const InfoCreateEvent: React.FC = ():JSX.Element => {
	const { modal } = useAppContext()
	const _email = useRef<IInputFunctions>(null)



	const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
	
		const fielsList = [_email]
		const errors: string[] = fielsList
			.map(el => el.current?.getError()?.errorText)
			.filter(el => el) as string[]
		if (errors.length > 0) {
			///modal with errors
			modal?.current?.openModal({
                name: 'error',
                onClose: (() => modal.current?.closeCurrent()),
				children: <ModalMessage 
					texts={errors}
					button='OK'
					header='Errors found:'
					status='error'
					onClick={() => modal.current?.closeCurrent()}
				/>
            })
			return
		}
		
		//async send data
		try {
			const email = _email.current?.getValue()
			const response: Response = await fetch(process.env.NEXT_PUBLIC_URL_BACKEND || '', {
                //signal: controller.signal,
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
				body: JSON.stringify({ email })
            })
			
			if (!response.ok) {
				const result: {message: string} = await response.json()
				modal?.current?.openModal({
					name: 'error',
					onClose: (() => modal.current?.closeCurrent()),
					children: <ModalMessage 
						texts={[result.message]}
						button='OK'
						header='Errors occured:'
						status='error'
						onClick={() => modal.current?.closeCurrent()}
					/>
				})
			}
			
			modal?.current?.openModal({
				name: 'success',
				onClose: (() => {
					modal.current?.closeCurrent()
					_email.current?.setValue('')
				}),
				children: <ModalMessage 
					texts={['Your email has been sent']}
					button='Close'
					header='Success'
					status='success'
					onClick={() => modal.current?.closeCurrent()}
				/>
			})

		} catch (error) {
			const message = error instanceof Error ?  error.message : String(error)
			modal?.current?.openModal({
                name: 'error',
                onClose: (() => modal.current?.closeCurrent()),
				children: <ModalMessage 
					texts={[message]}
					button='OK'
					header='Errors occured:'
					status='error'
					onClick={() => modal.current?.closeCurrent()}
				/>
            })
		}
	}



	return (
		<div className='block_info-create-events'>
			<h2>Create events in minutes</h2>
			<form onSubmit={onEmailSubmit}>
				<Input 
					ref={_email}
					name='email'
					valueType='email'
					id='email'
					placeholder='Your email'
				/>
				<button className='button_square' type='submit'>Start</button>
			</form>
			<p>By signing up, you agree to the <Link href={linkTerms}>Terms</Link> and <Link href={linkPrivacy}>Privacy Policy</Link>.</p>
		</div>
	)
}


export default InfoCreateEvent