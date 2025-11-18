import Image from 'next/image'
import Link from 'next/link'
import Agent from '@/components/agent';

const page = () => {
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

        <Agent username="You" userId="user1" type="generate" />

      </>

    </div>
  );
};

export default page;
