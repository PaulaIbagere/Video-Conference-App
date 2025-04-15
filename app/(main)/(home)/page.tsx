import StatusBar from "@/components/StatusBar"
import MainMenu from "@/components/MainMenu"
const HomePage = () =>{
    return(
       <div className="flex flex-col gap-32 mt-50 pl-10 items-center max-md:gap-10 md:flex-row animate-fade-in">
            <StatusBar/>
            <MainMenu/>
       </div>
    )
}
export default HomePage