'use client'
import { useContext } from "react";
import { AppContext } from '../providers/Context'
import { IAppState } from "../interfaces";


//using this hook can help avoid 'state is undefined'
export const useAppContext = (): IAppState => {
    const state = useContext(AppContext)

    if (!state) {
        throw new Error('State is undefined in useAppContext')
    }

    return state
}