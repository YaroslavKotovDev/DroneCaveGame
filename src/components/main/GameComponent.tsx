import React, { useEffect, useRef, useState } from "react";
import { useCave } from "@/store/store";
import { useInterval } from "@/hooks/useInterval";
import { boardColor, canvasX, canvasY, caveColor, droneColor, droneCoordinates, timeDelay } from "@/config/config";
import { coordinate2D } from "@/types/types";
import { useRouter } from "next/router";
import { createPath2DString, drawObj, findMaxCoord, findPointsInbetween, sliceYCoord, submitScore } from "@/utils/utils";
import { Container, Box, Typography, Button } from '@mui/material';

function Game() {
    const offsetY = 10;
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCTX] = useState<CanvasRenderingContext2D | null>(null);
    const [direction, setDirection] = useState<coordinate2D>({ x: 0, y: 1 });
    const [delay, setDelay] = useState<number>(timeDelay);
    const [isKeyPressed, setIsKeyPressed] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [drone, setDrone] = useState(droneCoordinates);
    const [canvasOffset, setCanvasOffset] = useState(0);
    const [caveToDraw, setCaveToDraw] = useState<coordinate2D[]>([]);
    const [leftWall, setLeftWall] = useState<coordinate2D[]>([]);
    const [rightWall, setRightWall] = useState<coordinate2D[]>([]);
    const cave: number[][] = useCave((state) => state.cave);
    const name = useCave((state) => state.name);
    const complexity = useCave((state) => state.complexity);
    const caveHeight = useCave((state) => state.caveHeight);

    const maxWallYCollision = findMaxCoord(drone, 'y') + caveHeight;

    useInterval(() => runGame(), delay);

    useEffect(() => {
        resetState();
        setWalls();
        setInitialDronePosition();
        if (canvasRef.current) {
            canvasRef.current?.focus();
        }
    }, []);

    useEffect(() => {
        setWalls();
    }, [cave]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) {
                setCTX(ctx);
                drawCanvas(ctx);
            }
        }
    }, [drone, caveToDraw]);

    function resetState() {
        setDirection({ x: 0, y: 1 });
        setDelay(timeDelay);
        setCaveToDraw([]);
        setLeftWall([]);
        setRightWall([]);
        setGameOver(false);
        setCanvasOffset(0);
    }

    function setWalls() {
        const leftWallDraft = [];
        const rightWallDraft = [];
        let y: string | number | number[][] = 0;
        for (let i = 0; typeof cave !== "number" && i < cave?.length; i++) {
            leftWallDraft.push({ x: centerXToCanvasX(cave[i][0]), y });
            rightWallDraft.push({ x: centerXToCanvasX(cave[i][1]), y });
            y += caveHeight;
        }
        setLeftWall(leftWallDraft);
        setRightWall(rightWallDraft);
        if (canvasOffset === 0) {
            newCaveDraw(leftWallDraft, rightWallDraft, canvasOffset);
        }
    }

    function setInitialDronePosition() {
        setDrone(droneCoordinates.map(point => ({
            x: point.x + centerXToCanvasX((cave[0][0] + cave[0][1]) / 2),
            y: point.y + offsetY
        })));
    }

    function centerXToCanvasX(x: number) {
        const centerX = Math.floor(canvasX / 2);
        return centerX + x;
    }

    function checkCollision() {
        if (caveToDraw.length > 1) {
            const leftTestPath = createCollisionPath(leftWall);
            const rightTestPath = createCollisionPath(rightWall);
            return testPassForCollisions(leftTestPath) || testPassForCollisions(rightTestPath);
        }
    }

    function createCollisionPath(wall: coordinate2D[]) {
        return new Path2D(createPath2DString(sliceYCoord(wall, canvasOffset - caveHeight, canvasOffset + maxWallYCollision).map(el => ({
            x: el.x,
            y: el.y - canvasOffset
        }))));
    }

    function testPassForCollisions(testPath: Path2D) {
        if (ctx && drone) {
            ctx.strokeStyle = caveColor;
            ctx.stroke(testPath);
            if (ctx.isPointInPath(testPath, drone[Math.floor(drone.length / 2)].x, drone[Math.floor(drone.length / 2)].y)) {
                console.log('Nose impact');
                return true;
            }
            if (ctx.isPointInPath(testPath, drone[0].x, drone[0].y) || ctx.isPointInPath(testPath, drone[drone.length - 1].x, drone[drone.length - 1].y)) {
                console.log('Back impact');
                return true;
            }
            const droneSides = getDroneSides();
            for (const point of droneSides) {
                if (ctx.isPointInPath(testPath, point.x, point.y)) {
                    console.log('Side impact');
                    return true;
                }
            }
        }
    }

    function getDroneSides() {
        const droneSides: coordinate2D[] = [];
        for (let i = 1; i < drone.length; i++) {
            droneSides.push(...findPointsInbetween(drone[i - 1], drone[i]));
        }
        return droneSides;
    }

    function checkCaveEnd() {
        return caveToDraw[caveToDraw.length / 2 - 1].y < 0;
    }

    function newCaveDraw(left: coordinate2D[], right: coordinate2D[], shift: number) {
        const leftdraft = sliceYCoord(left, canvasOffset - caveHeight, canvasOffset + canvasY + caveHeight).map(el => ({
            x: el.x,
            y: el.y - canvasOffset
        }));
        const rightdraft = sliceYCoord(right, canvasOffset - caveHeight, canvasOffset + canvasY + caveHeight).map(el => ({
            x: el.x,
            y: el.y - canvasOffset
        }));
        setCanvasOffset(canvasOffset + shift);
        setCaveToDraw([...leftdraft, ...rightdraft.reverse()]);
    }

    function moveDrone() {
        setDrone(drone.map(element => ({
            x: element.x + direction.x,
            y: element.y
        })));
    }

    function runGame() {
        setIsKeyPressed(false);
        setScore(Math.ceil(canvasOffset / caveHeight) * complexity);
        if (checkCollision()) {
            endGame();
        } else if (checkCaveEnd()) {
            navigateToWin();
        } else {
            newCaveDraw(leftWall, rightWall, direction.y);
            moveDrone();
        }
    }

    function endGame() {
        setDirection({ x: 0, y: 0 });
        setDelay(99999);
        console.log('Game over');
        submitScore(name, score);
        setGameOver(true);
    }

    function navigateToWin() {
        submitScore(name, score);
        router.push('/win');
    }

    // Исправление: используем тип события для HTMLCanvasElement
    function changeDirection(e: React.KeyboardEvent<HTMLCanvasElement>) {
        if (!isKeyPressed) {
            switch (e.key) {
                case "ArrowLeft":
                    setDirection({ x: direction.x - 7, y: 1 });
                    break;
                case "ArrowRight":
                    setDirection({ x: direction.x + 7, y: 1 });
                    break;
                case "ArrowDown":
                    setDirection({ x: direction.x, y: 5 });
                    break;
            }
            setIsKeyPressed(true);
        }
    }

    function drawCanvas(ctx: CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = boardColor;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        drawObj(ctx, caveToDraw, caveColor);
        setDirection({ x: 0, y: 1 });
        drawObj(ctx, drone, droneColor);
    }

    function toMenu() {
        router.push('/menu');
    }

    return (
        <Container maxWidth="md" sx={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Score: {name} - {score}</Typography>
                {gameOver && (
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 2, borderRadius: 2 }}>
                        <Typography variant="h4" color="error">Game Over</Typography>
                        <Typography variant="h6">Your score: {score}</Typography>
                        <Button variant="contained" color="primary" onClick={toMenu} sx={{ mt: 2 }}>
                            Return to Menu
                        </Button>
                    </Box>
                )}
                <canvas
                    ref={canvasRef}
                    width={canvasX}
                    height={canvasY}
                    style={{ border: '4px solid #4CAF50', backgroundColor: '#000' }}
                    onKeyDown={changeDirection}
                    tabIndex={0}
                />
                <Button variant="contained" color="primary" onClick={toMenu} sx={{ mt: 2 }}>
                    Return to Menu
                </Button>
            </Box>
        </Container>
    );
}

export default Game;
