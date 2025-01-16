import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { permission } from 'process'
import React from 'react'

interface Props {
    children:React.ReactNode
    params:{subaccountId:string}
}
const SubAccountRootLayout = async({children,params}:Props) => {
    const slug = await params
    const agencyId = await verifyAndAcceptInvitation()
    if(!agencyId) return <Unauthorized/>
    let notifications;
    const user = await currentUser()
    if(!user){
        return redirect('/')
    }
    if(!user.privateMetadata.role){
        return <Unauthorized/>
    }else{
        const allPermissions = await getAuthUserDetails();
        const hasPermission = allPermissions?.Permissions.find((permission)=>
            permission.access && permission.subAccountId === slug.subaccountId
        )
        if(!hasPermission){
            return <Unauthorized/>
        }
        
        const allNotifications = await getNotificationAndUser(agencyId)
        if(user.privateMetadata.role === "AGENCY_ADMIN" || user.privateMetadata.role === "AGENCY_OWNER"){
            notifications = allNotifications
        }else{
            const filteredNoti = allNotifications?.filter((item)=>
            item.subAccountId === slug.subaccountId
            )
            if(filteredNoti) notifications=filteredNoti
        }
    }

    return <div className="h-screen overflow-hidden">
    <Sidebar id={slug.subaccountId} type="subaccount"></Sidebar>
    <div className="md:pl-[300px]">
        <InfoBar notifications={notifications} role={user.privateMetadata.role as Role} subAccountId={slug.subaccountId as string} ></InfoBar>
        <div className="relative">
            <BlurPage>{children}</BlurPage>
        </div>
    </div>
</div>
}

export default SubAccountRootLayout