import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './layout';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname === '/') {
            router.replace('/menu');
        }
    }, [router]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
