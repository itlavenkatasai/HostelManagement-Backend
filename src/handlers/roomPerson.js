import { roomPerson } from "../models/index.js";

export const createRoomPersonHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;
    const {roomNumber}  = req.params;
    const RoomNumber = parseInt(roomNumber);
    console.log("Roomnumber is : ", roomNumber, RoomNumber)
    console.log(ClientId);
    const { Name, PhoneNumber, DateOfJoining, Photo } = req.body;
    const existingPerson = await roomPerson.findOne({
      PhoneNumber,
      RoomNumber,
      ClientId,
    });
    if (existingPerson) {
      return res.status(400).json({
        message: "this phoneNumber person already exist",
      });
    }
    const person = await roomPerson.create({
      Name,
      PhoneNumber,
      DateOfJoining,
      Photo,
      RoomNumber,
      ClientId,
    });
    return res.status(201).json({
      message: "room person is created sucessfully",
      data: person,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again",
    });
  }
};

export const listRoomPersonsByRoomNumberHandler = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { ClientId } = req.locals;
    const personsInRoom = await roomPerson.find({ RoomNumber: roomNumber, ClientId });
    console.log(personsInRoom)
    return res.status(200).json({
      message: ` ${roomNumber} room Persons get sucessfully `,
      data: personsInRoom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong please try again",
    });
  }
};

export const updateRoomPersonByIdHandler = async (req, res) => {
  try {
    const { ClientId} =req.locals;
    const { Name, PhoneNumber, DateOfJoining, RoomNumber, Photo } = req.body;
    const { id } = req.params;
    const existingPerson = await roomPerson.findOne({
      RoomNumber,
      ClientId,
    });
    if (!existingPerson) {
      return res.status(400).json({
        message: "Invalid person details",
      });
    }
    const updatePerson = await roomPerson.findOneAndUpdate(
      {ClientId,_id : id},
      { Name, PhoneNumber, DateOfJoining, RoomNumber, Photo,ClientId },
      { returnDocument: "after" }
    );
    return res.status(200).json({
      message: `${RoomNumber} person details updated sucessfully`,
      data: updatePerson,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
        message:"Something went wrong please try again"
    })
  }
};

export const deleteRoomPersonByRoomNumberAndId = async (req,res)=>{
    const {id} = req.params;
    const {ClientId} = req.locals;
    await roomPerson.findOneAndDelete({ClientId,_id : id});
    return res.status(200).json({
        message:" person delete sucessfully"
    })
}

