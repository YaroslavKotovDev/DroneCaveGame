import { useEffect } from 'react';
import StartMenuPage from '@/components/menu/StartMenuPage.tsx';
import HighscoreComponent from '@/components/highscore/HighscoreComponent.tsx';
import { useGameState } from '@/store/store.ts';
import { Container, Typography, Box } from '@mui/material';

function Menu() {
    const resetGameState = useGameState(state => state.resetGameState);

    useEffect(() => {
        resetGameState();
    }, []);

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h2" color="primary" gutterBottom>
                CAVE DRONE
            </Typography>
            <Box sx={{ my: 4 }}>
                <StartMenuPage />
            </Box>
            <HighscoreComponent />
        </Container>
    );
}

export default Menu;
