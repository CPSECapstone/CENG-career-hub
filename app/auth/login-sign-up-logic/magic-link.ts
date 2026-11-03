//student login/signup

//note, instead of having client directly, this allows us to mock instead

type MagicLinkAuth = {
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
    formData: Record<string, string>,
    createUser: boolean,
): Promise<void> {
    //check basic error email login 
    if (!formData.email || formData.email.trim() === "" || !formData.email.includes("@")) {
      throw new Error("Email is required");
    }
    //Check if email isn't recruiter email
    if(!formData.email.endsWith("@calpoly.edu")) {
      throw new Error("Please use your university email address");
    }
    
    const {error} = await auth.signInWithOtp({
      email: formData.email,
      options: {
        shouldCreateUser: createUser,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    })
    if (error) {
      throw new Error(error.message);
    }
  }