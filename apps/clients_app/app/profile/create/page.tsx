import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function CreateProfilePage() {
  return (
    <div>
      <nav className="bg-customBG text-white shadow-md shadow-emerald-800 max-w-screen">
        <div className="relative flex items-center justify-between w-full">
          <div className="flex items-center">
            <Logo />
          </div>

          <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-bold">
            Innogram
          </h1>
        </div>
      </nav>

      <main className="w-full min-h-screen bg-linear-to-t from-white to-customBG flex items-center justify-center px-6">
        <div className="text-center max-w-2xl pt-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Work in progress
          </h2>
          <div className="flex items-center justify-center gap-4">
            <Button className="px-6 py-3 border-teal-600 text-white rounded-md font-medium hover:bg-teal-50 transition hover:text-customBG">
              <Link href="/home">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
