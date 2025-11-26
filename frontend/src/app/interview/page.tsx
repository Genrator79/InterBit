"use client";


import Image from 'next/image'
import Link from 'next/link'
import Agent from '@/components/agent';
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const page = () => {

  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);


  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-12 my-12 px-6">
      
      {/* Navbar */}
      <nav>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">InterBit</h2> 
        </Link>
      </nav>

      {/* Hero */}
      <>
        <h3 className="text-4xl font-bold tracking-tight">
          Interview Generation
        </h3>
        {user && 
          <Agent username={user.username} userId={user.id} type="generate" interviewId='0' questions={[]}/>
        }
      </>

    </div>
  );
};

export default page;
