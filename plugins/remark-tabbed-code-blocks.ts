import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Node, Parent, Literal } from 'unist';

interface CodeNode extends Literal {
    type: 'code';
    lang?: string;
    meta?: string;
    value: string;
}

interface TabbedCodeTab {
    label: string;
    code: string;
    language: string;
}

// Matches: ---tab:python filename="foo.py" label="My Label" ...
const TAB_DELIMITER = /^---tab:([^\s]+)?(?:\s+filename="([^"]+)")?(?:\s+label="([^"]+)")?.*$/m;

const remarkTabbedCodeBlocks: Plugin = () => (tree: Node) => {
    visit(tree, 'code', (node: CodeNode, index: number, parent: Parent | undefined) => {
        if (node.lang !== 'tabbed' || typeof node.value !== 'string' || !parent) return;

        // Split into tab sections
        const sections = node.value.split(/\n(?=---tab:)/g);
        const tabs: TabbedCodeTab[] = [];

        for (const section of sections) {
            const match = section.match(TAB_DELIMITER);
            if (!match) continue;
            // match[1]: language or label, match[2]: filename (optional), match[3]: label (optional)
            const langOrLabel = match[1]?.trim() ?? '';
            const filename = match[2]?.trim();
            const explicitLabel = match[3]?.trim();
            // Everything after the delimiter is the code
            const code = section.replace(TAB_DELIMITER, '').replace(/^\n+/, '');
            // Determine label and language
            const label = explicitLabel || filename || langOrLabel;
            let language = '';
            // If both language and filename are present
            if (filename && langOrLabel) {
                language = langOrLabel;
            } else if (langOrLabel.endsWith('.py')) {
                language = 'python';
            } else if (langOrLabel.endsWith('.ts')) {
                language = 'typescript';
            } else if (langOrLabel.endsWith('.js')) {
                language = 'javascript';
            } else if (langOrLabel.endsWith('.tsx')) {
                language = 'tsx';
            } else if (langOrLabel.endsWith('.jsx')) {
                language = 'jsx';
            } else if (langOrLabel) {
                language = langOrLabel;
            }
            tabs.push({ label, code, language });
        }

        if (tabs.length > 0) {
            const jsxNode = {
                type: 'mdxJsxFlowElement',
                name: 'TabbedCodeBlock',
                attributes: [
                    {
                        type: 'mdxJsxAttribute',
                        name: 'tabs',
                        value: JSON.stringify(tabs),
                    },
                ],
                children: [],
            }
            parent.children.splice(index, 1, jsxNode)
        }
    });
};

export default remarkTabbedCodeBlocks; 