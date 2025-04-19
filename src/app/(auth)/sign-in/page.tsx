'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import {useDebounceValue,useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {Loader2} from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

function page() {
  const [isSubmitting,setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({  //optional no problem if i didnt write typescript typesafe
    resolver: zodResolver(signInSchema),
    defaultValues:{
      password: '',
      identifier: '',
    }
  })
  const onSubmit = async(data:z.infer<typeof signInSchema>)=>{
    //since here we are using nextAuth . we dont requrie the things which we have done in
    //in sign up .
    //as we know that in nextauth the things are standardized , 
    //so the sign in is usually sam eof all types of sign in pasges .
    //but in sign up according to our needs we may be requied multiple things 
    //like phone number addresss, username, etc. whatever it is .
    // so since acc. to our use cases we have to check.
    const result = await signIn('credentials',{    //this signIn is coming from next-auth and we hv to give provider type also. and data
      redirect:false,   //this is used to not redirect to the page
      identifier:data.identifier,
      password:data.password
    })
    if(result?.error){
      toast.error(result.error)
    }
    if(result?.url){ //now in nextauth redirection is little bit differernt. // so inste of that i will be using router
      toast.success("Login Successful")
      router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign In
          </h1>
          <p className="mb-4">Sign In and start your anonymous adventure</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" 
                {...field} 
                />  
                {/* here we have not used onChange because it handle on its own
                previous we used onChange to set username state because we are handling the case of debouncing
                 */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" 
                {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>
          {
            isSubmitting? 
            <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Signing In...
            </> 
            : 
            "Sign In"
          }
        </Button>
            </form>
          </Form>
        <div className="text-center mt-4">
          <p>
            New Member?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page