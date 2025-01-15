'use client'
import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { DialogClose,DialogContent, DialogDescription,Dialog, DialogHeader, DialogTitle} from '../ui/dialog'

interface Props {
    title:string
    subheading:string
    children:React.ReactNode
    defaultOpen:boolean
}

const CustomModal = ({title,subheading,defaultOpen,children}:Props) => {
    const {isOpen,setClose} = useModal()
  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
        <DialogContent className='overflow-scroll md:max-h-[700px] md:h-fit h-screen bg-card'>
            <DialogHeader className='pt-8 text-left'>
                <DialogTitle className='text-2xl font-bold'>{title}</DialogTitle>
                <DialogDescription>{subheading}</DialogDescription>
                {children}
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default CustomModal