import mongoose from "mongoose";

const roomPersonSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  DateOfJoining: {
    type: Date,
    required: true
  },
  Photo: { type: String },
  RoomNumber: { type: Number },
  ClientId: { type: String, required: true },
  AmountPerMonth: { type: Number, required: true },
  Paid: { type: Boolean, required: true }
});

export const roomPerson = mongoose.model("RoomPersons", roomPersonSchema);
