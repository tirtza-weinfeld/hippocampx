import { M } from "./a"
import { SectionHeader } from "@/components/mdx/section/section-header"
import { SectionContent } from "@/components/mdx/section/section-content"
import { Section } from "@/components/mdx/section/section"
import CodeBlock from "@/components/mdx/code/code-block"
// import { DebugReactExports } from "./debug"
import TopKFrequentElements from "@/components/problems/tutorials/347-top-k-frequent-elements.mdx"
import Balckboard from "./balckboard.mdx"

export default function TestPage() {
    return (
        <div>

            {/* <h1>Test Page</h1> */}
            {/* <DebugReactExports /> */}
            {/* <hr /> */}
            {/* <M /> */}

            {/* <h2>Testing Plugin Generated Sections:</h2> */}
            {/* <TopKFrequentElements /> */}
            <Balckboard />

        </div>
    )
}