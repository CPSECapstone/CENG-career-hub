//student login/signup

//note, instead of having client directly, this allows us to mock instead

export type MagicLinkAuth = {
  signInWithOtp: (credentials: {
    email: string;
    options: {
      shouldCreateUser: boolean;
      emailRedirectTo: string;
    };
  }) => Promise<{
    error: { message: string } | null;
  }>;
};  

//pass in supabase client, form data, and handles if sign up or login with createUser boolean
export async function studentMagicLink(
    auth : MagicLinkAuth,
    email: string,
    createUser: boolean,
): Promise<void> {
    //check basic error email login 
    if (!email || email.trim() === "" || !email.includes("@")) {
      throw new Error("Email is required");
    }
    //Check if email isn't recruiter email
    if(!email.endsWith("@calpoly.edu")) {
      throw new Error("Please use your university email address");
    }
    
    const {error} = await auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: createUser,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    })
    if (error) {
      throw new Error(error.message);
    }
  }