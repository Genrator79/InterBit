// src/app/signup/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState, useContext, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "@/utils/axios";
import { UserContext, User } from "@/context/UserContext";
import { toast } from "sonner";



export default function SignUpPage() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<{ success: boolean; user: User; accessToken: string; message?: string }>("/auth/register", { username, email, password });

      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        toast.success("Account created successfully!", { duration: 2000 });
        // Redirect to home page);
        // Redirect to home page
        router.push("/dashboard");
      } else {
        toast.error(res.data.message || "SignUp failed!", { duration: 2000 });
        // Redirect to home page);
      }
    } catch (err: any) {
      if (err.response && err.response.data?.message) {
        // This is your backend error (invalid credentials)
        toast.error(err.response.data.message, { duration: 2000 });
      } else {
        toast.error("Something went wrong!", { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/5 to-primary/5 p-6">
      <div className="relative z-10 w-full max-w-md p-8 bg-background/80 backdrop-blur-lg rounded-2xl shadow-lg">
        <div className="flex justify-center mb-6">
          <Image priority={true} src="/hero.png" alt="DentWise AI" width={120} height={120} className="rounded-xl" />
        </div>

        <h2 className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-center mb-4">
          Create New Account
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Step into the world of smarter AI interview prep.</p>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm font-medium text-foreground mb-1">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="px-4 py-2 rounded-lg border border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-background text-foreground" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-foreground mb-1">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-4 py-2 rounded-lg border border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-background text-foreground" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-foreground mb-1">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-4 py-2 rounded-lg border border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-background text-foreground" />
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </section>
  );
}
