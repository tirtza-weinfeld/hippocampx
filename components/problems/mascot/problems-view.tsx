import { ProblemsViewContent } from './problems-view-content'
// import METADATA from '@/lib/extracted-metadata/problems_metadata.json'
// import STATS from '@/lib/extracted-metadata/stats.json'
// import { Problems } from './mascot-types'


export function ProblemsView() {
  return (

      <ProblemsViewContent />

    // <div>hello</div>

    // const problems =  getProblems()
    // const timeComplexities =  getTimeComplexities()
    // const topics = getTopics()
    // return (
    //   <Suspense fallback={<div>Loading...</div>}>
    //     <ProblemsViewContent problemsPromise={problems} timeComplexitiesPromise={timeComplexities} topicsPromise={topics} />
    //   </Suspense>
  )
}



// async function SlowComponent() {
//   // const slowContent = await new Promise(resolve => setTimeout(resolve, 3000)).then(() => 'hello slow component')
//   const problems =Object.keys(await getProblems())
//   return (
//     <div>{problems}</div>
//   )
// }