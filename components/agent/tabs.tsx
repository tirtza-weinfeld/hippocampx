// SERVER component
import { TabButton } from './tab-button'

type Section = 'definition' | 'codeSnippet' | 'intuition' | 'timeComplexity' | 'keyExpressions'

type TabsProps = {
  sections: Section[]
}

export default function Tabs({ sections }: TabsProps) {
  return (
    <div>
      {sections.map(section => (
        <TabButton key={section} section={section} />
      ))}
    </div>
  )
}
