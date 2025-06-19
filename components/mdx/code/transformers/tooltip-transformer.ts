import type { ShikiTransformer, ShikiTransformerContext } from 'shiki';
import { ElementContent, Element } from 'hast';

export function transformerCodeTooltipWords(tooltipMap: Record<string, string>): ShikiTransformer {
  const normalizedMap = Object.fromEntries(
    Object.entries(tooltipMap).map(([k, v]) => [k.toLowerCase(), v])
  );

  return {
    name: 'code-tooltip-words',

    line(this: ShikiTransformerContext, node: Element) {
      if (!Array.isArray(node.children)) return;

      node.children = node.children.flatMap((child) => {
        if (child.type !== 'element' || child.children.length !== 1) return child;
        const textNode = child.children[0];
        if (textNode.type !== 'text') return child;

        const parts = textNode.value.split(/(\b\w+\b)/g);

        const newNodes: ElementContent[] = parts.map((word) => {
          const key = word.toLowerCase();
          if (!normalizedMap[key]) return { type: 'text', value: word };

          return  {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['hasToolTip'],
              'data-tooltip': word,
            },
            children: [{ type: 'text', value: word }],
          }
        });

        return { ...child, children: newNodes };
      });
    },
  };
}