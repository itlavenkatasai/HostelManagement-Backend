import mongoose from "mongoose";

const hostelRoomSchema = new mongoose.Schema({
  RoomNumber: { type: Number, required: true },
  SharingType: { type: Number, required: true },
  ClientId: {type:String, required: true}
});

export const hostelRoom = mongoose.model("HostelRooms", hostelRoomSchema);
