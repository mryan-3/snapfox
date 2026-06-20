import { WebSocketServer, WebSocket } from "ws";

interface ExtWebSocket extends WebSocket {
  peerId?: string;
  roomId?: string;
}

const port = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port });

const rooms = new Map<string, Set<ExtWebSocket>>();

wss.on("connection", (ws: ExtWebSocket) => {
  let currentRoomId: string | null = null;
  let clientId: string | null = null;

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "join") {
        const { roomId, peerId } = data;
        currentRoomId = roomId;
        clientId = peerId;

        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }

        const room = rooms.get(roomId)!;

        if (room.size >= 2) {
          ws.send(JSON.stringify({ type: "error", message: "Room is full" }));
          ws.close();
          return;
        }

        ws.peerId = peerId;
        ws.roomId = roomId;
        room.add(ws);

        // Notify other peer in the room
        for (const client of room) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "peer-joined", peerId }));
            ws.send(JSON.stringify({ type: "peer-joined", peerId: client.peerId }));
          }
        }
        console.log(`Peer ${peerId} joined room ${roomId}`);
      } else if (data.type === "signal") {
        if (!currentRoomId) return;
        const room = rooms.get(currentRoomId);
        if (!room) return;

        // Relay signaling data to the other peer
        for (const client of room) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: "signal",
              senderId: clientId,
              signal: data.signal
            }));
          }
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId)!;
      room.delete(ws);

      console.log(`Peer ${clientId} left room ${currentRoomId}`);

      // Notify the remaining peer
      for (const client of room) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "peer-left", peerId: clientId }));
        }
      }

      if (room.size === 0) {
        rooms.delete(currentRoomId);
        console.log(`Room ${currentRoomId} deleted`);
      }
    }
  });
});

console.log(`Signaling server running on port ${port}`);
