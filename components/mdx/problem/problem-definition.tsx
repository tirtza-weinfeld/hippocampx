"use client";


interface ProblemDefinitionProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function ProblemDefinitionHeader({ children, className }: ProblemDefinitionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function ProblemDefinitionContent({ children, ...props }: ProblemDefinitionProps) {
  return (

      <div {...props} className="dark:[&_p]:text-sky-400! [&_p]:text-sky-500! ">
      {children}
      </div>
      // <Em {...props}>
      // {children}
      // </Em>

  );
}