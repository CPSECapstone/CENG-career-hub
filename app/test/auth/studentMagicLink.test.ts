import {
  studentMagicLink,
  type MagicLinkAuth,
} from "@/app/auth/login-sign-up-logic/magic-link";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("studentMagicLink", () => {
  const redirectTo = "http://localhost:3000/auth/confirm";
  let mockAuth: MagicLinkAuth;

  // This mocks a 'sucesful' connection to supabase
  beforeEach(() => {
    mockAuth = {
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
    };
  });

  it("requests a magic link for a Cal Poly student email", async () => {

    await studentMagicLink(
      mockAuth,
      "aharr113@calpoly.edu",
      true,
    );

    expect(mockAuth.signInWithOtp).toHaveBeenCalledWith({
      email: "aharr113@calpoly.edu",
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });
  });

  it("rejects a non-Cal Poly email before calling Supabase", async () => {
    await expect(
      studentMagicLink(mockAuth, "person@gmail.com", true),
    ).rejects.toThrow("Please use your university email address");

    expect(mockAuth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("rejects an empty email before calling Supabase", async () => {
    await expect(
      studentMagicLink(mockAuth, "", true),
    ).rejects.toThrow("Email is required");

    expect(mockAuth.signInWithOtp).not.toHaveBeenCalled();
  });

});

