"use client";
import AuthForm from "@/components/auth-form/auth-form";
import Navbar from "@/components/navbar/navbar";
import { useRouter } from 'next/navigation';
import { Mail, Lock } from "lucide-react";

export default function Login() {
    const router = useRouter();

    async function handleLogin(formData: Record<string, string>): Promise<void> {
    console.log(formData);
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
                onSubmit={handleLogin}
                forgotPasswordText="Forgot password?"
                onForgotPasswordClick={() => router.push('/forgot-password')}
                bottomText="Don't have an account?"
                bottomButtonText="Sign Up"
                onBottomButtonClick={() => router.push('/signup')}
            />
        </div>
    </div>
  )
}
