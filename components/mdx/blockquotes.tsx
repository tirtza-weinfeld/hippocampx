import Alert from "./alert"


export default function Blockquote(props: React.ComponentPropsWithoutRef<'blockquote'>) {

  return (
    // <blockquote className=" rounded-md shadow-lg dark:shadow-cyan-200/30  shadow-cyan-200/50
    // bg-background/80 p-2 flex flex-col gap-2 my-3" {...props}>
    //   {props.children}
    // </blockquote>
    <blockquote 
    

      {...props}
    >
      <Alert type="note">
        {props.children}
      </Alert>
    </blockquote>
  )
}