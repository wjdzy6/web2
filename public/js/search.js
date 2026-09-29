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

function loadCategories() {
    return fetch(`${API_BASE}/categories`)
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const select = document.getElementById('filter-category');
                result.data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    select.appendChild(option);
                });
            }
        })
        .catch(err => console.error('Error loading categories:', err));
}

function renderEventCard(event) {
    const ticketInfo = event.is_free === 1 || event.is_free === true
        ? 'Free Entry'
        : `$${parseFloat(event.ticket_price).toFixed(2)}`;

    return `
        <article class="event-card">
            <img src="${event.image}" alt="${event.name}" onerror="this.src='https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'">
            <div class="event-card-body">
                <span class="event-card-category">${event.category_name}</span>
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div class="event-meta"><strong>Date:</strong> ${formatDate(event.event_date)} at ${formatTime(event.event_time)}</div>
                <div class="event-meta"><strong>Location:</strong> ${event.location}</div>
                <div class="event-meta"><strong>Ticket:</strong> ${ticketInfo}</div>
                <a href="event.html?id=${event.id}" class="btn btn-primary" style="margin-top:12px;">View Details</a>
            </div>
        </article>
    `;
}

function showError(message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function hideError() {
    const errorEl = document.getElementById('error-message');
    errorEl.classList.remove('show');
}

function searchEvents() {
    hideError();
    const date = document.getElementById('filter-date').value;
    const location = document.getElementById('filter-location').value.trim();
    const category = document.getElementById('filter-category').value;

    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    const resultsContainer = document.getElementById('results-container');
    const resultsCount = document.getElementById('results-count');
    resultsContainer.innerHTML = '<p class="loading">Searching events...</p>';

    fetch(`${API_BASE}/events/search?${params.toString()}`)
        .then(response => {
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(result => {
            if (!result.success) {
                showError('Failed to search events. Please try again.');
                resultsContainer.innerHTML = '';
                resultsCount.textContent = '';
                return;
            }

            const events = result.data;
            resultsCount.textContent = events.length > 0
                ? `Showing ${events.length} event(s)`
                : '';

            if (events.length === 0) {
                resultsContainer.innerHTML = '<p style="text-align:center; grid-column:1/-1; color:#7f8c8d;">No events match your search criteria. Try adjusting your filters.</p>';
            } else {
                resultsContainer.innerHTML = events.map(renderEventCard).join('');
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            showError('Failed to load search results. Please ensure the database server is running.');
            resultsContainer.innerHTML = '';
            resultsCount.textContent = '';
        });
}

function clearFilters() {
    document.getElementById('filter-date').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-category').value = '';
    hideError();
    document.getElementById('results-count').textContent = '';
    document.getElementById('results-container').innerHTML = '<p class="loading">Use the filters above to search for events.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCategories().then(() => {
        searchEvents();
    });

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        searchEvents();
    });

    document.getElementById('clear-btn').addEventListener('click', clearFilters);
});
