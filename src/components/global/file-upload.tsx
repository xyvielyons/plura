import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
    apiEndPoint:'agencyLogo' | 'avatar' | 'subaccountLogo'
    value?:string
    onChange:(url?:string) => void
}
const FileUpload = ({apiEndPoint,value,onChange}:Props) => {
    const type = value?.split('.').pop()
    if(value){
        return (<div className="flex flex-col justify-center items-center">
            {type !== 'pdf' ? (
                <div className='relative w-40 h-40'>
                    <Image src={value} alt="uploaded image" className='object-contain' fill></Image>
                </div>
            ):(<div>
                <FileIcon></FileIcon>
                <a href={value} 
                target='_blank' 
                rel="noopener_noreferrer" 
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400'>
                    View PDF
                </a>
            </div>) }
            <Button onClick={()=>onChange('')} variant="ghost" type="button">
                <X className='h-4 w-4 text-white'>Remove Logo</X>
            </Button>
        </div>)
    }
  return (
    <div className='w-full bg-muted/30'>
        <UploadDropzone 
        endpoint="agencyLogo"
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url)
        }}
        onUploadError={(error:Error)=>{
            console.log(error)
        }}
        ></UploadDropzone>
    </div>
  )
}

export default FileUpload