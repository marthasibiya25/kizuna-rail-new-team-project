import TicketClass from "./schemas/ticket-classes.js";

export async function getAllTicketClasses() {
  return TicketClass.find({}).lean();
}

export async function getPaginatedTicketClasses(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [ticketClasses, total] = await Promise.all([
    TicketClass.find({})
      .skip(skip)
      .limit(limit)
      .lean(),
    TicketClass.countDocuments({}),
  ]);

  return {
    ticketClasses,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTicketClassesForDay(day) {
  return TicketClass.find({
    availableDays: day.toLowerCase(),
  }).lean();
}
