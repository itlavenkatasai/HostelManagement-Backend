import mongoose from "mongoose";

// Helper function to format a date to 'yyyy-mm-dd'
function formatDate(date) {
  const d = new Date(date);
  let day = '' + d.getDate();
  let month = '' + (d.getMonth() + 1);
  const year = d.getFullYear();

  if (day.length < 2) day = '0' + day;
  if (month.length < 2) month = '0' + month;

  return [year, month, day].join("-");
}

const roomPersonSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  DateOfJoining: {
    type: Date,
    set: function (value) {
        // Convert to Date object and store only the date part
        return new Date(formatDate(value));
    },
    get: function (value) {
        // Format date to 'yyyy-mm-dd' when retrieving
        return formatDate(value);
    }
},
  Photo: { type: String },
  RoomNumber : {type : Number},
  ClientId: { type: String, required: true },
});

export const roomPerson = mongoose.model("RoomPersons", roomPersonSchema);
