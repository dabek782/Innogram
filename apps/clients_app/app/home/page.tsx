import Link from "next/link";
import Logo from "@/components/ui/logo/logo";
import { Button } from "@/components/ui/button/button";
export default function Home() {
  return (
    <div>
      <nav className="bg-customBG text-white ">
        <div className="flex flex-row justify-between items-center max-h-screen w-scren">
          <div className="flex items-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-center">
            Welcome to Innogram
          </h1>
          <div className="flex items-center justify-end gap-4 hover:cursor-pointer">
            <Button className="px-4 items-center ">
              <Link
                href={"/auth/signup"}
                className=" rounded-md text-white font-medium transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:text-customBG hover:bg-white text-center"
              >
                Sign up
              </Link>
            </Button>
            <Button className="px-4">
              <Link
                href={"/auth/signin"}
                className=" rounded-md text-white font-medium transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:text-customBG hover:bg-white text-center"
              >
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      <main className="w-full min-h-dvh bg-linear-to-t from-white to-customBG flex items-center justify-center px-6">
        <div className="text-center max-w-2xl pt-6">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Connect, Share, Explore
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Build your profile, share your ideas, and connect with people who
            inspire you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="px-6 py-3 border-teal-600   text-white rounded-md font-medium hover:bg-teal-50 transition hover:text-customBG">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button className="px-6 py-3 border text-white border-teal-600  rounded-md font-medium hover:bg-teal-50 transition hover:text-customBG">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
