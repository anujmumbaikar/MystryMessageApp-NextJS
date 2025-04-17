'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import {useDebounceValue} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

function page() {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username,300)
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
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(AxiosError.response?.data.message ?? "error in checking username")
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
  },[debouncedUsername])

  return (
    <div>page</div>
  )
}

export default page