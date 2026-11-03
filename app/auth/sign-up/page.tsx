"use client";
import AuthForm from "@/components/auth-form/auth-form";
import Navbar from "@/components/navbar/navbar";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock } from "lucide-react";



export default function Signup() {
  //student login/signup
    async function studentSignUpWithEmail(formData: Record<string, string>): Promise<void> {
      //check basic error email login 
      if (!formData.email || formData.email.trim() === "" || !formData.email.includes("@")) {
        throw new Error("Email is required");
      }
      //Check if email isn't recruiter email
      if(!formData.email.endsWith("@calpoly.edu")) {
        throw new Error("Please use your university email address");
      }
      const supabase = createClient();
      const {error} = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        }
      })
      if (error) {
        throw new Error(error.message);
      }
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
          onSubmit={studentSignUpWithEmail}
        />
      </div>
    </div>
  );
}

