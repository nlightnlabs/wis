import React from 'react'

const Module = ({url}) => {
  return (
    <div className="flex w-full h-[100vh] flex-col text-gray-600">
        <iframe src={url} className="flex w-full h-[100%] border-white border-3"></iframe>
    </div>
  )
}

export default Module
