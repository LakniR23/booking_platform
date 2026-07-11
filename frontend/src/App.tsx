import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Services from './pages/Services.tsx';
import Bookings from './pages/Bookings.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-[100dvh] flex flex-col relative overflow-hidden ">
        {/* Subtle background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--app-glow-1)] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--app-glow-2)] blur-[120px] rounded-full pointer-events-none" />

        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-fg)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              style: { background: 'var(--toast-success-bg)', color: 'var(--toast-success-fg)', border: '1px solid rgba(4,120,87,0.45)' },
              iconTheme: { primary: 'var(--toast-success-fg)', secondary: 'var(--toast-success-bg)' },
            },
            error: {
              style: { background: 'var(--toast-error-bg)', color: 'var(--toast-error-fg)', border: '1px solid rgba(190,18,60,0.45)' },
              iconTheme: { primary: 'var(--toast-error-fg)', secondary: 'var(--toast-error-bg)' },
            },
          }}
        />
        <main className="flex-1 flex flex-col z-10 pt-20 pb-10 md:pt-16 md:pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
