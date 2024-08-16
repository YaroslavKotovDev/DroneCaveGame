import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './layout';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        console.log(router.pathname);
        if (router.pathname === '/_error' || router.pathname === '/') {
            router.replace('/menu');
        }
    }, [router]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
