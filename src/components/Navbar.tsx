'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {User} from 'next-auth' 
import { Button } from './ui/button'
//if you are authenticated it means you will get User and User ke ander session bhi hai and token bhi hai
// means User ke session ke ander vo sab data gaya hoga jo aapne session ke ander pass kiya hoga
//means data.user ham nhi kr sakte kyuki
//User ke ander session hai and session ke ander data hai
function Navbar() {
    const {data:session} = useSession();
    const user:User = session?.user as User
  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className="text-xl font-bol mb-4 md:mb-0" href="#">Mystry Message</a>
            {
                //now authenticated hoga then session hoga.
                session ? (
                    <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut}>Log Out</Button>
                    </>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar