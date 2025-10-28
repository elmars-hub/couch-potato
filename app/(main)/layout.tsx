import Navbar from "@/components/navbar/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="mt-10 py-8 text-center text-white/50 text-sm border-t border-white/10 bg-[#0f0f0f]">
        <div className="max-w-[1800px] mx-auto px-4">
          © {new Date().getFullYear()} Couch Potato
        </div>
      </footer>
    </div>
  );
}
