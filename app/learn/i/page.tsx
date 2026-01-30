
import { flowModelIllustrations } from
    "@/components/illustrations/flow-models"



export default function IPage() {
    const R=flowModelIllustrations["euler-method"]
    return <div>
            <div>
                {Object.entries(flowModelIllustrations).length}
        </div>
        <div>
        <R/>
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