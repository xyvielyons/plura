import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AgencyRootLayout = async({children,params}:{children:React.ReactNode,params:{agencyId:string}}) => {
    const slug = await params
    const agencyId = await verifyAndAcceptInvitation()
    const user = await currentUser()
    if(!user){
        return redirect('/')
    }
    if(!agencyId){
        return redirect('/agency')
    }
    if(user.privateMetadata.role !== 'AGENCY_OWNER' && user.privateMetadata.role !== 'AGENCY_ADMIN'){
        return <Unauthorized/>
    }
    let allNoifications:any = []
    const notifications = await getNotificationAndUser(agencyId)
    if(notifications) allNoifications = notifications

    return <div className="h-screen overflow-hidden">
        <Sidebar id={slug.agencyId} type="agency"></Sidebar>
        <div className="md:pl-[300px]">
            <InfoBar notifications={allNoifications}></InfoBar>
            <div className="relative">
                <BlurPage>{children}</BlurPage>
            </div>
        </div>
    </div>

}

export default AgencyRootLayout