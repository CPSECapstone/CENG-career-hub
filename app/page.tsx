import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
//import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold"></div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div>
          <h2>Testing Reusable Components</h2>
          <button className="btn-primary mt-2 mb-2">Button 1</button>
          <br></br>
          <button className="btn-secondary mt-2 mb-2">Button 2</button>
          <br></br>
          <button className="btn-tertiary mt-2 mb-2">Button 3</button>
          <br></br>
          <button className="btn-quaternary mt-2 mb-2">Button 4</button>
          <br></br>
          <div className="white-card mt-2 mb-2">
            <p>Testing card 1. The size of the card will grow based on its contents.</p>
            <p>We can use the row/column formatting provided by Tailwind using this basic card definition.</p>
          </div>
          <div className="beige-card mt-2 mb-2">
            <p>Testing card 2. The size of the card will grow based on its contents.</p>
            <p>We can use the row/column formatting provided by Tailwind using this basic card definition.</p>
          </div>
          <div className="sage-card mt-2 mb-2">
            <p>Testing card 3. The size of the card will grow based on its contents.</p>
            <p>We can use the row/column formatting provided by Tailwind using this basic card definition.</p>
          </div>
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
