import React from 'react'

const loading = () => {
  return (
     <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div role="status" className="flex flex-col items-center gap-2">
        <span
          className="inline-block w-8 h-8 rounded-full animate-spin
                     border-2 border-t-transparent border-gray-200 dark:border-black "
          aria-hidden="true"
        />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default loading