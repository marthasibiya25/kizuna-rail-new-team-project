import Trip from "./schemas/trips.js";

export async function getTripById(id) {
  return Trip.findOne({ id }).lean();
}

export async function getAllTrips() {
  return Trip.find({}).lean();
}

export const updateTripById = async (id, updateData) => {
  return await Trip.findByIdAndUpdate(
    id, 
    updateData, 
    { new: true, runValidators: true }
  ).lean();
};

export const deleteTripById = async (id) => {
  return await Trip.findByIdAndDelete(id).lean();
};