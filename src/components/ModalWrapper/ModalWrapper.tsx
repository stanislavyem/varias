'use client'
import { useEffect, useRef } from "react"
import Modal, { IModalFunctions } from "../Modal/Modal"
import { useAppContext } from "@/hooks/useAppContext"



const ModalWrapper = () => {

	const _modal = useRef<IModalFunctions>(null)
	const { setModal } = useAppContext()

	useEffect(() => {
		if (!_modal.current) return
		setModal(_modal)
	}, [_modal.current])

	return (
		<Modal ref={_modal}/>
	)
}


export default ModalWrapper