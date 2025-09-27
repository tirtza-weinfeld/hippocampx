
import BinaryPractice from "@/components/binary/binary-practice"

  

export default async function PracticePage() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return (
    <>


      <BinaryPractice />
    </>
  )
}
