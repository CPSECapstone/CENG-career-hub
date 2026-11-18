"use client";
import { createClient } from "@/lib/supabase/client";
import { studentMagicLink } from "@/app/auth/login-sign-up-logic/magic-link";
import AuthForm from "@/components/auth-form/auth-form";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";




export default function Login() {
  const router = useRouter();

  async function handleLogin(email: string): Promise<void> {
    const supabase = createClient();
    await studentMagicLink(supabase.auth, email, false);
  }


  return (
    <div className="cover-photo">
      <div>
        <Navbar />
        <AuthForm
          title="Login"
          buttonText="Login"
          fields={[
            {
              label: "Email",
              Icon: Mail,
              type: "email",
              customPlaceHolder: "Enter your email",
            },
            
          ]}
          onSubmit={handleLogin}
          bottomText="Don't have an account?"
          bottomButtonText="Sign Up"
          onBottomButtonClick={() => router.push("/auth/sign-up")}
        />
      </div>
    </div>
  );
}




