const API_BASE = '/api';

function formatDate(dateStr) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-AU', options);
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function isUpcoming(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    return eventDate >= today;
}

function renderEventCard(event) {
    const upcoming = isUpcoming(event.event_date);
    const statusBadge = upcoming
        ? '<span class="event-card-category badge-upcoming">Upcoming</span>'
        : '<span class="event-card-category badge-past">Past</span>';

    const ticketInfo = event.is_free === 1 || event.is_free === true
        ? 'Free Entry'
        : `$${parseFloat(event.ticket_price).toFixed(2)}`;

    return `
        <article class="event-card">
            <img src="${event.image}" alt="${event.name}" onerror="this.src='https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'">
            <div class="event-card-body">
                ${statusBadge}
                <span class="event-card-category">${event.category_name}</span>
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="event-meta">
                    <strong>Date:</strong> ${formatDate(event.event_date)} at ${formatTime(event.event_time)}
                </div>
                <div class="event-meta">
                    <strong>Location:</strong> ${event.location}
                </div>
                <div class="event-meta">
                    <strong>Ticket:</strong> ${ticketInfo}
                </div>
                <a href="event.html?id=${event.id}" class="btn btn-primary" style="margin-top:12px;">View Details</a>
            </div>
        </article>
    `;
}

function loadEvents() {
    const container = document.getElementById('events-container');

    fetch(`${API_BASE}/events/home`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (!result.success || result.data.length === 0) {
                container.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#7f8c8d;">No upcoming events at the moment. Please check back soon!</p>';
                return;
            }
            container.innerHTML = result.data.map(renderEventCard).join('');
        })
        .catch(error => {
            console.error('Error loading events:', error);
            container.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#e74c3c;">Failed to load events. Please ensure the database server is running.</p>';
        });
}

document.addEventListener('DOMContentLoaded', loadEvents);
