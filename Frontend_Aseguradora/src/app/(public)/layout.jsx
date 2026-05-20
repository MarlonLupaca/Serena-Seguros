import Header from '../Landing/Header';
import Footer from '../Landing/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen font-sans text-text bg-white antialiased">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
