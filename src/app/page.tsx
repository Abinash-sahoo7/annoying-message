import dbConnect from "@/lib/dbConnect";
import Image from "next/image";

export default async function Home() {
  await dbConnect();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Hello world
    </main>
  );
}
