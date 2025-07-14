import  { WebSocketServer,WebSocket as WebSocketWsType} from "ws";

const wss = new WebSocketServer({port: 8081});
 interface Room {
    sockets : WebSocketWsType[];
 }
const rooms : Record<string,Room> = {};

const RELAYER_URL = "ws://localhost:3001";
const relayerSocket =  new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({data}) =>{
 const parseData = JSON.parse(data);
      
       if(parseData.type == "chat"){
        const room = parseData.room;
        rooms[room]?.sockets.map(socket => socket.send(data));
       }
}

wss.on("connection",function connection(ws) {
    console.log("New client connected");
    ws.on("message",function message(data:string) {
        const parseData = JSON.parse(data);
         if(parseData.type == "join-room"){
        const room = parseData.room;
        if(!rooms[room]){
            rooms[room] = {
                sockets: []
            }
        }
        rooms[room].sockets.push(ws);
        ws.send(JSON.stringify({type:  "joined-room"}))
       }
       if(parseData.type == "chat"){

           relayerSocket.send(data);
       }
    })

})