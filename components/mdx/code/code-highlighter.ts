import { codeToHast } from 'shiki'
import { transformerCodeTooltipWords } from './transformers/meta-tooltip';
import { hastToJSX } from './hast-to-tsx';
import { getTooltipContent } from './tooltip-content';
import { transformerMetaHighlight } from './transformers/meta-highlight';
import { transformerMetaWordHighlight } from './transformers/meta-highlight-word';
import { transformerMetaAddIds } from './transformers/meta-auto-link';


export default async function highlightCode(code: string, lang: string, meta?: string, transformers: boolean = true, isInline: boolean = false) {
  const tooltipContent = await getTooltipContent()

  const hast = await codeToHast(code as string, {
    lang: lang,
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
      }
    },
    defaultColor: 'light-dark()',
    transformers: transformers ? [
      transformerMetaHighlight({className: 'line-highlight'}),
      transformerMetaWordHighlight({className: 'word-highlight'}),
      transformerCodeTooltipWords({
        ...tooltipContent
      }),
      transformerMetaAddIds({
        ...tooltipContent
      }, {
        className: 'auto-link-target'
      }),
      // transformerMetaAddHrefs({
      //   ...tooltipContent
      // }, {
      //   className: 'auto-link'
      // }),
    ] : [],
  })

  return hastToJSX(hast, isInline)

}

