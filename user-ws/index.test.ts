import { resolve } from "bun";
import {test,describe, expect} from "bun:test";

const BACKEND_URL1 = "ws://localhost:8080";
const BACKEND_URL2 = "ws://localhost:8081";

describe("Chat application", () =>{
    test("Message sent from room 1 reaches room another participants in room 1" ,async() =>{

        const ws1 = new WebSocket(BACKEND_URL1);
        const ws2 = new WebSocket(BACKEND_URL2);

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
        console.log("Both sockets are open");
        ws1.send(JSON.stringify({type: "join-room", room: "room1"}));
        ws2.send(JSON.stringify({type: "join-room", room : "room1"}));
        await new Promise<void>((resolve,reject) =>{

            ws2.onmessage = (event) =>{
                const parseData = JSON.parse(event.data);
                expect(parseData.type == "chat")
                expect(parseData.room == "Hello from ws1")
                resolve();
            }
        })
        ws1.send(JSON.stringify({
            type : "chat",
            room : "room1",
            message : "Hello from ws1"
        }))
    })
})