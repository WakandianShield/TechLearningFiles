import Navbar from '@/components/Navbar';

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-bg">
      <Navbar />
      <main className="container-app" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
