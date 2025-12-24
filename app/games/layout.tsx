export default function GamesLayout({ children }: { children: React.ReactNode }) {
  // return <div className="bg-gradient-games/0.5 min-h-screen">
  return <div className=" min-h-screen  @container bg-gradient-games-background rounded-lg  ">

      
      {children}
{/* <div className="flex justify-center items-center flex-wrap gap-4 flex-col bg-gradient-black">
    <div className="text-gradient-red text-3xl text-center  w-fit ">hi color red</div>
    <div className="text-gradient-sky text-3xl text-center w-fit ">hi color sky</div>
    <div className="text-gradient-blue text-3xl text-center w-fit ">hi color blue</div>
    </div>
    <div className="text-gradient-red/0.5 text-3xl text-center w-fit ">hi color blue</div> */}

    </div>;
}