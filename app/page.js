import { BeigeWineDashboard } from "@/components/beige-wine-dashboard";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return <SignIn />;
  }

  return (
    <BeigeWineDashboard />
  );
}
