'use client'
import { useUser } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react"
import { tokenProvider } from "@/actions/stream.actions";
import Loading from "@/components/Loading";
import {StreamVideoClient ,StreamVideo } from "@stream-io/video-react-sdk";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamProvider = ({children}: {children: 'ReactNode'}) => {
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    //to get the user information
    const {user, isLoaded} = useUser();

    useEffect(() =>{
        if(!isLoaded || !user) return; //if the user is not loaded or there is no user, return from the component
        if(!API_KEY) throw new Error('Stream API key is missing');

        const client = new StreamVideoClient({
            apiKey: API_KEY,
            user: {
              id: user?.id,
              name: user.firstName || user?.username || 'User',
              image: user?.imageUrl,
            },
            tokenProvider,
        });

        setVideoClient(client);
        return () =>{
          client.disconnectUser();
          setVideoClient(undefined);
        }
    }, [user, isLoaded])

    if(!videoClient) return <Loading/>
  return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
  )
}

export default StreamProvider