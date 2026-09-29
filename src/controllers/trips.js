import {
  getTripById as findTripById,
  getAllTrips as findAllTrips,
  updateTripById as updateTripModel,
  deleteTripById as deleteTripModel,
} from "../models/trips.js";

export async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await findTripById(id);

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);

    return res.status(500).json({
      error: "Failed to fetch trip",
    });
  }
}

export async function getAllTrips(req, res) {
  try {
    const trips = await findAllTrips();

    return res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);

    return res.status(500).json({
      error: "Failed to fetch trips",
    });
  }
}

export async function renderTripListPage(req, res) {
  return res.render("routes/list", {
    title: "Scenic Train Routes",
  });
}

export async function renderTripDetailsPage(req, res) {
  try {
    const { routeId } = req.params;
    const details = await findTripById(routeId);

    if (!details) {
      return res.status(404).render("errors/404", {
        title: "Page Not Found",
        error: "Trip not found.",
      });
    }

    return res.render("routes/details", {
      title: "Route Details",
      details,
    });
  } catch (error) {
    console.error("Error rendering trip details:", error);

    return res.status(500).render("errors/500", {
      title: "Server Error",
      error: "Unable to load trip details.",
      stack: error.stack,
    });
  }
}

export async function updateTrip(req, res, next) {
  try {
    const { id } = req.params;
    const { name, region, startStation, endStation, duration, distance } = req.body;

    const updatedTrip = await updateTripModel(id, {
      name,
      region,
      startStation,
      endStation,
      duration,
      distance: Number(distance)
    });

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Trip updated successfully', trip: updatedTrip });
  } catch (error) {
    next(error);
  }
}
export async function deleteTrip(req, res, next) {
  try {
    const { id } = req.params;

    const deletedTrip = await deleteTripModel(id);

    if (!deletedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    return res.status(200).json({ message: 'Trip deleted successfully', id });
  } catch (error) {
    next(error);
  }
}