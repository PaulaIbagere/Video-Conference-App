'use client'

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation"

const MeetingPage = () => {
    //to et the id from the parameter
    const {id} = useParams<{id: string}>();
    if(!id) return
    const {isLoaded, user} = useUser();
    const {call, isCallLoading} = useGetCallById(id);
  return (
    <div>page</div>
  )
}

export default MeetingPage