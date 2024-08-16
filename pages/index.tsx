import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/menu');
    }, [router]);

    return null;  // Или можно добавить какой-то контент, если нужно
}
