import BlurPage from '@/components/global/blur-page'
import React from 'react'

const PipelineLayout = async({children}:{children:React.ReactNode}) => {

  return (
    <BlurPage>{children}</BlurPage>
  )
}

export default PipelineLayout