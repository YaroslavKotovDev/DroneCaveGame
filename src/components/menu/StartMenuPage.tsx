import {useState} from 'react';
import StartMenuComponent from './StartMenuComponent';
import { Button, Dialog, DialogActions, DialogContent, Tooltip } from '@mui/material';

function StartPage() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Tooltip title="Press it to start the game">
                <Button variant="contained" color="primary" fullWidth onClick={handleOpen}>
                    Start new game
                </Button>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <StartMenuComponent />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StartPage;
