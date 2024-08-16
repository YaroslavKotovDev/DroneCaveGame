import {useNavigate} from "react-router-dom";

function Win() {
    const navigate = useNavigate();

    function toMenu() {
        navigate('/menu');
    }

    return (
        <div>
            <h1>CONGRATULATIONS!</h1>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <h3>You've done it! </h3>
            <p>Was it difficult? Not really?<br/>
                You must be an experienced cave explorer!</p>
            <p>How about to try more difficult cave?</p>

            <button onClick={toMenu}>
                return to menu
            </button>
        </div>
    )
}

export default Win