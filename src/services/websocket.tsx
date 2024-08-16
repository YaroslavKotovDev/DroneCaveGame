import {WS_API_URL} from '@/config/config.tsx';
import {userID} from '@/types/types.tsx';


export function initWebSocket(userID: string | userID | ((newName: string) => void) | ((newComplexity: string) => void) | ((newUserID: userID) => void) | ((newToken: string) => void) | (() => void), gameToken: string | userID | ((newName: string) => void) | ((newComplexity: string) => void) | ((newUserID: userID) => void) | ((newToken: string) => void) | (() => void)) {
    const ws = new WebSocket(WS_API_URL);

    ws.onopen = () => {
        if (typeof userID === 'object' && 'id' in userID) {
            console.log('Connected. player:' + userID.id + "-" + gameToken);
            ws.send('player:' + userID.id + "-" + gameToken);
        } else {
            console.error("Invalid userID");
        }
    }

    ws.onerror = () => {
        console.log("Connection error");
    };


    return ws
};
