import React from 'react'

const loading = () => {
  return (
    <div className='bg-white/80'
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 50 50"
        aria-hidden="true"
        style={{ display: 'block', color: '#111827' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          strokeOpacity="0.12"
          fill="none"
        />
        <path
          d="M25 5
             a20 20 0 0 1 0 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Loading
      </span>
    </div>
  )
}

export default loading