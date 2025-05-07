import { roomPerson } from "../models/index.js";

// Handler to create a room person
export const createRoomPersonHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;  // Retrieve the ClientId from the request locals
    const { roomNumber } = req.params;  // Room number from the URL params
    const RoomNumber = parseInt(roomNumber);  // Convert room number to integer
    
    // Destructure fields from the request body
    const { Name, PhoneNumber, DateOfJoining, Photo='', AmountPerMonth, Paid } = req.body;

    // Log incoming data for debugging
    console.log("Request Body: ", req.body);
    
    // Check if any required fields are missing
    if (!Name || !PhoneNumber || !DateOfJoining || !AmountPerMonth || Paid === undefined) {
      return res.status(400).json({
        message: "Missing required fields. Please provide all required data.",
      });
    }

    // Check if the phone number already exists for the given room and client
    const existingPerson = await roomPerson.findOne({
      PhoneNumber,
      RoomNumber,
      ClientId,
    });

    if (existingPerson) {
      return res.status(400).json({
        message: "This person with the given phone number already exists in this room.",
      });
    }

    // Create a new room person
    const person = await roomPerson.create({
      Name,
      PhoneNumber,
      DateOfJoining: new Date(DateOfJoining), // Optional, but adds safety
      Photo,
      RoomNumber,
      ClientId,
      AmountPerMonth: Number(AmountPerMonth), // ✅ force to number
      Paid,
    });

    console.log("Person Created: ", person);

    // Send a success response with the created person data
    return res.status(201).json({
      message: "Room person created successfully.",
      data: person,
    });
  } catch (error) {
    console.error("Error in createRoomPersonHandler: ", error);
    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
};

// Handler to list all persons in a specific room
export const listRoomPersonsByRoomNumberHandler = async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { ClientId } = req.locals;

    const personsInRoom = await roomPerson.find({
      RoomNumber: roomNumber,
      ClientId,
    });

    if (!personsInRoom || personsInRoom.length === 0) {
      return res.status(404).json({
        message: `No one is currently assigned to Room ${roomNumber}. Please add members.`,
      });
    }

    return res.status(200).json({
      message: `Persons in room ${roomNumber} fetched successfully.`,
      data: personsInRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
};

// Handler to update a room person's details by ID
export const updateRoomPersonByIdHandler = async (req, res) => {
  try {
    const { ClientId } = req.locals;
    const { id } = req.params;
    const { Name, PhoneNumber, DateOfJoining, RoomNumber, Photo, AmountPerMonth, Paid } = req.body;

    // Check if the person exists in the room
    const existingPerson = await roomPerson.findOne({
      _id: id,
      ClientId,
    });

    if (!existingPerson) {
      return res.status(404).json({
        message: "Person not found or invalid details.",
      });
    }

    // Update the room person's details
    const updatedPerson = await roomPerson.findOneAndUpdate(
      { _id: id, ClientId },
      { Name, PhoneNumber, DateOfJoining, RoomNumber, Photo, AmountPerMonth, Paid },
      { new: true } // Returns the updated document
    );

    return res.status(200).json({
      message: `Person details in room ${RoomNumber} updated successfully.`,
      data: updatedPerson,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
};

// Handler to delete a room person by ID
export const deleteRoomPersonByRoomNumberAndId = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClientId } = req.locals;

    // Delete the person from the room
    const deletedPerson = await roomPerson.findOneAndDelete({
      _id: id,
      ClientId,
    });

    if (!deletedPerson) {
      return res.status(404).json({
        message: "Person not found or invalid details.",
      });
    }

    
    return res.status(200).json({
      message: "Person deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong, please try again.",
    });
  }
};
