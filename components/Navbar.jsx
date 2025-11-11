import Link from "next/link"

export default function Navbar() {
  return (
    <div className="w-full absolute bg-violet-500">

      <div className="max-w-[1320px] h-[50px] flex items-center justify-center mx-auto px-3 ">

        <nav className="w-full flex items-center justify-evenly gap-4 text-white">

          <h1 className="text-xl text-emerald-300">Logo</h1>

          <Link href='/' className="hover:text-blue-200">Home</Link>
          <Link href='/about' className="hover:text-blue-200">About</Link>
          <Link href='/login' className="hover:text-blue-200">Login</Link>
          <Link href='/signUp' className="hover:text-blue-200">Sign Up</Link>

        </nav>

      </div>

    </div>
  )
}