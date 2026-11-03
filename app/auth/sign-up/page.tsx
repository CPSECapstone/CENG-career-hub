"use client";
import AuthForm from "@/components/auth-form/auth-form";
import Navbar from "@/components/navbar/navbar";
import { studentMagicLink } from "@/app/auth/login-sign-up-logic/magic-link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock } from "lucide-react";



export default function Signup() {
  
  async function handleSignUp(formData: Record<string, string>): Promise<void> {
    const supabase = createClient();
    await studentMagicLink(supabase.auth, formData, true);
  }


  return (
    <div className="cover-photo">
      <div>
        <Navbar />
        <AuthForm
          title="Sign Up"
          buttonText="Sign Up"
          fields={[
            {
              label: "Email",
              Icon: Mail,
              type: "email",
              customPlaceHolder: "Enter your email",
            },
            {
              label: "Create Password",
              Icon: Lock,
              type: "password",
              customPlaceHolder: "Create a password",
            },
            {
              label: "Confirm Password",
              Icon: Lock,
              type: "password",
              customPlaceHolder: "Confirm password",
            },
          ]}
          onSubmit={handleSignUp}
        />
      </div>
    </div>
  );
}

