/* Reusable component for Login & Signup forms */
"use client";
import { useState } from "react";
import { UserIcon } from "lucide-react";

interface AuthField {
  label: string;
  customPlaceHolder?: string;
  Icon: typeof UserIcon;
  type?: string;
}

interface AuthFormProps {
  title: string;
  buttonText: string;
  fields: AuthField[];
  onSubmit: (email: string) => Promise<void>;
  bottomText?: string;
  bottomButtonText?: string;
  onBottomButtonClick?: () => void;
}

export default function AuthForm({
  title,
  buttonText,
  fields,
  onSubmit,
  bottomText,
  bottomButtonText,
  onBottomButtonClick,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(value: string) {
    setEmail(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onSubmit(email);
      setSuccess(`Check your email to fully ${title}`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : `${title} failed.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-beige px-20 pt-10 pb-10"
      >
        {/* Form title */}
        <div className="mb-6 flex justify-center">
          <h1 className="text-4xl text-black font-bold">{title}</h1>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-8">
          {fields.map((field) => {
            const key = field.label.toLowerCase();
            const Icon = field.Icon;

            return (
              <div key={key} className="w-full mx-auto flex flex-col gap-4">
                <label htmlFor={key} className="text-xl text-black">
                  {field.label}
                </label>

                <div className="flex items-center gap-5 border-b-2 border-gray-700 pb-2">
                  <Icon className="h-6 w-6 mr-1 text-poly-green" />

                  <input
                    id={key}
                    name={key}
                    type={field.type ?? "text"}
                    placeholder={field.customPlaceHolder}
                    value={email}
                    onChange={(e) => handleChange(e.target.value)}
                    required
                    className="w-2xs bg-transparent outline-none text-black focus:outline-none placeholder:text-gray"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Error & Success Messages */}
        {error && <p className="mt-6 text-center text-red-600">{error}</p>}
        {success && <p className="mt-6 text-center text-green">{success}</p>}

        {/* Submit button */}
        <div className="mt-8 flex justify-center">
          <button type="submit" disabled={loading} className="btn-secondary">
            {loading ? "Loading..." : buttonText}
          </button>
        </div>

        {/* Optional button signup/login switch */}
        {bottomText && bottomButtonText && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <p className="text-black">{bottomText}</p>
            <button
              type="button"
              onClick={onBottomButtonClick}
              className="btn-quaternary"
            >
              {bottomButtonText}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}