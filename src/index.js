import express from 'express';
import dotenv from 'dotenv';
import { dbConnectedWithMongo } from './db/index.js';
import bodyParser from 'body-parser';
import { createHostelRoomHandler, hostelRoomDeleteByIdHandler, hostelRoomGetByIdHandler, hostelRoomUpdateByIdHandler, listHostelRoomsHandler } from './handlers/hostelRoom.js';
import { deleteRoomPersonByRoomNumberAndId, hostelOwnerRegister, listRoomPersonsByRoomNumberHandler, updateRoomPersonByIdHandler } from './handlers/index.js';
import { loginHostelOwner } from './handlers/index.js';
import { checkAndVerify } from './middleware/index.js';
import { createRoomPersonHandler } from './handlers/index.js';
import cors from 'cors';

const app = express();
dotenv.config();

const {PORT} = process.env;

dbConnectedWithMongo();

app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.send('hello i am home');
})

const corsOptions = {
    origin: true, // Change this to the origin you want to allow
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    "Access-Control-Allow-Origin": "*"
  };

  
  // Apply CORS middleware
  app.use(cors(corsOptions));
  
  // Handle preflight requests for all routes
  app.options('*', cors(corsOptions));

app.post("/register",hostelOwnerRegister);
app.post("/login",loginHostelOwner);

app.use(checkAndVerify);

app.post("/hostelRoom",createHostelRoomHandler);
app.get('/hostelRooms',listHostelRoomsHandler);
app.get('/hostelRoom/:id',hostelRoomGetByIdHandler);
app.patch('/hostelRoom/:id',hostelRoomUpdateByIdHandler);
app.delete('/hostelRoom/:id',hostelRoomDeleteByIdHandler);

app.post("/hostelRoomPerson/:roomNumber",createRoomPersonHandler);
app.get("/hostelRoomPersons/:roomNumber",listRoomPersonsByRoomNumberHandler);
app.patch("/hostelRoomPerson/:id",updateRoomPersonByIdHandler);
app.delete("/hostelRoomPerson/:id",deleteRoomPersonByRoomNumberAndId);

app.listen(PORT,()=>{
    console.log('port is running',PORT);
});