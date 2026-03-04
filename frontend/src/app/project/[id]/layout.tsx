import Navbar from '@/components/Navbar';

export default function PublicProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-bg">
      <Navbar />
      <main className="container-narrow" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
