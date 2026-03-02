import Navbar from '@/components/Navbar';

export default function PublicProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a24 100%)' }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
