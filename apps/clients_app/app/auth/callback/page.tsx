import { Suspense } from "react";
import CallbackValidation from "./callbackContent";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Please wait..</div>}>
      <CallbackValidation />
    </Suspense>
  );
}
