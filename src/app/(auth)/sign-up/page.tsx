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

function page() {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,300)
  const router = useRouter()

  // Zod schema for form validation
  const form = useForm<z.infer<typeof signUpSchema>>({  //optional no problem if i didnt write typescript typesafe
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      password: '',
      email: '',
    }
  })
  useEffect(()=>{
    const checkUsernameUnique = async () => {
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(AxiosError.response?.data.message ?? "error in checking username")
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit = async(data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up',data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.log("error in sign up",error);
      const AxiosError = error as AxiosError<ApiResponse>
      let message = AxiosError.response?.data.message ?? "error in sign up"
      toast.error(message)
    }finally{
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Create an Account
          </h1>
          <p className="mb-4">Join us and start your journey!</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" 
                {...field} 
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
              </FormControl>
              {isCheckingUsername && <Loader2 className='mr-2 h-4 w-4 animate-spin'/>}
              <p className={`text-sm ${usernameMessage === "Username is available" ? 'text-green-500':'text-red-500'}`}>
                {usernameMessage}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
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
            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>Signing Up...
            </> 
            : 
            "Sign Up"
          }
        </Button>
            </form>
          </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page