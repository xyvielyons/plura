import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import { getLanesWithTicketandTags, getPipelineDetails } from '@/lib/queries'
import { LaneDetail } from '@/lib/types'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelineInfobar from '../_components/pipeline-infobar'
interface Props {
  params:{
    pipelineId:string,
    subaccountId:string
  }
}
const PipelinePage = async({params}:Props) => {
  const myParams = await params
  const pipelineDetails = await getPipelineDetails(myParams.pipelineId)

  if(!pipelineDetails){
    return redirect(`/subaccount/${myParams.subaccountId}/pipelines`)
  }

  const pipelines = await db.pipeline.findMany({
    where:{subAccountId:myParams.subaccountId}
  })

  const lanes = await getLanesWithTicketandTags(myParams.pipelineId) as LaneDetail[]
  return (
   <Tabs defaultValue='view' className='w-full'>
      <TabsList className='bg-transparent border-b-2 h-16 w-full justify-between mb-4'>
          <PipelineInfobar
            pipelineId={myParams.pipelineId}
            subAccountId={myParams.subaccountId}
            pipelines={pipelines}
          />
          <div className="">
            <TabsTrigger value='view'>
              Pipeline View
            </TabsTrigger>
            <TabsTrigger value='settings'>
              Settings
            </TabsTrigger>
          </div>
      </TabsList>

      <TabsContent value='view'>
          Pipeline View
      </TabsContent>
      <TabsContent value='settings'>
          Settings View
      </TabsContent>

   </Tabs>
  )
}

export default PipelinePage