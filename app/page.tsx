import Navbar  from "@/components/navbar/navbar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="cover-photo">
          <Navbar />
          <div className="page-header">
            <h1>Testing Reusable Components</h1>
          </div>
          <button className="btn-primary mt-2 mb-2">Button 1</button>
          <br></br>
          <button className="btn-secondary mt-2 mb-2">Button 2</button>
          <br></br>
          <button className="btn-tertiary mt-2 mb-2">Button 3</button>
          <br></br>
          <button className="btn-quaternary mt-2 mb-2">Button 4</button>
          <br></br>
        </div>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8">
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
        </footer>
      </div>
    </main>
  );
}
