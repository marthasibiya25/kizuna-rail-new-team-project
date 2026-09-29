document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('trips-table-body');
  const editModal = document.getElementById('edit-trip-modal');
  const editForm = document.getElementById('edit-trip-form');
  const cancelBtn = document.getElementById('cancel-edit-btn');

  async function loadTrips() {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) throw new Error('Failed to load trips');
      
      const trips = await response.json();
      renderTrips(trips);
    } catch (error) {
      console.error(error);
      tableBody.innerHTML = `<tr><td colspan="6">Error loading trips.</td></tr>`;
    }
  }

  function renderTrips(trips) {
    if (trips.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No trips found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = trips.map(trip => `
      <tr data-id="${trip._id}">
        <td>${trip.startStation}</td>
        <td>${trip.endStation}</td>
        <td>${trip.departureTime}</td>
        <td>${trip.arrivalTime}</td>
        <td>${trip.trainId}</td>
        <td>
          <button class="btn-edit" data-trip='${JSON.stringify(trip)}'>Edit</button>
          <button class="btn-delete" data-id="${trip._id}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  tableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const tripId = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this trip?')) {
        try {
          const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete');
          loadTrips();
        } catch (err) {
          alert('Could not delete trip');
        }
      }
    }

    if (e.target.classList.contains('btn-edit')) {
      const trip = JSON.parse(e.target.dataset.trip);
      document.getElementById('edit-trip-id').value = trip._id;
      document.getElementById('edit-start').value = trip.startStation;
      document.getElementById('edit-end').value = trip.endStation;
      document.getElementById('edit-departure').value = trip.departureTime;
      document.getElementById('edit-arrival').value = trip.arrivalTime;
      document.getElementById('edit-train').value = trip.trainId;
      editModal.showModal();
    }
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-trip-id').value;
    const updatedData = {
      startStation: document.getElementById('edit-start').value,
      endStation: document.getElementById('edit-end').value,
      departureTime: document.getElementById('edit-departure').value,
      arrivalTime: document.getElementById('edit-arrival').value,
      trainId: document.getElementById('edit-train').value
    };

    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) throw new Error('Update failed');
      
      editModal.close();
      loadTrips();
    } catch (err) {
      alert('Error updating trip');
    }
  });

  cancelBtn.addEventListener('click', () => editModal.close());

  loadTrips();
});