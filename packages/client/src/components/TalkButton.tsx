// components/TalkButton.tsx
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const TalkButton: React.FC = () => {
  const [isListening, setIsListening] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isFocused) {
        setIsListening(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsListening(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isFocused])

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setIsListening(true)
    } else {
      setIsListening(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 m-5 rounded-lg shadow-xl'>
      <div className='w-full p-4 mb-4  rounded-lg shadow flex flex-col items-center'>
        <Image
          src={isListening ? '/Cat1.jpg' : '/Cat2.jpg'}
          alt='Hold to talk'
          width={450}
          height={450}
          className='rounded-lg' // Apply rounded corners.

          // Optional: Add layout="fill" if you want the image to fill the container
        />
      </div>
      <input
        type='text'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleInput}
        className='
    w-1/2
    p-4
    text-lg
    font-Khalif
    text-black
    border-2 
    border-gray-300 
    rounded-lg 
    focus:ring-2 
    focus:ring-purple-500 
    focus:border-transparent 
    focus:outline-none 
    transition 
    duration-300 
    ease-in-out 
    shadow-sm 
    hover:shadow-md 
    placeholder-gray-400 
    focus:placeholder-transparent
  '
        placeholder='Type something...'
      />

      <p>Hold the spacebar or type in the box to talk</p>
    </div>
  )
}

export default TalkButton
