const API_BASE = '/api';

function formatDate(dateStr) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-AU', options);
}

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getEventId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function renderEvent(event) {
    document.getElementById('event-category').textContent = event.category_name;
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-date-time').textContent = `${formatDate(event.event_date)} at ${formatTime(event.event_time)}`;

    const ticketInfo = event.is_free === 1 || event.is_free === true
        ? 'Free Entry'
        : `$${parseFloat(event.ticket_price).toFixed(2)} per person`;

    const goal = parseFloat(event.goal_amount) || 0;
    const raised = parseFloat(event.raised_amount) || 0;
    const progressPercent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    const body = document.getElementById('event-body');
    body.innerHTML = `
        <div class="event-detail-content">
            <div class="event-detail-main">
                <img src="${event.image}" alt="${event.name}" onerror="this.src='https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200'">
                <h2>About This Event</h2>
                <p>${event.full_description || event.description}</p>
                <h2>Our Purpose</h2>
                <p>${event.purpose || 'This event aims to raise funds and awareness for an important charitable cause.'}</p>
                <h2>Goal &amp; Progress</h2>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${progressPercent}%">${progressPercent}%</div>
                    </div>
                    <p class="progress-text"><strong>$${raised.toLocaleString()}</strong> raised of <strong>$${goal.toLocaleString()}</strong> goal</p>
                </div>
            </div>
            <aside class="event-sidebar">
                <div class="sidebar-item">
                    <h4>Date &amp; Time</h4>
                    <p>${formatDate(event.event_date)}</p>
                    <p>${formatTime(event.event_time)}</p>
                </div>
                <div class="sidebar-item">
                    <h4>Location</h4>
                    <p>${event.location}</p>
                </div>
                <div class="sidebar-item">
                    <h4>Category</h4>
                    <p>${event.category_name}</p>
                </div>
                <div class="sidebar-item">
                    <h4>Ticket Price</h4>
                    <p>${ticketInfo}</p>
                </div>
                <div class="sidebar-item">
                    <h4>Fundraising Goal</h4>
                    <p>$${goal.toLocaleString()}</p>
                </div>
                <button id="register-btn" class="btn btn-primary btn-block" style="margin-top:10px;">Register Now</button>
            </aside>
        </div>
    `;

    document.getElementById('register-btn').addEventListener('click', showModal);
}

function showModal() {
    document.getElementById('register-modal').classList.add('show');
}

function hideModal() {
    document.getElementById('register-modal').classList.remove('show');
}

function loadEvent() {
    const eventId = getEventId();
    if (!eventId) {
        document.getElementById('event-body').innerHTML = '<p style="text-align:center; color:#e74c3c;">No event ID provided. Please select an event from the home page.</p>';
        return;
    }

    fetch(`${API_BASE}/events/${eventId}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error('Event not found');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                renderEvent(result.data);
            } else {
                throw new Error(result.message || 'Failed to load event');
            }
        })
        .catch(error => {
            console.error('Error loading event:', error);
            document.getElementById('event-name').textContent = 'Event Not Found';
            document.getElementById('event-body').innerHTML = '<p style="text-align:center; color:#e74c3c;">Failed to load event details. Please ensure the database server is running.</p>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadEvent();

    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
    document.getElementById('register-modal').addEventListener('click', (e) => {
        if (e.target.id === 'register-modal') {
            hideModal();
        }
    });
});
