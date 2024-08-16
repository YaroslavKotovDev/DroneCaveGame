// pages/_app.tsx
import type { AppProps } from 'next/app';
import {useRouter} from "next/router";
import {useEffect} from "react";

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        router.push('/menu');
    }, [router]);

    return <Component {...pageProps} />;
}

export default MyApp;
