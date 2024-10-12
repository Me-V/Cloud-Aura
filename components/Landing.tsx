import { SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Landing = () => {
    return (
        <div className="min-h-screen bg-black flex flex-col p-4 sm:p-6 md:p-10">
            <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-normal bg-gradient-to-br from-blue-500 via-green-400 to-yellow-300 bg-clip-text text-transparent  sm:text-left mb-4 sm:mb-6 md:mb-8 mt-8 sm:mt-0">
                Cloud Aura
            </h1>

            <div className="flex-grow flex flex-col items-center justify-center">
                <p className="text-white font-semibold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 md:mb-8">You Are Not Logged In</p>
                <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px]">
                    <Image
                        src="/signIn.svg"
                        alt="clerk"
                        width={450}
                        height={450}
                        layout="responsive"
                    />
                </div>
                <button className="bg-white mt-6 sm:mt-8 md:mt-10 text-black px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-200 transition-colors">
                    <SignInButton mode='modal'>
                        Sign In
                    </SignInButton>
                </button>
            </div>
        </div>
    )
}

export default Landing