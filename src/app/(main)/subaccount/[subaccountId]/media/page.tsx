import BlurPage from '@/components/global/blur-page'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import React from 'react'

interface Props{
    params:{subaccountId:string}
}
const MediaPage = async({params}:Props) => {
    const myParams = await params
    const data = await getMedia(myParams.subaccountId)
  return (
    <BlurPage>
        <MediaComponent data={data} subaccountId={myParams.subaccountId}/>
    </BlurPage>
  )

}
export default MediaPage