"use client";
import { createClient } from "@/lib/supabase/client";
import AuthForm from "@/components/auth-form/auth-form";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";



export default function Login() {
  const router = useRouter();

  //student login/signup
  async function studentLoginWithEmail(formData: Record<string, string>): Promise<void> {
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
        shouldCreateUser: false,
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
          title="Login"
          buttonText="Login"
          fields={[
            {
              label: "Email",
              Icon: Mail,
              type: "email",
              customPlaceHolder: "Enter your email",
            },
            {
              label: "Password",
              Icon: Lock,
              type: "password",
              customPlaceHolder: "Enter your password",
            },
          ]}
          onSubmit={studentLoginWithEmail}
          forgotPasswordText="Forgot password?"
          onForgotPasswordClick={() => router.push("/forgot-password")}
          bottomText="Don't have an account?"
          bottomButtonText="Sign Up"
          onBottomButtonClick={() => router.push("/signup")}
        />
      </div>
    </div>
  );
}




