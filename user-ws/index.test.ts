import { resolve } from "bun";
import {test,describe} from "bun:test";
import { ModuleResolutionKind } from "typescript";
const BACKEND_URL = "ws://localhost:8080";
describe("Chat application", () =>{
    test("Message sent from room 1 reaches room another participants in room 1" ,async() =>{

        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        await new Promise<void>((resolve,reject)=>{
            let count = 0;
            ws1.onopen = () =>{
                count++;
                if(count == 2){
                    resolve();
                }
            }
            ws2.onopen = () =>{
                count++;
                if(count == 2){
                    resolve();
                }
            }
        })
        ws1.send(JSON.stringify({type: "join-room", room: "room1"}));
        ws2.send(JSON.stringify({type: "join-room", room : "room1"}));
        
    })
})