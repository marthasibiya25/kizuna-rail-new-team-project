document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('trips-table-body');
  const editModal = document.getElementById('edit-trip-modal');
  const editForm = document.getElementById('edit-trip-form');
  const cancelBtn = document.getElementById('cancel-edit-btn');

  let currentTrips = []; 

  async function loadTrips() {
    try {
      const response = await fetch('/api/trips');
      if (!response.ok) throw new Error('Failed to load trips');
      
      currentTrips = await response.json();
      renderTrips(currentTrips);
    } catch (error) {
      console.error(error);
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7">Error loading trips.</td></tr>`;
      }
    }
  }

  function renderTrips(trips) {
    if (!tableBody) return;

    if (!trips || trips.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7">No routes found.</td></tr>';
      return;
    }

    tableBody.innerHTML = trips.map(trip => `
      <tr data-id="${trip._id}">
        <td><strong>${trip.name || 'N/A'}</strong></td>
        <td class="text-capitalize">${trip.region || 'N/A'}</td>
        <td class="text-capitalize">${trip.startStation || 'N/A'}</td>
        <td class="text-capitalize">${trip.endStation || 'N/A'}</td>
        <td>${trip.duration || 'N/A'}</td>
        <td>${trip.distance ? trip.distance + ' km' : 'N/A'}</td>
        <td>
          <div class="action-buttons">
            <button type="button" class="btn btn-edit" data-id="${trip._id}">Edit</button>
            <button type="button" class="btn btn-delete" data-id="${trip._id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  if (tableBody) {
    tableBody.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-delete')) {
        const tripId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this route?')) {
          try {
            const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            loadTrips();
          } catch (err) {
            alert('Could not delete route');
          }
        }
      }

      if (e.target.classList.contains('btn-edit')) {
        const tripId = e.target.dataset.id;
        const trip = currentTrips.find(t => t._id === tripId);
        
        if (trip) {
          document.getElementById('edit-trip-id').value = trip._id;
          document.getElementById('edit-name').value = trip.name || '';
          document.getElementById('edit-region').value = trip.region || '';
          document.getElementById('edit-start').value = trip.startStation || '';
          document.getElementById('edit-end').value = trip.endStation || '';
          document.getElementById('edit-duration').value = trip.duration || '';
          document.getElementById('edit-distance').value = trip.distance || '';
          
          if (editModal) editModal.showModal();
        }
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-trip-id').value;
      
      const updatedData = {
        name: document.getElementById('edit-name').value,
        region: document.getElementById('edit-region').value,
        startStation: document.getElementById('edit-start').value,
        endStation: document.getElementById('edit-end').value,
        duration: document.getElementById('edit-duration').value,
        distance: Number(document.getElementById('edit-distance').value)
      };

      try {
        const res = await fetch(`/api/trips/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData)
        });

        if (!res.ok) throw new Error('Update failed');
        
        if (editModal) editModal.close();
        loadTrips();
      } catch (err) {
        alert('Error updating route');
      }
    });
  }

  if (cancelBtn && editModal) {
    cancelBtn.addEventListener('click', () => editModal.close());
  }

  loadTrips();
});