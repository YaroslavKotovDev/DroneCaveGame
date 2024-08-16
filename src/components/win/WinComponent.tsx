import {useRouter} from "next/router";

export default function WinComponent() {
    const router = useRouter();

    function toMenu() {
        router.push('/menu');
    }

    return (
        <div>
            <h1>CONGRATULATIONS!</h1>
            <h3>You`ve done it! </h3>
            <p>Was it difficult? Not really?<br/>
                You must be an experienced cave explorer!</p>
            <p>How about to try more difficult cave?</p>

            <button onClick={toMenu}>
                return to menu
            </button>
        </div>
    );
}