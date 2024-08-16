export type coordinate2D = {
    x : number;
    y : number;
} ;


export type userID = {id:number | null};
export type userScore = {name:string, score:number,};
export type token = string;

export interface GameState {
    name: string;
    complexity: string;
    userID: userID;
    token: string;
    loading: boolean;

    setName: (newName: string) => void;
    setComplexity: (newComplexity: string) => void;
    setUserID: (newUserID: userID) => void;
    setToken: (newToken: string) => void;
    setLoading: (newLoading: boolean) => void;
    resetGameState: () => void;
}

export interface CaveState {
    name: string;
    complexity: number;
    caveHeight: number;
    segmentsCounter: number;
    caveLoaded: boolean;
    cave: number[][];

    setName: (newName: string) => void;
    setComplexity: (newComplexity: number) => void;
    addSegmentsCounter: () => void;
    setCaveLoaded: () => void;
    addCaveSegment: (WSMsg: string) => void;
    resetCaveState: () => void;
}