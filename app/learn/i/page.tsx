
import { flowModelIllustrations } from
    "@/components/illustrations/flow-models"



export default function IPage() {
    return <div>
            <div>
                {Object.entries(flowModelIllustrations).length}
        </div>

        {
    
        Object.entries(flowModelIllustrations).map(([slug, Illustration]) => (
            <div key={slug}>
                <h3>{slug}</h3>
                <Illustration />
            </div>
        ))
    }

    </div>

}