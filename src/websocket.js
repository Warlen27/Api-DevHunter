const socketio = require('socket.io');

const parseStringArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');
let io;
const connections = [];

module.exports = {
   

    setupWebSocket(server) {
         io = socketio(server);

        io.on('connection', socket => {
           const { latitude, longitude, techs } = socket.handshake.query;
           
           connections.push({
               id: socket.id,
               coordinates: {
                   latitude: Number(latitude),
                   longitude: Number(longitude),
               },
               techs: parseStringArray(techs),
           });
           

        });
    },

    findConnections(coordinates, techs) {
        return connections.filter(connection => {
            return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
          })
    },

    sendMessage(to, message, data){
        to.forEach(connection => {
          io.to(connection.id).emit(message, data);
        })
      }
}

