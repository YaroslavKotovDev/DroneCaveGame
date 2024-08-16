import { coordinate2D } from "@/types/types.tsx";

//API
export const API_URL : string = `https://cave-drone-server.shtoa.xyz`;
export const WS_API_URL : string = `wss://cave-drone-server.shtoa.xyz/cave`;
export const tokenChunks : number = 4;

export const canvasX : number = 500;
export const canvasY : number = 500;
export const timeDelay : number = 10;
export const caveSectionHeight : number = 10;
export const droneCoordinates : coordinate2D[] = [{x:-10, y:0},{x:0, y:17},{x:10, y:0},];


//styles
export const boardColor : string  = "#222222";
export const droneColor : string  = "#FF5733";
export const caveColor : string  = "#333333";
export const caveGradient : string  = "linear-gradient(to bottom, #333333, #777777)";


//store
export const STORAGE_KEY : string  = "CaveDroneData";
export const testScoreList = [
    {name: "I",
        score: 999,},
    {name: "wanna",
        score: 900,},
    {name: "be",
        score: 800,},
    {name: "your",
        score: 700,},
    {name: "slave",
        score: 600,},
    {name: "I",
        score: 500,},
    {name: "wanna",
        score: 400,},
    {name: "be",
        score: 300,},
    {name: "your",
        score: 200,},
    {name: "master",
        score: 100,},
];

