import Link from "next/link";
import { Suspense } from "react";
import SignUpForm from "@/components/forms/signupForm";

const SignupPage = () => {
  return (
    <div className="bg-white rounded-lg pl-2 pr-2 pt-4 pb-4 m-3 flex flex-col justify-center items-center w-full max-w-sm md:w-96 border-2 border-gray-200 min-h-96 ">
      <h1 className="black text-2xl text-center font-bold pb-6  ">Innogram</h1>
      {/* <Suspense fallback={"Loading..."}> */}
      <SignUpForm />
      {/* </Suspense> */}

      <div className="flex flex-row justify-center items-center text-sm mt-5">
        <p className="p-1">Already have an account?</p>
        <Link
          className="underline text-emerald-600 hover:text-emerald-700 gap-1"
          href={"signin"}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
export default SignupPage;
