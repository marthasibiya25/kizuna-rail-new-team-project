const PAGE_SIZE = 10;

const statusMessage = document.querySelector('#bookings-status');
const bookingList = document.querySelector('#bookings-list');
const bookingRowTemplate = document.querySelector('#booking-row-template');
const prevButton = document.querySelector('#page-prev');
const nextButton = document.querySelector('#page-next');
const pageInfo = document.querySelector('#page-info');

// Start on the page named in the URL (?page=3), or page 1
let currentPage = Number.parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
if (currentPage < 1) currentPage = 1;

// Redirect to login if the session expired while the page was open
const redirectIfUnauthorized = (response) => {
    if (response.status === 401) {
        window.location.href = '/login';
        return true;
    }
    return false;
};

const readErrorMessage = async (response, fallback) => {
    const data = await response.json().catch(() => ({}));
    return data.message || data.error || fallback;
};

const fetchBookings = async (page) => {
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    const response = await fetch(`/api/bookings?${params}`, { credentials: 'same-origin' });

    if (redirectIfUnauthorized(response)) return null;
    if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Unable to load bookings.'));
    }
    return response.json();
};

const updateBookingRequest = async (id, updates) => {
    const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });

    if (redirectIfUnauthorized(response)) return null;
    if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Unable to update booking.'));
    }
    return response.json();
};

const deleteBookingRequest = async (id) => {
    const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
    });

    if (redirectIfUnauthorized(response)) return null;
    if (!response.ok) {
        throw new Error(await readErrorMessage(response, 'Unable to delete booking.'));
    }
    return response.json();
};

const renderBookings = (bookings) => {
    const fragment = document.createDocumentFragment();

    bookings.forEach((booking) => {
        const passengers = booking.passengers || [];
        const row = bookingRowTemplate.content.cloneNode(true);

        row.querySelector('.booking-code').textContent = booking.id;
        row.querySelector('.booking-route').textContent = booking.routeId;
        row.querySelector('.booking-schedule').textContent = booking.scheduleId;
        row.querySelector('.booking-ticket').textContent = booking.ticketClass;
        row.querySelector('.booking-day').textContent = booking.selectedDay;
        row.querySelector('.booking-passenger-count').textContent = passengers.length;
        row.querySelector('.booking-passengers').textContent = passengers
            .map((passenger) => `${passenger.firstName} ${passenger.lastName}`)
            .join(', ');
        row.querySelector('.booking-created').textContent = new Date(booking.createdAt)
            .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        row.querySelector('.btn-edit').addEventListener('click', async () => {
            const newTicketClass = window.prompt('Ticket class (e.g. standard, premium):', booking.ticketClass);
            if (newTicketClass === null) return;

            const newDay = window.prompt('Travel day (e.g. monday):', booking.selectedDay);
            if (newDay === null) return;

            try {
                const result = await updateBookingRequest(booking.id, {
                    ticketClass: newTicketClass,
                    selectedDay: newDay,
                });
                if (!result) return;
                await loadBookings(currentPage);
            } catch (error) {
                statusMessage.textContent = error.message;
            }
        });

        row.querySelector('.btn-delete').addEventListener('click', async () => {
            if (!window.confirm(`Delete booking ${booking.id}? This cannot be undone.`)) return;

            try {
                const result = await deleteBookingRequest(booking.id);
                if (!result) return;
                await loadBookings(currentPage);
            } catch (error) {
                statusMessage.textContent = error.message;
            }
        });

        fragment.append(row);
    });

    bookingList.replaceChildren(fragment);
};

const renderPagination = ({ page, totalPages, total, limit }) => {
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= totalPages;
    pageInfo.textContent = `Page ${page} of ${totalPages}`;

    if (total === 0) {
        statusMessage.textContent = 'No bookings yet, or none match your account.';
        return;
    }

    const first = (page - 1) * limit + 1;
    const last = Math.min(page * limit, total);
    statusMessage.textContent = `Showing ${first}-${last} of ${total} booking${total === 1 ? '' : 's'}.`;
};

const loadBookings = async (page = currentPage) => {
    statusMessage.textContent = 'Loading bookings...';

    try {
        const data = await fetchBookings(page);
        if (!data) return; // redirected to login

        // The last item on the last page was deleted: step back to the new last page
        if (data.bookings.length === 0 && data.total > 0 && page > data.totalPages) {
            return loadBookings(data.totalPages);
        }

        currentPage = data.page;
        renderBookings(data.bookings);
        renderPagination(data);
        window.history.replaceState(null, '', `?page=${currentPage}`);
    } catch (error) {
        bookingList.replaceChildren();
        prevButton.disabled = true;
        nextButton.disabled = true;
        statusMessage.textContent = 'Bookings could not be loaded. Refresh the page to try again.';
    }
};

prevButton.addEventListener('click', () => loadBookings(currentPage - 1));
nextButton.addEventListener('click', () => loadBookings(currentPage + 1));

loadBookings(currentPage);