import mongoose from "mongoose";
import { hostelRoom, roomPerson } from "../models/index.js";

export const createHostelRoomHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;
    console.log(ClientId);
    const { RoomNumber, SharingType } = req.body;
    console.log(RoomNumber, SharingType);
    // const Room = {RoomNumber,SharingType,ClientId};
    const existingRoomNumber = await hostelRoom.findOne({ RoomNumber, ClientId });
    if (existingRoomNumber) {
      return res.status(409).json({
        message: "This room number is already exist",
      });
    }
    const createRoom = await hostelRoom.create({ RoomNumber, SharingType, ClientId });
    console.log(createRoom);
    return res.status(201).json({
      message: "Room Created Sucessfully",
      data: createRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again",
    });
  }
};

export const listHostelRoomsHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;
    const hostelRooms = await hostelRoom.find({ ClientId });
    return res.status(200).json({
      message: "all hostel rooms get sucessfully",
      data: hostelRooms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again",
    });
  }
};

export const hostelRoomGetByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClientId } = req.locals;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid hostel room ID",
      });
    }
    const hostelRoomById = await hostelRoom.find({ ClientId, id });
    if (!hostelRoomById) {
      return res.status(404).json({
        message: "hostel room not found",
      });
    }
    return res.status(200).json({
      message: "hostel room get by id sucessfully",
      data: hostelRoomById,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again",
    });
  }
};

export const hostelRoomUpdateByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {ClientId} = req.locals;
    const { RoomNumber, SharingType } = req.body;
    // console.log(RoomNumber,SharingType);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid hostel room ID",
      });
    }
    // Check if the hostel room exists
    const findId = await hostelRoom.findOne({ ClientId, _id: id });
    if (!findId) {
      return res.status(404).json({
        message: "This hostel room is not found",
      });
    }
    // Update the hostel room
    const updateRoom = await hostelRoom.findOneAndUpdate(
      { ClientId, _id: id },
      { RoomNumber, SharingType },
      { new: true }  // Use { new: true } instead of { "returnDocument": "after" }
    );

    return res.status(200).json({
      message: "Room details updated successfully",
      data: updateRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again"
    })
  }
};

export const hostelRoomDeleteByIdHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;
    const { id } = req.params;
    
    // Validate hostel room ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid hostel room ID",
      });
    }

    // Check if the hostel room exists
    const findId = await hostelRoom.findOne({ ClientId, _id: id });
    if (!findId) {
      return res.status(404).json({
        message: "This hostel room is not found"
      });
    }
   

    // Delete the hostel room
    await hostelRoom.findOneAndDelete({ ClientId, _id: id });

    // Delete persons associated with the room using RoomNumber
    await roomPerson.deleteMany({ ClientId, RoomNumber: findId.RoomNumber });

    return res.status(200).json({
      message: "Hostel room and associated persons deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong, please try again"
    });
  }
};

