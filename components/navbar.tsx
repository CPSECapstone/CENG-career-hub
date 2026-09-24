import Link from "next/link";
import { AuthButton } from "./auth-button";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";

export default function Navbar() {
    return (
        <nav className="w-full flex justify-center border-b h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <ul className="flex gap-5 items-center font-semibold">
                    <li>
                        <Link href="/"> Home </Link>
                    </li>
                    <li>
                        <Link href="/jobs"> Jobs </Link>
                    </li>
                    <li>
                        <Link href="/events"> Events </Link>
                    </li>
                    <li>
                        <Link href="/chat"> Chat </Link>
                    </li>
                </ul>
                {!hasEnvVars ? (
                    <EnvVarWarning />
                ) : (
                    <Suspense>
                        <AuthButton />
                    </Suspense>
                )} 
            </div>
        </nav>
    )
}