-- ============================================================
-- PROG2002 Web Development II - Charity Event Website
-- Database Schema & Sample Data
-- ============================================================

-- Drop existing tables if they exist (run in correct order due to FK)
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;

-- ============================================================
-- 1. Categories table
-- ============================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 2. Events table
-- ============================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    purpose TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    image VARCHAR(500),
    ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_free TINYINT(1) NOT NULL DEFAULT 0,
    goal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    raised_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    is_suspended TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. Insert categories
-- ============================================================
INSERT INTO categories (name) VALUES
    ('Gala Dinner'),
    ('Fun Run'),
    ('Silent Auction'),
    ('Concert'),
    ('Charity Walk'),
    ('Sports Event');

-- ============================================================
-- 4. Insert sample events (10 events across different categories)
-- ============================================================
INSERT INTO events (name, description, full_description, purpose, event_date, event_time, location, category_id, image, ticket_price, is_free, goal_amount, raised_amount, is_suspended) VALUES
('Annual Hope Gala Dinner', 'An elegant evening of fine dining and live entertainment to raise funds for underprivileged children.', 'Join us for a magical night featuring a three-course gourmet dinner, live jazz band, inspiring guest speakers, and a charity auction. All proceeds go directly to supporting education programs for disadvantaged youth across the region.', 'Raise funds to provide scholarships and school supplies for 500 underprivileged children.', '2026-11-15', '18:30:00', 'Grand Ballroom, Hilton Hotel, Sydney', 1, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 150.00, 0, 50000.00, 12500.00, 0),
('Spring Charity Fun Run 5K', 'A community fun run through the scenic riverside park to support cancer research.', 'Lace up your running shoes and join hundreds of participants for a scenic 5km run along the river. Suitable for all fitness levels with water stations along the route. Finishers receive a commemorative medal.', 'Fund cutting-edge cancer research programs at leading medical institutes.', '2026-10-20', '07:00:00', 'Riverside Park, Melbourne', 2, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', 35.00, 0, 25000.00, 18700.00, 0),
('Silent Art Auction Night', 'Bid on stunning artworks donated by local artists to support mental health initiatives.', 'An intimate evening featuring over 50 artworks from talented local artists. Enjoy wine and canapés while placing your bids. Live music sets the mood for a night of art and philanthropy.', 'Fund free mental health counselling services for young adults.', '2026-12-05', '19:00:00', 'Modern Art Gallery, Brisbane', 3, 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800', 25.00, 0, 30000.00, 8200.00, 0),
('Rocks for Hope Charity Concert', 'A night of rock music featuring top local bands to raise awareness for homelessness.', 'Five incredible bands take the stage for a night of unforgettable live music. Food trucks and merchandise stalls on site. A powerful night of music for a great cause.', 'Support homeless shelters and provide warm meals and bedding this winter.', '2026-11-28', '20:00:00', 'The Arena, Adelaide', 4, 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 60.00, 0, 40000.00, 15600.00, 0),
('Walk for Water 10K', 'A scenic 10-kilometre charity walk to fund clean water projects in developing communities.', 'Walk through beautiful bushland trails while learning about the global water crisis. Free water and snacks provided. Families and pets welcome.', 'Build 20 water wells providing clean drinking water to rural communities.', '2027-01-18', '06:30:00', 'Botanical Gardens, Perth', 5, 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', 0.00, 1, 20000.00, 9800.00, 0),
('Basketball Charity Tournament', 'A weekend basketball tournament where corporate teams compete for the charity cup.', 'Corporate teams go head-to-head in a fun competitive basketball tournament. Spectators welcome with food, drinks, and a kids zone. Trophies for the top three teams.', 'Fund sports equipment and programs for underfunded rural schools.', '2027-02-10', '09:00:00', 'Sports Complex, Gold Coast', 6, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', 80.00, 0, 15000.00, 4300.00, 0),
('Winter Wonderland Gala', 'A magical winter-themed gala dinner with ice sculptures and festive performances.', 'Step into a winter wonderland with spectacular ice sculptures, festive performances, and a gourmet winter menu. Photos with Santa included. A perfect start to the holiday season.', 'Provide winter warmth packs and meals for families in need.', '2026-12-20', '19:00:00', 'Crystal Palace, Sydney', 1, 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800', 200.00, 0, 60000.00, 22000.00, 0),
('Sunrise Charity Swim', 'An early morning ocean swim event to support marine conservation efforts.', 'Take part in a 1.5km ocean swim at sunrise with stunning coastal views. Safety boats and surf lifesavers on duty. Breakfast provided for all swimmers.', 'Protect marine ecosystems and fund beach cleanup programs.', '2027-03-08', '05:30:00', 'Bondi Beach, Sydney', 2, 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=800', 45.00, 0, 18000.00, 3200.00, 0),
('Jazz Night for a Cause', 'A soulful evening of jazz music featuring renowned local and international artists.', 'Smooth jazz melodies fill the air as world-class musicians perform for one night only. Premium seating and dinner packages available. Cash bar with signature cocktails.', 'Support music education programs for children from low-income families.', '2027-01-25', '19:30:00', 'Jazz Club, Melbourne', 4, 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', 75.00, 0, 22000.00, 11000.00, 0),
('Taste of the World Food Festival', 'A culinary journey around the world with stalls from 30+ countries supporting community kitchens.', 'Sample authentic dishes from over 30 countries prepared by local chefs. Cooking demonstrations, cultural performances, and a kids cooking workshop. A feast for the senses!', 'Fund community kitchens providing free meals to families facing food insecurity.', '2027-02-22', '11:00:00', 'Harbourfront Park, Sydney', 1, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 15.00, 0, 35000.00, 14500.00, 0),
('Summer Beach Clean-Up 2026', 'A community beach clean-up event that has concluded successfully.', 'Hundreds of volunteers gathered at Bondi Beach to remove over 500kg of marine debris. The event featured educational workshops on ocean conservation and a community barbecue. This event has now concluded, but we thank all participants for their incredible support.', 'Raise awareness about marine pollution and fund ongoing beach conservation programs.', '2026-08-15', '08:00:00', 'Bondi Beach, Sydney', 5, 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800', 0.00, 1, 10000.00, 10000.00, 0);

-- ============================================================
-- Verification queries
-- ============================================================
SELECT * FROM categories;
SELECT e.id, e.name, c.name AS category, e.event_date, e.location
FROM events e
JOIN categories c ON e.category_id = c.id
ORDER BY e.event_date;
