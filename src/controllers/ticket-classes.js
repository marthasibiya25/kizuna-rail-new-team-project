import {
  getAllTicketClasses as findAllTicketClasses,
  getPaginatedTicketClasses as findPaginatedTicketClasses,
  getTicketClassesForDay as findTicketClassesForDay,
} from "../models/ticket-classes.js";

const validDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export async function getAllTicketClasses(req, res) {
  try {
    const ticketClasses = await findAllTicketClasses();

    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error("Error fetching ticket classes:", error);

    return res.status(500).json({
      error: "Failed to fetch ticket classes",
    });
  }
}

export async function getPaginatedTicketClasses(req, res) {
  try {
    const page = Number.parseInt(req.query.page ?? "1", 10);
    const limit = Number.parseInt(req.query.limit ?? "10", 10);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        error: "Page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
      return res.status(400).json({
        error: "Limit must be an integer between 1 and 10",
      });
    }

    const result = await findPaginatedTicketClasses(page, limit);

    return res.status(200).json({
      data: result.ticketClasses,
      metadata: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated ticket classes:", error);

    return res.status(500).json({
      error: "Failed to fetch ticket classes",
    });
  }
}

export async function getTicketClassesForDay(req, res) {
  try {
    const { day } = req.query;
    const normalizedDay = day?.toLowerCase();

    if (!normalizedDay || !validDays.includes(normalizedDay)) {
      return res.status(400).json({
        error: "Invalid day",
      });
    }

    const ticketClasses = await findTicketClassesForDay(normalizedDay);

    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error("Error fetching ticket classes for day:", error);

    return res.status(500).json({
      error: "Failed to fetch ticket classes for day",
    });
  }
}
