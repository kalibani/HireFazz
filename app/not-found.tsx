// app/not-found.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h2>404 Not Found</h2>
      <p>Could not find requested resource</p>
      <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );
}
