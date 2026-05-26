import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';
import BottomNav from '../components/ui/BottomNav';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noBottomNavPaths = ['/', '/auth/login', '/auth/signup', '/auth/join-couple', '/auth/forgot-password'];
  const showBottomNav = !noBottomNavPaths.includes(router.pathname);

  return (
    <AuthProvider>
      <Head>
        <title>CoupleLife OS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="bg-gray-100 min-h-screen flex justify-center">
        <div className="w-full max-w-md bg-background min-h-screen shadow-2xl relative overflow-x-hidden border-x border-gray-200 pb-24">
          <Component {...pageProps} />
          {showBottomNav && <BottomNav />}
        </div>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
