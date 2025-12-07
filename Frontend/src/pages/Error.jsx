import React from 'react'

const NoPage = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-900 px-4'>
      <div className='text-center'>
        <h1 className='text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4'>
          404
        </h1>
        <p className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 font-semibold'>
          Error! Page Not Found
        </p>
        <p className='text-sm sm:text-base md:text-lg text-gray-500 mt-4 max-w-md mx-auto'>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  )
}

export default NoPage