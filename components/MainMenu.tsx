'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogDescription, DialogTitle} from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import MenuItemCard from "./MenuItemCard"
import { Button } from "./ui/button"
import { useUser } from "@clerk/nextjs"
import meeting from '../public/assets/new-meeting.svg'
import DatePicker from "react-datepicker";
import joinMeeting from '../public/assets/join-meeting.svg'
import recording from '../public/assets/recordings2.svg'
import calendar from '../public/assets/calendar.svg'
import Loading from "./Loading"
import { Input } from "./ui/input"
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"

const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
}

const MainMenu = () => {
  const {user} = useUser()
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [meetingState, setMeetingState] = useState<'Schedule' | 'Instant' | undefined>(undefined);
  const client = useStreamVideoClient();


  const createMeeting = async () =>{
    if(!user) return router.push('/login')
      if(!client) return router.push('/')

        try{
          if(!values.dateTime){
            toast('Please select a date and time', {
              duration: 3000,
              className: 'bg-gray-3000 rounded-3xl py-8 px-5 justify-center'
            })
            return;
          }

          //to create an Id for the meeting
          const id = crypto.randomUUID();
          //to create a unique meeting room
          const call = client.call('default', id);
          if(!call) throw new Error('Failed to create meeting');
          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
          const description = values.description || 'No Description';

          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description,
              }
            }
          });

          await call.updateCallMembers({
            update_members: [{user_id: user.id}]
          });

          if(meetingState === 'Instant'){
            router.push(`/meeting/${call.id}`);
            toast('Setting up your meeting', {
              duration: 3000,
              className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
            })
          }

          if(meetingState === 'Schedule'){
            router.push('/upcoming')
            toast(`Your meeting is schedules at ${values.dateTime}`, {
              duration: 5000,
              className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
            })
          }

        }catch(err: any){
          toast(`Failed to create Meeting ${err.message}`, {
            duration: 3000,
            className: '!bg-gray-300 !rounded-3xl !py-8 !px-5 !justify-center'
          })
        }
  }

  //run this whenever the meeting state changes. this changes everytime we click on create a meeting
  useEffect(() =>{
    if(meetingState){
      createMeeting();
    }
  }, [meetingState]);

  if(!client || !user) return <Loading/>;
  
  return (
    <section className="gird grid-cols-2 gap-3 max-sm:grid-col-1">
      <Dialog>
        <DialogTrigger>
          <MenuItemCard img={meeting} title="New Meeting" bgColor="bg-orange-500" hoverColor="hover:bg-orange-800"/>
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black leading-relaxed text-center">
                Start an Instant Meeting
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center">
                Add a meeting description
                <Textarea className="inputes p-5" rows={4}
                onChange={(e) => setValues({...values, description: e.target.value})}
                />
                <Button 
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer" onClick={() => setMeetingState('Instant')}
                >Create Meeting</Button>
              </DialogDescription>
            </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          <MenuItemCard img={joinMeeting} title="Join Meeting" bgColor="bg-blue-600" hoverColor="hover:bg-blue-800"/>
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black leading-relaxed text-center">
                Type the Meeting link
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center">
                Add a meeting description
                <Input type='text' placeholder="Meeting Link"
                onChange={(e) => setValues({...values, link: e.target.value})} className="inputs"/>
                <Button 
                className="mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer" onClick={() => router.push(values.link)}
                >Join Meeting</Button>
              </DialogDescription>
            </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger>
          <MenuItemCard img={calendar} title="Schedule" bgColor="bg-blue-600" hoverColor="hover:bg-blue-800"/>
        </DialogTrigger>
        <DialogContent className="bg-gray-200 px-16 py-10 text-gray-900 !rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black leading-relaxed text-center">
                Schedule Meeting
              </DialogTitle>
              <DialogDescription className="flex flex-col items-center">
                Add a meeting description
                <Textarea className="inputs p-5"
                rows={4} onChange={(e) => setValues({...values, description: e.target.value})}/>
              </DialogDescription>
              <div className="flex w-full flex-col gap-2.5">
                <label className="text-base font-normal leading-[22.4px] text-sky-2">Select Date and Time</label>

                <DatePicker
                  preventOpenOnFocus
                  selected={values.dateTime}
                  onChange={(data) => setValues({...values, dateTime: data!})}
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="inputs w-full rounded p-2 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-200 "
                />
              </div>
              <Button className='!mt-5 font-extrabold text-lg text-white rounded-xl bg-blue-700 py-5 px-10 hover:bg-blue-900 hover:scale-110 transition ease-in-out delay-75 duration-700 hover:-translate-y-1 cursor-pointer'
              onClick={() => setMeetingState('Schedule')}
              >
                  Submit
              </Button>
            </DialogHeader>
        </DialogContent>
      </Dialog>
      <MenuItemCard
        img={recording}
        title="Recordings"
        bgColor="bg-blue-600"
        hoverColor="hover:bg-blue-800"
        handleClick={() => router.push('/recordings')}
      />
    </section>
  )
}

export default MainMenu