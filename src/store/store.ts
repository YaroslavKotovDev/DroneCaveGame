import {create} from "zustand";
import {caveSectionHeight} from "@/config/config";
import {CaveState, GameState, userID} from "@/types/types";

// Типизация GameState
export const useGameState = create<GameState>()((set) => ({
    name: "",
    complexity: "",
    userID: {id: 0},
    token: "",
    loading: false,

    setName: (newName: string) => set(() => ({name: newName})),
    setComplexity: (newComplexity: string) => set(() => ({complexity: newComplexity})),
    setUserID: (newUserID: userID) => set(() => ({userID: newUserID})),
    setToken: (newToken: string) => set(() => ({token: newToken})),
    setLoading: (newLoading: boolean) => set(() => ({loading: newLoading})),

    resetGameState: () => set(() => ({
        name: "",
        complexity: "",
        userID: {id: 0},
        token: "",
        loading: false,
    })),
}));

// Типизация CaveState
export const useCave = create<CaveState>()((set, get) => ({
    name: "",
    complexity: 0,
    caveHeight: caveSectionHeight,
    segmentsCounter: 0,
    caveLoaded: false,
    cave: [],

    setName: (newName: string) => set(() => ({name: newName})),
    setComplexity: (newComplexity: number) => set(() => ({complexity: newComplexity})),
    addSegmentsCounter: () => set((state) => ({segmentsCounter: state.segmentsCounter + 1})),
    setCaveLoaded: () => set(() => ({caveLoaded: true})),

    addCaveSegment: (WSMsg: string) => {
        const {cave} = get();
        let newSegment: number[] = WSMsg.split(",").map(Number);
        set({cave: [...cave, newSegment]});
    },

    resetCaveState: () => set(() => ({
        name: "",
        complexity: 0,
        caveHeight: caveSectionHeight,
        segmentsCounter: 0,
        caveLoaded: false,
        cave: [],
    })),
}));
