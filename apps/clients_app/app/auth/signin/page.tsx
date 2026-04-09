import Link from "next/link";
import { Suspense } from "react";
import SigninForm from "@/components/forms/signinForm";

const SigninPage = () => {
  return (
    <div className="bg-white rounded-lg pl-2 pr-2 pt-4 pb-4 m-3 flex flex-col justify-center items-center w-full max-w-sm md:w-96 border-2 border-gray-200 min-h-96 ">
      <h1 className="black text-2xl text-center font-bold pb-6">Innogram</h1>
      <Suspense fallback={"Loading..."}>
        <SigninForm />
      </Suspense>
      <div className="flex flex-row justify-center items-center text-sm mt-5">
        <p className="p-1">Don't have account?</p>
        <Link
          className="underline text-emerald-600 hover:text-emerald-700"
          href={"signup"}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};
export default SigninPage;
