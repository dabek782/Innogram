import Link from "next/link";
import AuthLayout from "./auth/layout";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to Innogram</h1>
      <p>Do you have account if not signup</p>
      <Link href={"/auth/signup"}>Sign up</Link>
      <Link href={"/auth/signin"}>Sign in</Link>
    </div>
    // redirect("/auth/signup")
  );
}
