import { Plugin } from 'unified';
import { Root, ElementContent, Parent, Element } from 'hast';
import { CONTINUE, visit } from 'unist-util-visit';

type TooltipMap = Record<string, string>;

const rehypeTooltipWords: Plugin<[TooltipMap], Root> = (tooltipMap) => {
    return (tree) => {
        // console.log('[rehypeTooltipWords] tooltipMap keys:', Object.keys(tooltipMap));
        const normalizedMap: TooltipMap = {};
        for (const key in tooltipMap) {
            normalizedMap[key.toLowerCase()] = tooltipMap[key];
        }
        const changes: Array<{
            parent: Parent;
            index: number;
            replacement: ElementContent[];
        }> = [];

        visit(tree, 'text', (node, index, parent) => {
            if (!parent || typeof index !== 'number') return;
            const parentElement = parent as Element;
            if (!('tagName' in parentElement)) return;

            // console.log('[rehypeTooltipWords] visiting tex-c:', node.value);

            // Skip <code> and <pre> blocks
            if (['code', 'pre'].includes(parentElement.tagName)) {
                return CONTINUE;
            }

            const parts = node.value.split(/(\b\w+\b)/g);
            const newNodes: ElementContent[] = parts.map((word) =>
              normalizedMap[word.toLowerCase()]
                ?
                {
                    // type: 'mdxJsxFlowElement',
                    // name: 'ContentPopover',
                    // attributes: [
                    //   { type: 'mdxJsxAttribute', name: 'word', value: word.toLowerCase() },
                    //   { type: 'mdxJsxAttribute', name: 'content', value: normalizedMap[word.toLowerCase()] }
                    // ],
                    type: 'element',
                    tagName: 'span',
                    properties: {
                      className: ['hasToolTip'],
                      'data-tooltip': word.toLowerCase(),
                    },
                    children: [{ type: 'text', value: word }],
                  }
                //  {
                //     type: 'element',
                //     tagName: 'span',
                //     properties: {
                //       className: ['hasToolTip'],
                //       'data-tooltip': word.toLowerCase(),
                //     },
                //     children: [{ type: 'text', value: word }],
                //   }
                : { type: 'text', value: word }
            );

            changes.push({ parent, index, replacement: newNodes });
        });

        // Apply changes after traversal
        for (const { parent, index, replacement } of changes.reverse()) {
            parent.children.splice(index, 1, ...replacement);
        }
    };
};

export default rehypeTooltipWords;
