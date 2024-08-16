import React, { ChangeEvent, useEffect, useState } from "react";
import { userID } from "@/types/types";
import { useCave, useGameState } from "@/store/store";
import api from "@/services/api";
import { tokenChunks } from "@/config/config";
import { initWebSocket } from "@/services/websocket";
import { useRouter } from "next/router";
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Typography, Box, Alert } from '@mui/material';

function StartMenu() {
    const resetGameState = useGameState(state => state.resetGameState);
    const setToken = useGameState(state => state.setToken);
    const setUserID = useGameState(state => state.setUserID);
    const setName = useGameState(state => state.setName);
    const resetCaveState = useCave((state) => state.resetCaveState);
    const setCaveName = useCave((state) => state.setName);
    const userID = useGameState((state) => state.userID);
    const setComplexity = useGameState((state) => state.setComplexity);
    const name = useGameState((state) => state.name);
    const setCaveComplexity = useCave((state) => state.setComplexity);
    const setCaveLoaded = useCave((state) => state.setCaveLoaded);
    const addSegmentsCounter = useCave((state) => state.addSegmentsCounter);
    const [
        complexity,
        token,
    ] = useGameState(state => [
        state.complexity,
        state.token,
    ]);
    const [
        addCaveSegment,
    ] = useCave((state) => [
        state.addCaveSegment,
    ]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        resetGameState();
        resetCaveState();

        return () => {
            resetGameState();
        };
    }, []);

    useEffect(() => {
        if (userID?.id != 0) {
            getUserToken(userID);
        }
    }, [userID]);

    useEffect(() => {
        if (token) {
            setCaveName(name);
            setCaveComplexity(Number(complexity));
            let counter = 0;
            initWebSocket(userID, token).onmessage = (msg) => {
                if (msg.data !== 'finished') {
                    addCaveSegment(msg.data);
                    addSegmentsCounter();
                    counter++;
                    if (counter === 80) {
                        console.log('80 segments received');
                        router.push('/game');
                    }
                } else {
                    console.log(counter + ' segments total received');
                    setCaveLoaded();
                }
            };
        }
    }, [token]);

    function isStringEmpty(str: string): boolean {
        return str.trim().length < 1;
    }

    function onUserSubmit(e: React.FormEvent) {
        resetCaveState();
        e.preventDefault();

        if (typeof name !== 'string' || isStringEmpty(name)) {
            setError('Please enter your name.');
            return;
        }

        if (typeof complexity !== 'string' || isStringEmpty(complexity)) {
            setError('Please choose difficulty.');
            return;
        }

        setError('');
        getUserID();
    }

    function getUserID() {
        return api.post('/init', { name, complexity })
            .then((resp) => setUserID(resp.data))
            .catch((error) => console.log(error));
    }

    function getUserToken(userID: userID) {
        const chunkPromises: Promise<string>[] = [];

        for (let i = 0; i < tokenChunks; i++) {
            chunkPromises[i] = api.get('/token/' + (i + 1), { params: userID })
                .then((resp) => {
                    return resp.data.chunk;
                })
                .catch((error) => {
                    console.log(error);
                    return '';
                });
        }

        Promise.all(chunkPromises).then((chunks) => {
            const token = chunks.reduce((accumulator, tokenChunk) => accumulator + tokenChunk, '');
            setToken(token);
        });
    }

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value);
        setError('');
    }

    function onComplexityChange(e: ChangeEvent<HTMLInputElement>) {
        setComplexity(e.target.value);
        setError('');
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Start new game
            </Typography>
            <form onSubmit={onUserSubmit}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    value={name}
                    onChange={onNameChange}
                    label="Your name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">Choose difficulty:</FormLabel>
                    <RadioGroup row aria-label="difficulty" name="difficulty" onChange={onComplexityChange}>
                        {[...Array(10)].map((_, i) => (
                            <FormControlLabel key={i + 1} value={String(i + 1)} control={<Radio />} label={String(i + 1)} />
                        ))}
                    </RadioGroup>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Start game
                </Button>
            </form>
        </Box>
    );
}

export default StartMenu;
