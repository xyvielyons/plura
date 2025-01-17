import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
interface Props {
    params:{subaccountId:string}
}
const PipelinePage = async({params}:Props) => {
    const myParams = await params
    const pipelineExists = await db.pipeline.findFirst({
        where:{subAccountId:myParams.subaccountId}
    })

    if(pipelineExists)
        return redirect(
            `/subaccount/${myParams.subaccountId}/pipelines/${pipelineExists.id}`
        )
    
    try {
        const response = await db.pipeline.create({
            data:{
                name:'FirstPipeline',
                subAccountId:myParams.subaccountId
            }

        })
        return redirect(`/subaccount/${myParams.subaccountId}/pipelines/${response.id}`)
    } catch (error) {
        
    }
}

export default PipelinePage