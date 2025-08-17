import { Card } from "@/components/ui/card";
import Sellform from "../components/form/Sellform"; // Use default import
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function SellForm() {

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if(!user)
  {
    throw new Error('Unauthorized');
  }

  return (
    <Card>
      <Sellform />
    </Card>
  );
}
