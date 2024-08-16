import GameComponent from '../src/components/main/GameComponent.tsx';
import { Container, Typography } from '@mui/material';

function GamePage() {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h2" color="primary" gutterBottom>
                Cave Drone
            </Typography>
            <GameComponent />
        </Container>
    );
}

export default GamePage;
