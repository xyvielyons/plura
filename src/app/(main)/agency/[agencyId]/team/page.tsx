import { db } from '@/lib/db'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

interface Props {
  params:{agencyId:string}
}
const TeamPage = async({params}:Props) => {
  const slug = await params
  const authUser = await currentUser()
  const teamMembers = await db.user.findMany({
    where:{
      Agency:{
        id:slug.agencyId
      }
    },
    include:{
      Agency:{
        include:{
          SubAccount:true
        }
      },
      Permissions:{
        include:{
          SubAccount:true
        }
      }
    }
  })

  if(!authUser) return null

  const agencyDetails = await db.agency.findUnique({
    where:{
      id:slug.agencyId
    },
    include:{
      SubAccount:true
    }
  })
  if(!agencyDetails) return
  return (
    <DataTable 
    actionButtonText={
      <>
        <Plus size={15}/>
        Add
      </>
    }
    modalChildren={<SendInvitation agencyId={agencyDetails.id}></SendInvitation>}
    filterValue='name'
    columns={columns}
    data={teamMembers}
    
    >

    </DataTable>
  )
}

export default TeamPage