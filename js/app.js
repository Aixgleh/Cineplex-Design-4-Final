// Mid-Fidelity Wireframe Prototype Logic (Sketch D)
// Simple, clean JavaScript for student prototype

// Embedded JSON data fallback for direct file:// execution
const defaultData = {
  movies: [
    { id: "m1", title: "Crystal Horizon", genre: "Sci-Fi", poster: "images/poster_crystal_horizon.jpg", placeholder: "[ Poster: Diamond ]" },
    { id: "m2", title: "Stick Runner", genre: "Comedy", poster: "images/poster_stick_runner.jpg", placeholder: "[ Poster: Figure ]" },
    { id: "m3", title: "Chain Reaction", genre: "Thriller", poster: "images/poster_chain_reaction.jpg", placeholder: "[ Poster: Circles ]" },
    { id: "m4", title: "Happy Days", genre: "Animation", poster: "images/poster_happy_days.jpg", placeholder: "[ Poster: Smiley ]" },
    { id: "m5", title: "Starlight Quest", genre: "Fantasy", poster: "images/poster_starlight_quest.jpg", placeholder: "[ Poster: Star ]" },
    { id: "m6", title: "The Web", genre: "Mystery", poster: "images/poster_the_web.svg", placeholder: "[ Poster: Web ]" },
    { id: "m7", title: "Speed Wings", genre: "Action", poster: "images/poster_speed_wings.svg", placeholder: "[ Poster: Wing ]" },
    { id: "m8", title: "The Cloaked One", genre: "Drama", poster: "images/poster_the_cloaked_one.svg", placeholder: "[ Poster: Cloak ]" }
  ],
  locations: [
    { id: "loc-1", name: "Downtown Cinema", detail: "Auditorium 1" },
    { id: "loc-2", name: "West End Mall", detail: "Auditorium 4" },
    { id: "loc-3", name: "North Centre", detail: "Auditorium 2" },
    { id: "loc-4", name: "Valley Plaza", detail: "Auditorium 6" }
  ],
  times: [
    { id: "t1", time: "1:00 PM", type: "Matinee" },
    { id: "t2", time: "3:30 PM", type: "Regular" },
    { id: "t3", time: "6:15 PM", type: "Prime" },
    { id: "t4", time: "8:45 PM", type: "Prime" },
    { id: "t5", time: "11:00 PM", type: "Late Night" }
  ]
};

// Global State
const appState = {
  currentStep: 1,
  data: defaultData,
  selectedMovie: null,
  selectedLocation: null,
  selectedSeats: [],
  selectedTime: null
};

// Middle seats marked occupied in sketch (Row C, seats 3, 4, 5, 6)
const occupiedSeats = ["C3", "C4", "C5", "C6"];

// Initialize prototype
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

// Load JSON filler data
function loadData() {
  fetch("data/data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Local fetch error");
      return res.json();
    })
    .then((jsonData) => {
      appState.data = jsonData;
      initApp();
    })
    .catch(() => {
      // Fallback for file:// protocol
      appState.data = defaultData;
      initApp();
    });
}

function initApp() {
  renderMovieGrid();
  renderLocationList();
  renderSeatChart();
  renderTimeList();
  setupNavButtons();
  setupHamburgerMenu();
  updateSummary();
}

// Step Page Switching
function goToStep(step) {
  appState.currentStep = step;

  // Show only the active step page
  document.querySelectorAll(".step-view").forEach((view) => {
    view.classList.toggle("active", Number(view.dataset.step) === step);
  });

  // Ensure location panel is only shown if a movie is selected
  const locPanel = document.getElementById("location-panel");
  if (locPanel) {
    if (appState.selectedMovie) {
      locPanel.classList.add("visible");
    } else {
      locPanel.classList.remove("visible");
    }
  }

  updateSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// STEP 1: Render 8 Movies (2 rows x 4 columns)
function renderMovieGrid() {
  const container = document.getElementById("movie-grid-8");
  if (!container) return;
  container.innerHTML = "";

  appState.data.movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.id = movie.id;

    if (appState.selectedMovie && appState.selectedMovie.id === movie.id) {
      card.classList.add("selected");
    }

    const posterSrc = movie.poster || "";

    card.innerHTML = `
      <div class="poster-image-box">
        <img src="${posterSrc}" alt="${movie.title} Poster" class="movie-poster-img" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'poster-placeholder-box\\'>${movie.placeholder}</div>';">
      </div>
      <div class="movie-card-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-genre">${movie.genre}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      appState.selectedMovie = movie;
      document.querySelectorAll(".movie-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");

      // Reveal location list only after picking a movie
      const locPanel = document.getElementById("location-panel");
      if (locPanel) {
        locPanel.classList.add("visible");
        locPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      updateSummary();

      // Clear Step 1 reminder if both movie and location are chosen
      if (appState.selectedMovie && appState.selectedLocation) {
        const step1Reminder = document.getElementById("step1-reminder");
        if (step1Reminder) step1Reminder.style.display = "none";
      }
    });

    container.appendChild(card);
  });
}

// STEP 1: Render 4 Locations
function renderLocationList() {
  const list = document.getElementById("location-list");
  if (!list) return;
  list.innerHTML = "";

  appState.data.locations.forEach((loc) => {
    const li = document.createElement("li");
    li.className = "selection-item";
    li.dataset.id = loc.id;

    if (appState.selectedLocation && appState.selectedLocation.id === loc.id) {
      li.classList.add("selected");
    }

    li.innerHTML = `
      <div class="selection-icon">📍</div>
      <div class="selection-text">
        <div class="selection-title">${loc.name}</div>
        <div class="selection-sub">${loc.detail}</div>
      </div>
    `;

    li.addEventListener("click", () => {
      appState.selectedLocation = loc;
      document.querySelectorAll("#location-list .selection-item").forEach((item) => item.classList.remove("selected"));
      li.classList.add("selected");
      updateSummary();

      // Clear Step 1 reminder if both movie and location are chosen
      if (appState.selectedMovie && appState.selectedLocation) {
        const step1Reminder = document.getElementById("step1-reminder");
        if (step1Reminder) step1Reminder.style.display = "none";
      }
    });

    list.appendChild(li);
  });
}

// STEP 2: Render Cinema Seat Chart (6 rows x 8 cols)
function renderSeatChart() {
  const chart = document.getElementById("seating-chart");
  if (!chart) return;
  chart.innerHTML = "";

  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = 8;

  rows.forEach((rowLetter) => {
    for (let col = 1; col <= cols; col++) {
      const seatId = `${rowLetter}${col}`;
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.dataset.seat = seatId;
      seat.textContent = seatId;

      if (occupiedSeats.includes(seatId)) {
        seat.classList.add("occupied");
        seat.title = "Seat Occupied";
      } else {
        if (appState.selectedSeats.includes(seatId)) {
          seat.classList.add("selected");
        }

        seat.addEventListener("click", () => {
          toggleSeat(seatId, seat);
        });
      }

      chart.appendChild(seat);
    }
  });
}

function toggleSeat(seatId, seatElement) {
  const index = appState.selectedSeats.indexOf(seatId);
  if (index > -1) {
    appState.selectedSeats.splice(index, 1);
    seatElement.classList.remove("selected");
  } else {
    appState.selectedSeats.push(seatId);
    seatElement.classList.add("selected");
  }
  updateSummary();

  // Clear Step 2 reminder if both seats and time are chosen
  if (appState.selectedSeats.length > 0 && appState.selectedTime) {
    const step2Reminder = document.getElementById("step2-reminder");
    if (step2Reminder) step2Reminder.style.display = "none";
  }
}

// STEP 2: Render 5 Times
function renderTimeList() {
  const list = document.getElementById("time-list");
  if (!list) return;
  list.innerHTML = "";

  appState.data.times.forEach((t) => {
    const li = document.createElement("li");
    li.className = "selection-item";
    li.dataset.id = t.id;

    if (appState.selectedTime && appState.selectedTime.id === t.id) {
      li.classList.add("selected");
    }

    li.innerHTML = `
      <div class="selection-icon">🕒</div>
      <div class="selection-text">
        <div class="selection-title">${t.time}</div>
        <div class="selection-sub">${t.type}</div>
      </div>
    `;

    li.addEventListener("click", () => {
      appState.selectedTime = t;
      document.querySelectorAll("#time-list .selection-item").forEach((item) => item.classList.remove("selected"));
      li.classList.add("selected");
      updateSummary();

      // Clear Step 2 reminder if both seats and time are chosen
      if (appState.selectedSeats.length > 0 && appState.selectedTime) {
        const step2Reminder = document.getElementById("step2-reminder");
        if (step2Reminder) step2Reminder.style.display = "none";
      }
    });

    list.appendChild(li);
  });
}

// Navigation and Action Buttons
function setupNavButtons() {
  // Step 1 -> Step 2 (Only proceed if movie and location are selected)
  const toStep2 = document.getElementById("btn-to-step2");
  if (toStep2) {
    toStep2.addEventListener("click", () => {
      const hasMovie = !!appState.selectedMovie;
      const hasLocation = !!appState.selectedLocation;

      if (!hasMovie || !hasLocation) {
        const reminder = document.getElementById("step1-reminder");
        const reminderText = document.getElementById("step1-reminder-text");
        if (!hasMovie && !hasLocation) {
          reminderText.textContent = "Please select both a movie and a location before proceeding to Seat & Time.";
        } else if (!hasMovie) {
          reminderText.textContent = "Please select a movie before proceeding to Seat & Time.";
        } else {
          reminderText.textContent = "Please select a location before proceeding to Seat & Time.";
        }
        if (reminder) {
          reminder.style.display = "flex";
          reminder.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      // Valid: clear reminder and navigate to Step 2
      const reminder = document.getElementById("step1-reminder");
      if (reminder) reminder.style.display = "none";
      goToStep(2);
    });
  }

  // Step 2 -> Step 1
  const backTo1 = document.getElementById("btn-back-step1");
  if (backTo1) {
    backTo1.addEventListener("click", () => goToStep(1));
  }

  // Step 2 -> Step 3 (Only proceed if seats and time are chosen)
  const toStep3 = document.getElementById("btn-to-step3");
  if (toStep3) {
    toStep3.addEventListener("click", () => {
      const hasSeats = appState.selectedSeats && appState.selectedSeats.length > 0;
      const hasTime = !!appState.selectedTime;

      if (!hasSeats || !hasTime) {
        const reminder = document.getElementById("step2-reminder");
        const reminderText = document.getElementById("step2-reminder-text");
        if (!hasSeats && !hasTime) {
          reminderText.textContent = "Please choose your seat(s) and a showtime before proceeding to Payment Details.";
        } else if (!hasSeats) {
          reminderText.textContent = "Please select at least one seat on the seating chart before proceeding.";
        } else {
          reminderText.textContent = "Please select a showtime before proceeding.";
        }
        if (reminder) {
          reminder.style.display = "flex";
          reminder.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        return;
      }

      // Valid: clear reminder and navigate to Step 3
      const reminder = document.getElementById("step2-reminder");
      if (reminder) reminder.style.display = "none";
      goToStep(3);
    });
  }

  // Step 3 -> Step 2
  const backTo2 = document.getElementById("btn-back-step2");
  if (backTo2) {
    backTo2.addEventListener("click", () => goToStep(2));
  }

  // Step 3: Payment inputs validation listeners
  const paymentInputs = [
    document.getElementById("pay-email"),
    document.getElementById("pay-card"),
    document.getElementById("pay-expiry"),
    document.getElementById("pay-cvv")
  ];

  paymentInputs.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        input.classList.remove("input-error");
      }
      // If all inputs are filled, hide the reminder banner
      const allFilled = paymentInputs.every((inp) => inp && inp.value.trim() !== "");
      const reminder = document.getElementById("payment-reminder");
      if (allFilled && reminder) {
        reminder.style.display = "none";
      }
    });
  });

  // Step 3: Shopping cart checkout button
  const cartBtn = document.getElementById("btn-cart-checkout");
  if (cartBtn) {
    cartBtn.addEventListener("click", handleCheckout);
  }

  // Step 3: Download ticket button
  const downloadBtn = document.getElementById("btn-download-ticket");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", handleDownloadTicket);
  }

  // Step 3: Start New Booking button
  const startOverBtn = document.getElementById("btn-start-over");
  if (startOverBtn) {
    startOverBtn.addEventListener("click", resetPrototype);
  }
}

// Setup Hamburger Drawer Navigation
function setupHamburgerMenu() {
  const menuBtn = document.getElementById("btn-menu-toggle");
  const closeBtn = document.getElementById("btn-close-drawer");
  const backdrop = document.getElementById("drawer-backdrop");
  const drawer = document.getElementById("cineplex-drawer");

  function openDrawer() {
    if (drawer) drawer.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

// Update summary texts
function updateSummary() {
  const movieText = appState.selectedMovie ? appState.selectedMovie.title : "(None selected)";
  const locText = appState.selectedLocation ? appState.selectedLocation.name : "(None selected)";
  const seatsText = appState.selectedSeats.length > 0 ? appState.selectedSeats.join(", ") : "(None selected)";
  const timeText = appState.selectedTime ? appState.selectedTime.time : "(None selected)";

  document.querySelectorAll(".sum-movie").forEach((el) => (el.textContent = movieText));
  document.querySelectorAll(".sum-loc").forEach((el) => (el.textContent = locText));
  document.querySelectorAll(".sum-seats").forEach((el) => (el.textContent = seatsText));
  document.querySelectorAll(".sum-time").forEach((el) => (el.textContent = timeText));
}

// Handle Checkout submit
function handleCheckout(e) {
  e.preventDefault();

  const emailInput = document.getElementById("pay-email");
  const cardInput = document.getElementById("pay-card");
  const expiryInput = document.getElementById("pay-expiry");
  const cvvInput = document.getElementById("pay-cvv");
  const reminder = document.getElementById("payment-reminder");
  const reminderText = document.getElementById("payment-reminder-text");
  const confirmBox = document.getElementById("confirmation-box");
  const details = document.getElementById("confirmation-details");

  // Check required fields
  const missing = [];

  if (!emailInput || !emailInput.value.trim()) {
    missing.push("email address");
    if (emailInput) emailInput.classList.add("input-error");
  } else {
    if (emailInput) emailInput.classList.remove("input-error");
  }

  if (!cardInput || !cardInput.value.trim()) {
    missing.push("card number");
    if (cardInput) cardInput.classList.add("input-error");
  } else {
    if (cardInput) cardInput.classList.remove("input-error");
  }

  if (!expiryInput || !expiryInput.value.trim()) {
    missing.push("expiry date");
    if (expiryInput) expiryInput.classList.add("input-error");
  } else {
    if (expiryInput) expiryInput.classList.remove("input-error");
  }

  if (!cvvInput || !cvvInput.value.trim()) {
    missing.push("CVV");
    if (cvvInput) cvvInput.classList.add("input-error");
  } else {
    if (cvvInput) cvvInput.classList.remove("input-error");
  }

  // If any fields are missing, block checkout and remind user
  if (missing.length > 0) {
    if (reminder) {
      if (reminderText) {
        if (missing.length === 4) {
          reminderText.textContent = "Please fill out the email address, card number, expiry date, and CVV before checking out.";
        } else {
          reminderText.textContent = "Please fill out the following before checking out: " + missing.join(", ") + ".";
        }
      }
      reminder.style.display = "flex";
      reminder.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Focus first unfilled field
    if (emailInput && !emailInput.value.trim()) {
      emailInput.focus();
    } else if (cardInput && !cardInput.value.trim()) {
      cardInput.focus();
    } else if (expiryInput && !expiryInput.value.trim()) {
      expiryInput.focus();
    } else if (cvvInput && !cvvInput.value.trim()) {
      cvvInput.focus();
    }

    return;
  }

  // Hide reminder if all valid
  if (reminder) {
    reminder.style.display = "none";
  }

  const movie = appState.selectedMovie ? appState.selectedMovie.title : "Crystal Horizon";
  const loc = appState.selectedLocation ? appState.selectedLocation.name : "Downtown Cinema";
  const seats = appState.selectedSeats.length > 0 ? appState.selectedSeats.join(", ") : "D3, D4";
  const time = appState.selectedTime ? appState.selectedTime.time : "6:15 PM";
  const email = emailInput.value.trim();
  const cardVal = cardInput.value.trim();
  const lastFour = cardVal.replace(/\s+/g, "").slice(-4) || "••••";

  details.innerHTML = `
    <p><strong>Movie:</strong> ${movie}</p>
    <p><strong>Location:</strong> ${loc}</p>
    <p><strong>Selected Seats:</strong> ${seats}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Payment Method:</strong> Card ending in ${lastFour}</p>
    <p><strong>Order Status:</strong> Confirmed &amp; Paid via Wireframe Checkout</p>
  `;

  confirmBox.classList.add("active");
  confirmBox.scrollIntoView({ behavior: "smooth" });
}

// Handle Ticket Download
function handleDownloadTicket() {
  const movie = appState.selectedMovie ? appState.selectedMovie.title : "Crystal Horizon";
  const loc = appState.selectedLocation ? appState.selectedLocation.name : "Downtown Cinema";
  const seats = appState.selectedSeats.length > 0 ? appState.selectedSeats.join(", ") : "D3, D4";
  const time = appState.selectedTime ? appState.selectedTime.time : "6:15 PM";
  const emailInput = document.getElementById("pay-email");
  const email = emailInput && emailInput.value ? emailInput.value.trim() : "customer@example.com";

  const ticketContent = `==============================================
             CINEMA TICKET RECEIPT
==============================================
Movie:     ${movie}
Location:  ${loc}
Seats:     ${seats}
Showtime:  ${time}
Customer:  ${email}
Status:    CONFIRMED & PAID
Date:      ${new Date().toLocaleDateString()}
==============================================
Enjoy your movie! Thank you for testing the prototype.`;

  const blob = new Blob([ticketContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ticket-${movie.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const downloadBtn = document.getElementById("btn-download-ticket");
  if (downloadBtn) {
    downloadBtn.textContent = "✓ Ticket Downloaded!";
    setTimeout(() => {
      downloadBtn.textContent = "Download Your Ticket";
    }, 2500);
  }
}

// Reset prototype back to initial step 1 state
function resetPrototype() {
  appState.selectedMovie = null;
  appState.selectedLocation = null;
  appState.selectedSeats = [];
  appState.selectedTime = null;

  document.querySelectorAll(".movie-card").forEach((c) => c.classList.remove("selected"));
  document.querySelectorAll("#location-list .selection-item").forEach((i) => i.classList.remove("selected"));
  document.querySelectorAll("#time-list .selection-item").forEach((i) => i.classList.remove("selected"));
  document.querySelectorAll(".seat").forEach((s) => {
    if (!occupiedSeats.includes(s.dataset.seat)) {
      s.classList.remove("selected");
    }
  });

  // Hide location panel until a movie is selected
  const locPanel = document.getElementById("location-panel");
  if (locPanel) locPanel.classList.remove("visible");

  // Hide all step validation reminders
  const step1Reminder = document.getElementById("step1-reminder");
  if (step1Reminder) step1Reminder.style.display = "none";
  const step2Reminder = document.getElementById("step2-reminder");
  if (step2Reminder) step2Reminder.style.display = "none";
  const paymentReminder = document.getElementById("payment-reminder");
  if (paymentReminder) paymentReminder.style.display = "none";

  const confirmBox = document.getElementById("confirmation-box");
  if (confirmBox) confirmBox.classList.remove("active");

  const downloadBtn = document.getElementById("btn-download-ticket");
  if (downloadBtn) downloadBtn.textContent = "Download Your Ticket";

  const emailInput = document.getElementById("pay-email");
  if (emailInput) {
    emailInput.value = "";
    emailInput.classList.remove("input-error");
  }
  const cardInput = document.getElementById("pay-card");
  if (cardInput) {
    cardInput.value = "";
    cardInput.classList.remove("input-error");
  }
  const expiryInput = document.getElementById("pay-expiry");
  if (expiryInput) {
    expiryInput.value = "";
    expiryInput.classList.remove("input-error");
  }
  const cvvInput = document.getElementById("pay-cvv");
  if (cvvInput) {
    cvvInput.value = "";
    cvvInput.classList.remove("input-error");
  }

  goToStep(1);
}

// Expose resetPrototype globally
window.resetPrototype = resetPrototype;

