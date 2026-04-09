// app/auth/callback/page.tsx (Server Component)
import { Suspense } from 'react';
import CallbackValidation from './callbackContent';

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackValidation />
    </Suspense>
  );
}