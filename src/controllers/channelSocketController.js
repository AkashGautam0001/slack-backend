import { JOIN_CHANNEL } from '../utils/common/eventConstants.js';

export default function messageHandlers(io, socket) {
  socket.on(JOIN_CHANNEL, async function joinChannelHandler(data, cb) {
    console.log('Join Channel', data);
    const roomId = data.channelId;
    socket.join(roomId);
    console.log(`User ${socket.id} joined the channel ${roomId}`);
    cb({
      success: true,
      message: 'Joined channel successfully',
      data: {}
    });
  });
}
