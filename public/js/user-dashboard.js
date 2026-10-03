document.addEventListener("DOMContentLoaded", async () => {
    const bookingsContainer = document.getElementById("bookings-container");

    try {
        const response = await fetch("/api/bookings/me");

        if (!response.ok) {
            throw new Error("Unable to load bookings.");
        }

        const bookings = await response.json();

        if (bookings.length === 0) {
            bookingsContainer.textContent = "You do not have any bookings yet.";
            return;
        }

        bookingsContainer.innerHTML = "";

        bookings.forEach((booking) => {
            const bookingElement = document.createElement("article");

            bookingElement.innerHTML = `
                <h3>Booking ${booking.id}</h3>
                <p><strong>Route:</strong> ${booking.routeId}</p>
                <p><strong>Travel Day:</strong> ${booking.selectedDay}</p>
                <p><strong>Ticket Class:</strong> ${booking.ticketClass}</p>
                <a href="/routes/bookings/${booking.id}">View Booking</a>
            `;

            bookingsContainer.appendChild(bookingElement);
        });
    } catch (error) {
        console.error("Error loading bookings:", error);
        bookingsContainer.textContent = "Unable to load your bookings.";
    }
});