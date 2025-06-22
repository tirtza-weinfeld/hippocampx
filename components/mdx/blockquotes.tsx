export default function Blockquote(props: React.ComponentPropsWithoutRef<'blockquote'>) {

  return (
    <blockquote className="border-l-4 rounded-r shadow-lg shadow-cyan-200/30 border-sky-300/50  dark:border-sky-300/50  bg-background/80 p-2 flex flex-col gap-2" {...props}>
      {props.children}
    </blockquote>
  )
}