'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/model/user.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { log } from 'console'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { use, useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading,setLoading] = useState(false)
  const [isSwitchLoading,setSwitchLoading] = useState(false)

  //optimistic UI -- (very important)
  //for eg. when we like a post, we see that use liked a post.
  //but in backend it may happen after some time.
  //and if error comes in backend then we need to revert the state.

  const handleDeleteMessage = (messageId:string) => {
    setMessages(messages.filter((message)=> message._id !== messageId)) //this line is doing optimistic UI
  }
  const {data:session} = useSession()
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form  //check documentation react-hook-form
  //we are extracting some values from form 
  //register is used to register the input fields
  //watch is used to watch the value of the input fields
  //setValue is used to set the value of the input fields

  //earlier in sign-up or sign-in we hv directly used from.handleSubmit

  const acceptMessages = watch('acceptMessages')
  const fetchAcceptMessage = useCallback(async()=>{
    setSwitchLoading(true)
    try {
       const response = await axios.get<ApiResponse>('/api/accept-messages')
       setValue('acceptMessages', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      toast.error('Something went wrong')
    }finally{
      setSwitchLoading(false)
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{ 
    setLoading(true)
    setSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast.success('Messages refreshed')
      }
    } catch (error) {    
      toast.error('Something went wrong')
    }finally{
      setLoading(false)
      setSwitchLoading(false)
    }
  },[setLoading,setMessages])


  useEffect(() => {
    if(!session || !session?.user) return;
    fetchMessages()
    fetchAcceptMessage()
  },[session,setValue,fetchMessages,fetchAcceptMessage])

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Something went wrong')
    }
  }
  const user:User = session?.user as User
  const username = user?.username || user?.email

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)  //navigator comes from 'use client'
    toast.success('Link copied to clipboard')
  }

  if(!session || !session?.user){
    return <div>Please Login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page