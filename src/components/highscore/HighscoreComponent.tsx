import { restoreFromStorage } from '@/utils/utils';
import UserList from './UserList';
import { Typography, Box } from '@mui/material';

function HighscoreComponent() {
    const props = { list: restoreFromStorage() };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" color="secondary" gutterBottom>
                SCOREBOARD
            </Typography>
            <UserList {...props} />
        </Box>
    );
}

export default HighscoreComponent;
