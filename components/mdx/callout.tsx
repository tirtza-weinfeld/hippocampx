import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, LightbulbIcon, NotebookIcon } from "lucide-react";

type CalloutProps = {
    type?: 'info' | 'warning' | 'error' | 'note' | 'success';
    title?: string;
    children: React.ReactNode;
  };
  
  export default function Callout({ type = 'note', title, children, ...props }: CalloutProps) {
    const iconMap = {
      info: <LightbulbIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400  
      group-hover:fill-yellow-600 dark:group-hover:text-yellow-300" />,
      warning: <AlertTriangleIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400 
      group-hover:fill-yellow-600 dark:group-hover:text-yellow-300 " />,
      error: <AlertCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400 
      group-hover:fill-red-600 dark:group-hover:text-red-300 group-hover:text-white" />,
      note: <NotebookIcon className="w-5 h-5 text-teal-500 dark:text-teal-400 
      group-hover:fill-teal-600 dark:group-hover:text-teal-300" />,
        success: <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400  group-hover:text-white
      group-hover:fill-green-600 dark:group-hover:text-green-300" />,
    };

    const shadowClasses = {
      info: 'border-l-4 border-orange-500 dark:border-orange-600 shadow-orange-500 dark:shadow-orange-600',
      warning: 'border-l-4 border-yellow-500 dark:border-yellow-600 shadow-yellow-500 dark:shadow-yellow-600',
      error: 'border-l-4 border-red-500 dark:border-red-600 shadow-red-500 dark:shadow-red-600',
      note: 'border-l-4 border-teal-500 dark:border-teal-600 shadow-teal-500 dark:shadow-teal-600',
      success: 'border-l-4 border-green-500 dark:border-green-600 shadow-green-500 dark:shadow-green-600',
    };

    return (
      <div className={`rounded-sm shadow-lg ${shadowClasses[type]} p-4 @container ${type} group my-2`} {...props}>
        <div className="flex gap-2 items-start text-base font-medium">
          <span className="text-xl">{iconMap[type]}</span>
          <div>
            {title && <div className="mb-1">{title}</div>}
            <div className="text-sm font-normal">{children}</div>
          </div>
        </div>
      </div>
    );
  }