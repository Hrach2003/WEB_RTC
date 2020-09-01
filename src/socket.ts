import socket from 'socket.io'
import http from 'http'
import consola from 'consola';
import { IUser } from './_interfaces';

enum _ {
  START = 'connection',
  JOIN_ROOM = "join-room",
  USER_CONNECTED_TO_CHAT_ROOM = 'user-connected-to-chat-room',
  USER_DISCONNECTED_TO_CHAT_ROOM = 'user-disconnected-to-chat-room',
  USER_SEND_MESSAGE = 'send-message',
  USER_RECEIVE_MESSAGE = 'receive-message',
  USER_CONNECTED_TO_ROOM = 'user-connected',
  USER_DISCONNECTED_TO_ROOM = 'user-disconnected',
  END = 'disconnect',
}

export const initWebSocket = (server: http.Server) => {


  const io = socket(server)

  io.use((socket, next) => {
    let handshakeData = socket.request;
    console.log(handshakeData.headers)
    // make sure the handshake data looks good as before
    // if error do this:
      // next(new Error('not authorized'));
    // else just call next
    next();
  });

  io.on(_.START, socket => {
    // socket.emit('hello') // works
    consola.info({ message: 'a user connected' });
    socket.on( _.JOIN_ROOM , (roomId, userId) => {
      consola.info({ message: `roomId: ${roomId} \n userId: ${userId}`, badge: true });
      socket.join(roomId);
      socket.to(roomId).broadcast.emit( _.USER_CONNECTED_TO_ROOM , userId);
      socket.on(_.END, () => {
        io.to(roomId).emit( _.USER_DISCONNECTED_TO_ROOM , userId);
      });
    });


    socket.on(_.USER_CONNECTED_TO_CHAT_ROOM, (roomId, user: IUser) => {
      consola.info({ message: `a ${user.username} connected to ${roomId}`, badge: true });
      socket.join(roomId) 
      socket.to(roomId).broadcast.emit(_.USER_CONNECTED_TO_CHAT_ROOM, user)
      socket.on(_.USER_SEND_MESSAGE, message => {
        console.log(message)
      //  socket.to(roomId).emit(_.USER_RECEIVE_MESSAGE, message)
      })
    })
  });
}


