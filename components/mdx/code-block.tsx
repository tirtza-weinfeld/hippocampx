import { codeToHast } from 'shiki'
import { transformerMetaHighlight} from '@shikijs/transformers'
import { transformerMetaWordHighlight } from './code/transformers/meta-highlight-word'
import CopyCode from './copy-code';
import { transformerCodeTooltipWords } from './code/transformers/tooltip-transformer';
import { POPOVER_CONTENT } from './code/popover-content';
import { hastToJSX } from './code/hast-to-tsx';


export type CodeBlockProps = {
  className: string;
  meta?: string;
  children: React.ReactNode;
};

export default async function CodeBlock(props: CodeBlockProps) {

  const { className, meta, children: code } = { ...props }

  const hast= await codeToHast(code as string, {


    lang: className.replace('language-', ''),
    meta: { __raw: meta },
    themes: {
      light: 'light-plus',
      dark: 'dark-plus',
    },
    colorReplacements: {
      'light-plus': {
        '#ffffff': 'var(--bg-background)'
      },
      'dark-plus': {
        // '#1e1e1e': 'var(--color-red-500)',
      }
    },
    defaultColor: 'light-dark()',

    transformers: [
      transformerMetaWordHighlight({ 
        className: `word-highlight shadow-xl`,
        tooltipMap: POPOVER_CONTENT
      }),
      transformerMetaHighlight({ className: `line-highlight` }),
      transformerCodeTooltipWords({
        ...POPOVER_CONTENT
      })




    ],
  })


  const jsxTree = hastToJSX(hast)
  return (

    <div className=" shadow-2xl rounded-md  dark:bg-gray-800 bg-gray-100  p-4 my-4">


      <div className="relative ">


        <CopyCode className="absolute top-0 right-0 " code={code as string} />
        <div className="overflow-x-auto py-8 ">{jsxTree}</div>
      </div>
    </div>

  )
}


