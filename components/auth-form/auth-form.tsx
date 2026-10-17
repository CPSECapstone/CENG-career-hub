/* Reusable component for Login & Signup forms */
"use client";
import { useState } from "react";
import { UserIcon } from 'lucide-react';

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
  onSubmit: (formData: Record<string, string>) => Promise<void>;

  forgotPasswordText?: string;
  onForgotPasswordClick?: () => void;

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
  forgotPasswordText,
  onForgotPasswordClick,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(label: string, value: string) {
    const key = label.toLowerCase();

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onSubmit(formData);
      setSuccess(`${title} successful.`);
      setFormData({});
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
        className="rounded-2xl bg-beige px-12 pt-10 pb-10"
      >
        {/* Form title */}
        <div className="mb-6 flex justify-center">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        {/* Input Fields */}
        <div className="flex flex-col gap-8">
          {fields.map((field) => {
            const key = field.label.toLowerCase();
            const Icon = field.Icon;
            return (
              <div
                key={key}
                className="w-full mx-auto flex flex-col gap-4"
              >
                <label htmlFor={key} className="text-xl font-semibold">
                  {" "}
                  {field.label}{" "}
                </label>
                <div className="flex items-center gap-3 border-b-2 border-gray-700 pb-2">
                  <Icon className="h-6 w-6 mr-1 text-poly-green" /> 
                  <input
                    id={key}
                    name={key}
                    type={field.type ?? "text"}
                    placeholder={field.customPlaceHolder}
                    value={formData[key] ?? ""}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    required
                    className="w-full bg-transparent outline-none focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Error & Success Messages */}
        {error && <p className="mt-6 text-center text-red-600">{error}</p>}
        {success && (
          <p className="mt-6 text-center text-green">{success}</p>
        )}
        {/* Optional forgot password button */}
        {forgotPasswordText && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-sm font-semibold text-dark-gray hover:underline hover:cursor-pointer"
            >
              {forgotPasswordText}
            </button>
          </div>
        )}
        {/* Submit button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? "Loading..." : buttonText}
          </button>
        </div>
        {/* Optional button signup/login switch */}
        {bottomText && bottomButtonText && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <p>{bottomText}</p>
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