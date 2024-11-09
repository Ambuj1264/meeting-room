import React, { Suspense } from 'react'
import Exmaple from '../../../components/table'
import Loader from '../../../utility/loader/loading'
const ShowData = () => {
  return (
    <Suspense fallback={<Loader />}>
    <div className='m-20'>
      <Exmaple />
    </div>
    </Suspense>
    
  )
}

export default ShowData
