'use client';

import { FC } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const GetStartedButton: FC = () => {
  const router = useRouter();
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button 
          size="lg" 
          variant="outline"
          >Get Started</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
      <Button 
          size="lg" 
          variant="default"
          onClick={() => router.push('/bookmarks')}
          className='cursor-pointer text-xl'
          >Get Started</Button>
      </SignedIn>
    </>
  );
};

export default GetStartedButton;