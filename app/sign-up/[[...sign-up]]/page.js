import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-extrabold text-[#8c6d46] mb-4 max-sm:text-2xl">
        storemywine.online
      </h1>
      <p className="text-lg text-[#6b5236] mb-4 max-sm:text-base">
      your personal ai wine cellar
      </p>
         <SignUp />
    </div>
  )
}