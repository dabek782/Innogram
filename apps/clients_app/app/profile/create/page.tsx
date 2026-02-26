import Link from "next/link";
import Logo from "@/components/ui/logo/logo";
import ProfileCreate from "@/components/forms/profileCreateForm";

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
        <div className="text-center max-w-2xl pt-6"></div>
        <ProfileCreate />
      </main>
    </div>
  );
}
