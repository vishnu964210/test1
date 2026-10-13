// ========================================
// SYNTRAXS HOSPITAL - APPOINTMENT SYSTEM
// ========================================

let appointments = [];

try {
    appointments = JSON.parse(localStorage.getItem("syntaxsAppointments")) || [];
} catch (error) {
    appointments = [];
}

const appointmentForm = document.getElementById("appointmentForm");
const successMessage = document.getElementById("successMessage");
const confirmationText = document.getElementById("confirmationText");
const appointmentsList = document.getElementById("appointmentsList");

if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const patientName = document.getElementById("patientName").value.trim();
        const doctor = document.getElementById("doctorSelect").value;
        const problem = document.getElementById("problem").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        if (!patientName || !doctor || !problem || !date || !time) {
            alert("Please fill in all appointment details.");
            return;
        }

        const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
            day: "2-digit", month: "long", year: "numeric"
        });

        const newAppointment = {
            id: Date.now(),
            patientName,
            doctor,
            problem,
            date: formattedDate,
            time,
            status: "Confirmed"
        };

        appointments.push(newAppointment);
        saveAppointments();

        if (successMessage) successMessage.classList.add("show");
        if (confirmationText) {
            confirmationText.textContent = "Appointment for " + patientName +
                " with " + doctor + " has been booked successfully.";
        }

        displayAppointments();
        appointmentForm.reset();

        if (successMessage) {
            successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
}

function saveAppointments() {
    try {
        localStorage.setItem("syntaxsAppointments", JSON.stringify(appointments));
    } catch (error) {
        console.error("Could not save appointments:", error);
        alert("Your browser could not save the appointment. Please check browser storage settings.");
    }
}

function displayAppointments() {
    if (!appointmentsList) return;

    if (appointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="empty-appointments">
                <div class="empty-icon">📅</div>
                <h3>No Appointments Yet</h3>
                <p>Book an appointment and it will appear here.</p>
                <a href="#book" class="btn primary">Book Appointment</a>
            </div>`;
        return;
    }

    appointmentsList.innerHTML = "";
    appointments.forEach(function (appointment, index) {
        const card = document.createElement("div");
        card.className = "appointment-card";
        card.innerHTML = `
            <div class="appointment-top">
                <span class="appointment-number">APPOINTMENT #${index + 1}</span>
                <span class="appointment-status">${escapeHTML(appointment.status || "Confirmed")}</span>
            </div>
            <h3>${escapeHTML(appointment.patientName)}</h3>
            <p class="appointment-doctor">${escapeHTML(appointment.doctor)}</p>
            <div class="appointment-detail"><span>Date</span><strong>${escapeHTML(appointment.date)}</strong></div>
            <div class="appointment-detail"><span>Time</span><strong>${escapeHTML(appointment.time)}</strong></div>
            <div class="problem-text"><strong>Patient Problem</strong><br><br>${escapeHTML(appointment.problem)}</div>
            <button class="cancel-btn" type="button" onclick="cancelAppointment(${Number(appointment.id)})">Cancel Appointment</button>`;
        appointmentsList.appendChild(card);
    });
}

function cancelAppointment(id) {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    appointments = appointments.filter(function (appointment) {
        return Number(appointment.id) !== Number(id);
    });
    saveAppointments();
    displayAppointments();
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
}

// ========================================
// BILLING / PAYMENT FLOW (DEMO ONLY)
// ========================================

let returnHomeTimer = null;

const billCard = document.querySelector(".bill-card");
const billingPage = document.getElementById("billingPage");
const paymentSuccess = document.getElementById("paymentSuccess");
const paymentForm = document.getElementById("paymentForm");
const paymentExtraFields = document.getElementById("paymentExtraFields");
const billStatus = document.querySelector(".bill-status");
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

function openBillingPage() {
    if (returnHomeTimer) { clearTimeout(returnHomeTimer); returnHomeTimer = null; }
    if (billCard) billCard.hidden = true;
    if (billingPage) billingPage.hidden = false;
    if (paymentSuccess) paymentSuccess.hidden = true;
    if (billingPage) billingPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeBillingPage() {
    if (billingPage) billingPage.hidden = true;
    if (billCard) billCard.hidden = false;
    if (billCard) billCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

paymentMethods.forEach(function (radio) {
    radio.addEventListener("change", function () {
        if (!paymentExtraFields) return;
        const method = radio.value;
        if (method === "UPI") {
            paymentExtraFields.innerHTML = `
                <label for="upiId">UPI ID (optional for this demo)</label>
                <input id="upiId" type="text" placeholder="name@bank">`;
        } else if (method === "Card") {
            paymentExtraFields.innerHTML = `
                <label for="cardName">Demo cardholder name</label>
                <input id="cardName" type="text" autocomplete="off" placeholder="Enter a test name">
                <label for="cardNumber">Demo card number</label>
                <input id="cardNumber" type="text" inputmode="numeric" autocomplete="off" maxlength="19" placeholder="Use any 16 digits for this demo">
                <small class="payment-note">Do not enter real card details. This demo does not contact a bank.</small>`;
        } else {
            paymentExtraFields.innerHTML = `
                <p class="cash-info">You selected cash. In a real hospital, payment would be completed at the billing counter.</p>`;
        }
    });
});

if (paymentForm) {
    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const selected = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selected) {
            alert("Please select UPI, Card, or Cash.");
            return;
        }

        // Validate demo fields only; no real payment details are sent or charged.
        const method = selected.value;
        if (method === "UPI") {
            const upiInput = document.getElementById("upiId");
            const upiValue = upiInput ? upiInput.value.trim() : "";
            if (upiValue && !/^[A-Za-z0-9._-]{2,}@[A-Za-z0-9.-]{2,}$/.test(upiValue)) {
                alert("Please enter a valid demo UPI ID (for example, name@bank) or leave it blank.");
                if (upiInput) upiInput.focus();
                return;
            }
        }
        if (method === "Card") {
            const cardNameInput = document.getElementById("cardName");
            const cardNumberInput = document.getElementById("cardNumber");
            const cardName = cardNameInput ? cardNameInput.value.trim() : "";
            const cardNumber = cardNumberInput ? cardNumberInput.value.replace(/\\s+/g, "") : "";
            if (!cardName) {
                alert("Please enter a demo cardholder name.");
                if (cardNameInput) cardNameInput.focus();
                return;
            }
            if (!/^\\d{16}$/.test(cardNumber)) {
                alert("For this demo, enter exactly 16 digits (not a real card number).");
                if (cardNumberInput) cardNumberInput.focus();
                return;
            }
        }

        // This is a front-end demonstration only; no money is charged.
        try {
            localStorage.setItem("syntaxsBillPayment", JSON.stringify({
                amount: 2300,
                method: method,
                status: "Demo payment recorded",
                date: new Date().toISOString()
            }));
        } catch (error) {
            console.warn("Payment demo status could not be saved.", error);
        }

        if (billStatus) {
            billStatus.textContent = method === "Cash" ? "CASH SELECTED" : "PAID (DEMO)";
        }
        if (billCard) billCard.hidden = true;
        if (billingPage) billingPage.hidden = true;
        if (paymentSuccess) paymentSuccess.hidden = false;

        const successText = document.getElementById("paymentSuccessText");
        const successTitle = paymentSuccess ? paymentSuccess.querySelector("h3") : null;
        if (successTitle) successTitle.textContent = method === "Cash" ? "Cash Payment Selected" : "Payment Successful!";
        if (successText) {
            successText.textContent = method === "Cash"
                ? "Please pay ₹2,300 at the hospital billing counter. Cash has not been collected or verified."
                : "Your ₹2,300 " + method + " selection was recorded in this demo. No real payment was processed and no money was charged.";
        }

        if (paymentSuccess) paymentSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
        if (returnHomeTimer) clearTimeout(returnHomeTimer);
        returnHomeTimer = window.setTimeout(returnHomeNow, 4000);
    });
}

function returnHomeNow() {
    if (returnHomeTimer) { clearTimeout(returnHomeTimer); returnHomeTimer = null; }
    if (paymentSuccess) paymentSuccess.hidden = true;
    if (billingPage) billingPage.hidden = true;
    if (billCard) billCard.hidden = false;
    if (paymentForm) paymentForm.reset();
    const extraFields = document.getElementById("paymentExtraFields");
    if (extraFields) extraFields.innerHTML = "";
    window.location.hash = "home";
    const home = document.getElementById("home");
    if (home) home.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Prevent selecting dates in the past, using the browser's local date.
const dateInput = document.getElementById("date");
if (dateInput) {
    const now = new Date();
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString().split("T")[0];
    dateInput.min = localToday;
}

displayAppointments();



// ========================================
// DOCTOR CAROUSEL: SEAMLESS AUTO-SCROLL
// Pauses when the visitor interacts with it.
// ========================================
(function initDoctorAutoScroll() {
    const scroller = document.querySelector(".doctor-scroller");
    if (!scroller || scroller.dataset.autoScrollReady === "true") return;

    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const originalCards = Array.from(scroller.children);
    if (originalCards.length < 2) return;

    // Duplicate the original cards once to create a seamless looping track.
    originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        scroller.appendChild(clone);
    });

    scroller.dataset.autoScrollReady = "true";
    scroller.setAttribute("aria-label", "Doctors. Scroll or swipe to browse specialists.");
    scroller.setAttribute("tabindex", "0");

    let paused = false;
    let frameId = null;
    let previousTime = 0;
    const speed = 28; // pixels per second

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };

    scroller.addEventListener("mouseenter", pause);
    scroller.addEventListener("mouseleave", resume);
    scroller.addEventListener("focusin", pause);
    scroller.addEventListener("focusout", resume);
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("touchend", () => {
        window.setTimeout(resume, 1200);
    }, { passive: true });
    scroller.addEventListener("pointerdown", pause);
    scroller.addEventListener("pointerup", () => {
        window.setTimeout(resume, 1200);
    });

    function animate(time) {
        if (!previousTime) previousTime = time;
        const elapsed = Math.min((time - previousTime) / 1000, 0.05);
        previousTime = time;

        if (!paused) {
            scroller.scrollLeft += speed * elapsed;

            // Half the content is the original cards; reset at the duplicate boundary.
            const loopPoint = scroller.scrollWidth / 2;
            if (loopPoint > 0 && scroller.scrollLeft >= loopPoint) {
                scroller.scrollLeft -= loopPoint;
            }
        }
        frameId = window.requestAnimationFrame(animate);
    }

    frameId = window.requestAnimationFrame(animate);

    // Stop the animation when the page is hidden to save resources.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (frameId) window.cancelAnimationFrame(frameId);
            frameId = null;
        } else if (!frameId) {
            previousTime = 0;
            frameId = window.requestAnimationFrame(animate);
        }
    });
})();



// ========================================
// PAGE REVEAL MOTION: smooth entrance on scroll
// Content remains visible if IntersectionObserver is unavailable.
// ========================================
(function initScrollReveal() {
    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const revealTargets = document.querySelectorAll(
        ".about-section, .doctors-section, .booking-section, .appointments-section, .bill-section, .booking-info, .booking-form, .bill-card"
    );
    if (!revealTargets.length || !("IntersectionObserver" in window)) return;

    revealTargets.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    });
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver((entries, activeObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                activeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach((element) => observer.observe(element));
})();
