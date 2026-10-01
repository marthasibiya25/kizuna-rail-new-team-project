import mongoose from "mongoose";
import Trip from "./schemas/trips.js";

export async function getTripById(id) {
  return Trip.findOne({ id }).lean();
}

export async function getAllTrips() {
  return Trip.find({}).lean();
}

export const updateTripById = async (id, updateData) => {
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { id }] }
    : { id };

  return await Trip.findOneAndUpdate(
    query, 
    { $set: updateData }, 
    { returnDocument: 'after', runValidators: true } 
  ).lean();
};

export const deleteTripById = async (id) => {
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { $or: [{ _id: id }, { id }] }
    : { id };

  return await Trip.findOneAndDelete(query).lean();
};