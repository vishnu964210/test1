
/* =========================================================
   SYNTRAXS HOSPITAL — COMPLETE JAVASCRIPT
   Home | Departments | Doctors | Appointments | Billing
   Receipts | Admin Dashboard | Local Storage
========================================================= */

/* ==================== DEPARTMENTS ==================== */

const depts = [
  ['General Medicine', '🩺', 'Everyday health, checkups and chronic care.'],
  ['Cardiology', '💙', 'Heart health, diagnostics and cardiac care.'],
  ['Neurology', '🧠', 'Brain, spine and nervous system care.'],
  ['Orthopedics', '🦴', 'Bone, joint, sports and mobility care.'],
  ['Pediatrics', '🧸', 'Thoughtful care for infants and children.'],
  ['Obstetrics & Gynecology', '🌸', 'Women’s health, maternity and wellness.'],
  ['Oncology', '🎗️', 'Cancer diagnosis and multidisciplinary care.'],
  ['Dermatology', '✨', 'Skin, hair and nail health.'],
  ['Ophthalmology', '👁️', 'Vision, eye health and treatment.'],
  ['ENT', '👂', 'Ear, nose and throat care.'],
  ['Psychiatry', '🧩', 'Mental wellness and psychiatric support.'],
  ['Gastroenterology', '🫁', 'Digestive health, liver and gut care.'],
  ['Pulmonology', '🌬️', 'Lung health and breathing conditions.'],
  ['Nephrology', '💧', 'Kidney health and renal care.'],
  ['Urology', '➕', 'Urinary tract and men’s health.'],
  ['Endocrinology', '⚖️', 'Hormones, thyroid and diabetes care.'],
  ['Dentistry', '🦷', 'Preventive, restorative and oral care.'],
  ['Emergency & Trauma', '🚑', 'Urgent assessment and emergency treatment.'],
  ['Radiology & Imaging', '🔬', 'Diagnostic imaging and scan services.'],
  ['Pathology & Laboratory', '🧪', 'Lab tests and diagnostic services.'],
  ['Anesthesiology', '💉', 'Anesthesia, pain and perioperative care.'],
  ['Physiotherapy & Rehab', '🏃', 'Recovery, movement and rehabilitation.'],
  ['Infectious Diseases', '🦠', 'Complex infections and antimicrobial care.'],
  ['Plastic & Reconstructive Surgery', '🩹', 'Reconstructive and specialist surgical care.']
];

/* ==================== DOCTOR DATA ==================== */

const firstNames = [
  'Aarav', 'Meera', 'Arjun', 'Ananya', 'Rohan', 'Ishita',
  'Kabir', 'Diya', 'Vihaan', 'Sana', 'Aditya', 'Nisha',
  'Karan', 'Priya', 'Rahul', 'Aditi', 'Dev', 'Mira',
  'Neil', 'Tara', 'Ibrahim', 'Kavya', 'Vikram', 'Leena'
];

const surnames = [
  'Sharma', 'Reddy', 'Mehta', 'Rao', 'Kapoor', 'Nair',
  'Iyer', 'Patel', 'Malhotra', 'Desai', 'Kulkarni', 'Chowdhury'
];

const qualifications = [
  'MD, DM',
  'MBBS, MD',
  'MBBS, MS',
  'MD, DNB',
  'MBBS, Fellowship'
];

const bios = [
  'Known for a clear, patient-first approach and evidence-based treatment plans.',
  'Combines specialist expertise with thoughtful communication and collaborative care.',
  'Focused on accurate diagnosis, personalized treatment, and long-term wellbeing.'
];

const slots = [
  'Mon–Fri · 9:00 AM–2:00 PM',
  'Mon–Sat · 10:00 AM–4:00 PM',
  'Tue–Sat · 11:00 AM–6:00 PM'
];

const doctors = [];

depts.forEach((department, i) => {
  for (let j = 0; j < 3; j++) {
    const idx = i * 3 + j;
    const first = firstNames[idx % firstNames.length];
    const last = surnames[(idx * 3 + j + i) % surnames.length];

    doctors.push({
      id: idx + 1,
      name: `Dr. ${first} ${last}`,
      dept: department[0],
      qual: qualifications[(i + j) % qualifications.length],
      exp: 6 + ((i * 3 + j * 5) % 19),
      fee: 600 + ((i * 3 + j) % 5) * 150,
      slot: slots[(i + j) % slots.length],
      bio: bios[(i + j) % bios.length],
      languages: j === 2 ? 'English, Hindi, Telugu' : 'English, Telugu',
      education: [
        'AIIMS New Delhi',
        'NIMS Hyderabad',
        'Christian Medical College, Vellore',
        'JIPMER Puducherry'
      ][(i + j) % 4],
      registration: 'SYN-MED-' + String(1000 + idx),
      avatar: first[0] + last[0],
      rating: (4.7 + ((i + j) % 3) * 0.1).toFixed(1),
      patients: 900 + idx * 73,
      icon: department[1]
    });
  }
});

/* ==================== APPLICATION STATE ==================== */

let currentDoctor = null;
let selectedDept = 'all';
let lastReceipt = null;

/* ==================== GENERAL HELPERS ==================== */

function $(id) {
  return document.getElementById(id);
}

function money(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function readStorage(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getAppointments() {
  return readStorage('appointments');
}

function getBills() {
  return readStorage('bills');
}

/* ==================== NAVIGATION ==================== */

function go(page) {
  const pages = {
    home: 'homePage',
    departments: 'directoryPage',
    doctors: 'directoryPage',
    profile: 'profilePage',
    appointments: 'appointmentsPage',
    billing: 'billingPage',
    receipt: 'receiptPage',
    admin: 'adminPage'
  };

  document.querySelectorAll(
    '#homePage, #directoryPage, #profilePage, ' +
    '#appointmentsPage, #billingPage, #receiptPage, #adminPage'
  ).forEach(element => element.classList.add('hide'));

  const target = $(pages[page] || 'homePage');

  if (target) {
    target.classList.remove('hide');
  }

  document.querySelectorAll('[data-nav]').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.nav === page ||
      (page === 'profile' && button.dataset.nav === 'doctors')
    );
  });

  if (page === 'departments' || page === 'doctors') {
    $('directoryTitle').textContent =
      page === 'departments'
        ? 'Departments & specialists'
        : 'Meet our doctors';

    if (page === 'doctors') {
      selectedDept = 'all';
      $('searchInput').value = '';
      $('deptFilter').value = 'all';
      $('sortFilter').value = 'name';
    } else {
      $('deptFilter').value = selectedDept;
    }

    renderDirectory();
  }

  if (page === 'appointments') {
    renderAppointments();
  }

  if (page === 'billing') {
    updateBill();
  }

  if (page === 'admin') {
    renderAdmin();
    showAdminTab('overview');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==================== DEPARTMENT CARDS ==================== */

function deptCard(department) {
  const selected = selectedDept === department[0];

  return `
    <button class="dept ${selected ? 'selected' : ''}"
      onclick="chooseDept('${escapeHTML(department[0])}')">
      <div class="depticon">${department[1]}</div>
      <h3>${escapeHTML(department[0])}</h3>
      <p>${escapeHTML(department[2])}</p>
      <span class="count">
        ${doctors.filter(d => d.dept === department[0]).length}
        SPECIALISTS · VIEW TEAM →
      </span>
    </button>
  `;
}

/* ==================== DOCTOR CARDS ==================== */

function doctorCard(d) {
  return `
    <article class="doctor">
      <div class="doctor-top">
        <div class="avatar">${escapeHTML(d.avatar)}</div>
        <span class="available">● AVAILABLE</span>
      </div>

      <div class="doctor-body">
        <h3>${escapeHTML(d.name)}</h3>
        <div class="role">${escapeHTML(d.dept)}</div>

        <p class="bio">
          ${escapeHTML(d.qual)} · ${d.exp} years of experience.
          ${escapeHTML(d.bio)}
        </p>

        <div class="tags">
          <span class="tag">★ ${escapeHTML(d.rating)}</span>
          <span class="tag">${d.exp}+ yrs exp.</span>
          <span class="tag">${escapeHTML(d.education)}</span>
        </div>

        <div class="docfoot">
          <div class="fee">
            ${money(d.fee)}
            <small>Consultation fee</small>
          </div>
          <button class="primary" onclick="showDoctor(${d.id})">
            View profile ↗
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ==================== HOME PAGE ==================== */

function renderHome() {
  if ($('homeDepts')) {
    $('homeDepts').innerHTML = depts
      .slice(0, 8)
      .map(deptCard)
      .join('');
  }

  if ($('homeDoctors')) {
    $('homeDoctors').innerHTML = doctors
      .slice(0, 3)
      .map(doctorCard)
      .join('');
  }
}

/* ==================== DIRECTORY & SEARCH ==================== */

function renderDirectory() {
  if (!$('allDepts') || !$('allDoctors')) return;

  const query = ($('searchInput')?.value || '').toLowerCase();
  const dept = $('deptFilter')?.value || 'all';
  const sort = $('sortFilter')?.value || 'name';

  const filteredDepts = depts.filter(d =>
    (dept === 'all' || d[0] === dept) &&
    (!query || `${d[0]} ${d[2]}`.toLowerCase().includes(query))
  );

  $('allDepts').innerHTML = filteredDepts.map(deptCard).join('');

  const filteredDoctors = doctors.filter(d =>
    (dept === 'all' || d.dept === dept) &&
    (selectedDept === 'all' || d.dept === selectedDept) &&
    (!query ||
      `${d.name} ${d.dept} ${d.qual} ${d.education}`
        .toLowerCase().includes(query))
  );

  if (sort === 'fee') {
    filteredDoctors.sort((a, b) => a.fee - b.fee);
  } else if (sort === 'experience') {
    filteredDoctors.sort((a, b) => b.exp - a.exp);
  } else {
    filteredDoctors.sort((a, b) => a.name.localeCompare(b.name));
  }

  $('allDoctors').innerHTML = filteredDoctors.length
    ? filteredDoctors.map(doctorCard).join('')
    : '<div class="empty">No matches found. Try another search or department.</div>';
}

function chooseDept(name) {
  selectedDept = selectedDept === name ? 'all' : name;

  go('departments');

  if ($('deptFilter')) {
    $('deptFilter').value = selectedDept;
  }

  renderDirectory();

  $('allDoctors')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/* ==================== DOCTOR PROFILE ==================== */

function showDoctor(id) {
  currentDoctor = doctors.find(d => d.id === Number(id));

  if (!currentDoctor) return;

  const d = currentDoctor;

  $('profileContent').innerHTML = `
    <div class="panel">
      <div class="profilehead">
        <div class="bigavatar">${escapeHTML(d.avatar)}</div>

        <div style="flex:1">
          <div class="eyebrow">
            ${d.icon} ${escapeHTML(d.dept)}
          </div>

          <h1>${escapeHTML(d.name)}</h1>

          <p>
            ${escapeHTML(d.qual)} ·
            ${d.exp} years of clinical experience
          </p>

          <div class="tags">
            <span class="tag">★ ${escapeHTML(d.rating)} patient rating</span>
            <span class="tag">${d.patients.toLocaleString('en-IN')}+ consultations</span>
            <span class="tag">Profile</span>
          </div>
        </div>

        <div>
          <div class="fee" style="font-size:25px">
            ${money(d.fee)}
            <small>Consultation fee</small>
          </div>

          <button class="primary" style="margin-top:12px"
            onclick="bookDoctor(${d.id})">
            Book appointment →
          </button>
        </div>
      </div>
    </div>

    <div class="profilegrid">
      <section class="panel">
        <h3>About the doctor</h3>
        <p style="color:var(--muted)">
          ${escapeHTML(d.bio)}
        </p>

        ${[
          ['Specialty', d.dept],
          ['Qualifications', d.qual],
          ['Medical education', d.education],
          ['Registration ID', d.registration],
          ['Languages', d.languages],
          ['Clinical experience', d.exp + ' years'],
          ['Consultation hours', d.slot]
        ].map(([label, value]) => `
          <div class="infoitem">
            <small>${escapeHTML(label)}</small>
            <strong>${escapeHTML(value)}</strong>
          </div>
        `).join('')}
      </section>

      <aside class="bookbox">
        <h3>Book a consultation</h3>
        <p class="smallmuted">Choose your preferred date and visit type.</p>

        <div class="field">
          <label>Appointment date</label>
          <input id="apptDate" type="date"
            min="${new Date().toISOString().slice(0, 10)}">
        </div>

        <div class="field">
          <label>Visit type</label>
          <select id="apptType">
            <option>In-person consultation</option>
            <option>Video consultation</option>
            <option>Follow-up visit</option>
          </select>
        </div>

        <div class="field">
          <label>Patient name</label>
          <input id="apptName" placeholder="Your full name">
        </div>

        <button class="primary" style="width:100%"
          onclick="bookDoctor(${d.id})">
          Continue to billing · ${money(d.fee)}
        </button>
      </aside>
    </div>
  `;

  go('profile');
}

function bookDoctor(id) {
  const d = doctors.find(doc => doc.id === Number(id));

  if (!d) return;

  currentDoctor = d;

  const patientName = $('apptName')?.value.trim() || '';

  if ($('patientName')) {
    $('patientName').value = patientName;
  }

  if ($('billDoctor')) {
    $('billDoctor').value = String(d.id);
  }

  if ($('billService')) {
    $('billService').value = 'consult';
  }

  updateBill();
  go('billing');
}

/* ==================== APPOINTMENT FORM ==================== */

function updateAppointmentDoctors() {
  const department = $('appointmentDept')?.value;
  const select = $('appointmentDoctor');

  if (!select) return;

  const previous = select.value;

  select.replaceChildren();

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Select doctor';
  select.appendChild(placeholder);

  doctors.filter(d => d.dept === department).forEach(d => {
    const option = document.createElement('option');
    option.value = d.id;
    option.textContent = `${d.name} — ${money(d.fee)}`;
    select.appendChild(option);
  });

  if ([...select.options].some(o => o.value === previous)) {
    select.value = previous;
  }
}

function saveAppointment() {
  const patient = $('appointmentPatient').value.trim();
  const department = $('appointmentDept').value;
  const doctorId = Number($('appointmentDoctor').value);
  const doctor = doctors.find(d => d.id === doctorId);
  const date = $('appointmentDate').value;
  const time = $('appointmentTime').value;

  if (!patient || !doctor || !date) {
    alert('Please enter your name, choose a doctor, and select a date.');
    return;
  }

  if (date < new Date().toISOString().slice(0, 10)) {
    alert('Please select today or a future date.');
    return;
  }

  const appointments = getAppointments();

  const conflict = appointments.some(a =>
    Number(a.doctorId) === doctorId &&
    a.date === date &&
    a.time === time &&
    !['Cancelled', 'Completed'].includes(a.status)
  );

  if (conflict) {
    alert('This demo time slot is already booked. Choose another time.');
    return;
  }

  const appointment = {
    id: Date.now(),
    patient,
    department,
    doctor: doctor.name,
    doctorId,
    date,
    time,
    visitType: $('appointmentVisit').value.trim(),
    reason: $('appointmentReason').value.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  appointments.push(appointment);
  writeStorage('appointments', appointments);

  $('appointmentPatient').value = '';
  $('appointmentReason').value = '';

  renderAppointments();
  renderAdmin();

  alert('Appointment saved successfully.');
}

function renderAppointments() {
  const container = $('appointmentList');

  if (!container) return;

  const appointments = getAppointments();

  container.replaceChildren();

  if (!appointments.length) {
    container.textContent = 'No appointments booked yet.';
    return;
  }

  appointments.slice().reverse().forEach(a => {
    const card = document.createElement('div');
    card.className = 'appointment-card';

    const heading = document.createElement('h3');
    heading.textContent = a.doctor || 'Doctor not specified';

    const details = document.createElement('p');
    details.textContent =
      `${a.patient} · ${a.department} · ${a.date} · ${a.time}`;

    const visit = document.createElement('p');
    visit.textContent = `Visit: ${a.visitType || 'Not specified'}`;

    const status = document.createElement('p');
    status.textContent = `Status: ${a.status || 'Pending'}`;

    card.append(heading, details, visit, status);
    container.appendChild(card);
  });
}

/* ==================== BILLING ==================== */

function updateBill() {
  if (!$('billService')) return;

  const prices = {
    consult: 800,
    lab: 1250,
    scan: 2200,
    room: 3500,
    pharmacy: 650,
    custom: 1000
  };

  const serviceType = $('billService').value;
  const basePrice = prices[serviceType] ?? 800;
  const doctorId = Number($('billDoctor')?.value);
  const doctor = doctors.find(d => d.id === doctorId);

  const service =
    doctor && serviceType === 'consult'
      ? doctor.fee
      : basePrice;

  const facility = 100;
  const extra = Math.max(0, Number($('extraCharge')?.value) || 0);
  const tax = Math.round((service + facility + extra) * 0.05);
  const total = service + facility + extra + tax;

  $('servicePrice').textContent = money(service);
  $('facilityPrice').textContent = money(facility);
  $('extraPrice').textContent = money(extra);
  $('taxPrice').textContent = money(tax);
  $('totalPrice').textContent = money(total);

  return { service, facility, extra, tax, total };
}

function payBill() {
  const patient = $('patientName').value.trim();

  if (!patient) {
    alert('Please enter the patient name to continue.');
    $('patientName').focus();
    return;
  }

  const totals = updateBill();

  if (!totals) return;

  const doctorId = Number($('billDoctor').value);
  const doctor = doctors.find(d => d.id === doctorId);

  const receiptId = $('patientId').value.trim() ||
    'SYN-' + Date.now().toString().slice(-8);

  lastReceipt = {
    name: patient,
    id: receiptId,
    total: money(totals.total),
    service: $('billService').selectedOptions[0].textContent.trim(),
    doctor: doctor ? doctor.name : 'Not specified',
    method: $('payMethod').value.trim(),
    date: new Date().toLocaleString('en-IN')
  };

  const bills = getBills();

  bills.push({
    id: lastReceipt.id,
    patient: lastReceipt.name,
    service: lastReceipt.service,
    doctor: lastReceipt.doctor,
    amount: totals.total,
    method: lastReceipt.method,
    status: 'Paid',
    date: lastReceipt.date
  });

  writeStorage('bills', bills);

  $('receiptDetails').innerHTML = `
    <div class="billrow">
      <span>Receipt reference</span>
      <strong>${escapeHTML(lastReceipt.id)}</strong>
    </div>
    <div class="billrow">
      <span>Patient</span>
      <strong>${escapeHTML(lastReceipt.name)}</strong>
    </div>
    <div class="billrow">
      <span>Service</span>
      <strong>${escapeHTML(lastReceipt.service)}</strong>
    </div>
    <div class="billrow">
      <span>Doctor</span>
      <strong>${escapeHTML(lastReceipt.doctor)}</strong>
    </div>
    <div class="billrow">
      <span>Payment method</span>
      <strong>${escapeHTML(lastReceipt.method)}</strong>
    </div>
    <div class="billrow">
      <span>Date</span>
      <strong>${escapeHTML(lastReceipt.date)}</strong>
    </div>
    <div class="billrow">
      <span>Total</span>
      <strong class="total">${escapeHTML(lastReceipt.total)}</strong>
    </div>
    <p class="notice">
      Demo receipt only. No real payment has been processed.
    </p>
  `;

  renderAdmin();
  go('receipt');
}

/* ==================== ADMIN NAVIGATION ==================== */

function showAdminTab(tab, clickedButton) {
  const tabs = [
    'overview',
    'doctors',
    'appointments',
    'departments',
    'billing'
  ];

  tabs.forEach(name => {
    const element = $('admin' +
      name.charAt(0).toUpperCase() + name.slice(1));

    if (element) {
      element.classList.toggle('hide', name !== tab);
    }
  });

  document.querySelectorAll('.admin-tab').forEach(button => {
    button.classList.toggle(
      'active',
      clickedButton
        ? button === clickedButton
        : button.textContent.trim().toLowerCase() === tab
    );
  });

  if (tab === 'doctors') renderAdminDoctors();
  if (tab === 'appointments') renderAdminAppointments();
  if (tab === 'departments') renderAdminDepartments();
  if (tab === 'billing') renderAdminBilling();
}

/* ==================== ADMIN TABLE HELPERS ==================== */

function adminCell(value) {
  const td = document.createElement('td');
  td.textContent = value == null ? '' : String(value);
  return td;
}

function adminButton(label, action) {
  const button = document.createElement('button');
  button.className = 'secondary';
  button.textContent = label;
  button.addEventListener('click', action);
  return button;
}

function adminRow(body, values, actions = []) {
  const tr = document.createElement('tr');

  values.forEach(value => tr.appendChild(adminCell(value)));

  if (actions.length) {
    const td = document.createElement('td');

    actions.forEach(button => {
      td.appendChild(button);
    });

    tr.appendChild(td);
  }

  body.appendChild(tr);
}

function emptyAdminRow(body, message, columns) {
  const tr = document.createElement('tr');
  const td = adminCell(message);
  td.colSpan = columns;
  tr.appendChild(td);
  body.appendChild(tr);
}

/* ==================== ADMIN DASHBOARD ==================== */

function renderAdmin() {
  if (!$('adminPage')) return;

  const appointments = getAppointments();
  const bills = getBills();

  $('adminDoctorCount').textContent = doctors.length;
  $('adminDeptCount').textContent = depts.length;
  $('adminAppointmentCount').textContent = appointments.length;

  const revenue = bills.reduce((sum, bill) => {
    return sum + (
      bill.status === 'Paid'
        ? Number(bill.amount) || 0
        : 0
    );
  }, 0);

  $('adminRevenue').textContent = money(revenue);

  const recent = $('adminRecentRows');

  if (recent) {
    recent.replaceChildren();

    appointments.slice().reverse().slice(0, 5).forEach(a => {
      adminRow(recent, [
        a.patient,
        a.doctor,
        a.date,
        a.status || 'Pending'
      ]);
    });

    if (!recent.children.length) {
      emptyAdminRow(recent, 'No appointments yet.', 4);
    }
  }

  renderAdminDoctors();
  renderAdminAppointments();
  renderAdminDepartments();
  renderAdminBilling();
}

/* ==================== ADMIN DOCTOR MANAGEMENT ==================== */

function renderAdminDoctors() {
  const body = $('adminDoctorRows');

  if (!body) return;

  body.replaceChildren();

  const query = ($('adminDoctorSearch')?.value || '').toLowerCase();

  const filtered = doctors.filter(d =>
    `${d.name} ${d.dept} ${d.qual}`.toLowerCase().includes(query)
  );

  filtered.forEach(d => {
    const edit = adminButton('Edit', () => editAdminDoctor(d.id));

    const remove = adminButton('Delete', () => {
      if (!confirm(`Delete ${d.name} from the doctor directory?`)) {
        return;
      }

      const index = doctors.findIndex(item => item.id === d.id);

      if (index !== -1) {
        doctors.splice(index, 1);
      }

      rebuildDoctorSelects();
      renderHome();
      renderDirectory();
      renderAdmin();
    });

    adminRow(body, [
      d.name,
      d.dept,
      `${d.exp} years`,
      money(d.fee)
    ], [edit, remove]);
  });

  if (!filtered.length) {
    emptyAdminRow(body, 'No doctors found.', 5);
  }
}

function editAdminDoctor(id) {
  const doctor = doctors.find(d => d.id === id);

  if (!doctor) return;

  const name = prompt('Doctor name:', doctor.name);

  if (name === null) return;

  const fee = prompt('Consultation fee (₹):', doctor.fee);

  if (fee === null) return;

  const experience = prompt(
    'Years of experience:',
    doctor.exp
  );

  if (experience === null) return;

  const cleanName = name.trim();
  const cleanFee = Number(fee);
  const cleanExp = Number(experience);

  if (
    !cleanName ||
    !Number.isFinite(cleanFee) ||
    cleanFee < 0 ||
    !Number.isInteger(cleanExp) ||
    cleanExp < 0 ||
    cleanExp > 70
  ) {
    alert('Enter a valid name, fee, and experience.');
    return;
  }

  doctor.name = cleanName;
  doctor.fee = cleanFee;
  doctor.exp = cleanExp;

  rebuildDoctorSelects();
  renderHome();
  renderDirectory();
  renderAdmin();
}

/* ==================== ADD DOCTOR FORM ==================== */

function populateNewDoctorDepartments() {
  const select = $('newDoctorDept');

  if (!select) return;

  select.replaceChildren();

  depts.forEach(department => {
    const option = document.createElement('option');
    option.value = department[0];
    option.textContent = department[0];
    select.appendChild(option);
  });
}

function addAdminDoctor(event) {
  event.preventDefault();

  const name = $('newDoctorName').value.trim();
  const dept = $('newDoctorDept').value;
  const qual = $('newDoctorQual').value.trim();
  const exp = Number($('newDoctorExp').value);
  const fee = Number($('newDoctorFee').value);
  const education =
    $('newDoctorEducation').value.trim() || 'Not specified';

  if (
    !name ||
    !qual ||
    !Number.isInteger(exp) ||
    exp < 0 ||
    exp > 70 ||
    !Number.isFinite(fee) ||
    fee < 0
  ) {
    alert('Please check the doctor details.');
    return;
  }

  const cleanName = /^Dr\.?\s/i.test(name)
    ? name
    : `Dr. ${name}`;

  const initials = cleanName
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/);

  const id = Math.max(0, ...doctors.map(d => d.id)) + 1;
  const department = depts.find(d => d[0] === dept);

  doctors.push({
    id,
    name: cleanName,
    dept,
    qual,
    exp,
    fee,
    education,
    avatar: initials.map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    bio: 'Doctor profile managed by hospital administration.',
    slot: 'Contact hospital for available hours',
    registration: `SYN-MED-${1000 + id}`,
    languages: 'English, Telugu',
    rating: '5.0',
    patients: 0,
    icon: department ? department[1] : '🩺'
  });

  event.target.reset();

  $('newDoctorExp').value = 5;
  $('newDoctorFee').value = 800;

  rebuildDoctorSelects();
  renderHome();
  renderDirectory();
  renderAdmin();

  showAdminTab('doctors');

  alert('Doctor added to the current demo session.');
}

/* ==================== ADMIN APPOINTMENTS ==================== */

function renderAdminAppointments() {
  const body = $('adminAppointmentRows');

  if (!body) return;

  body.replaceChildren();

  const query = (
    $('adminAppointmentSearch')?.value || ''
  ).toLowerCase();

  const appointments = getAppointments();

  appointments.forEach(appointment => {
    const searchText = [
      appointment.patient,
      appointment.doctor,
      appointment.department
    ].join(' ').toLowerCase();

    if (!searchText.includes(query)) return;

    const tr = document.createElement('tr');

    [
      appointment.patient,
      appointment.doctor,
      appointment.department,
      appointment.date,
      appointment.time
    ].forEach(value => {
      tr.appendChild(adminCell(value));
    });

    const statusCell = document.createElement('td');
    const status = document.createElement('select');

    ['Pending', 'Confirmed', 'Completed', 'Cancelled'].forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      option.selected = (appointment.status || 'Pending') === value;
      status.appendChild(option);
    });

    status.addEventListener('change', () => {
      const latest = getAppointments();
      const item = latest.find(a => a.id === appointment.id);

      if (!item) return;

      item.status = status.value;

      writeStorage('appointments', latest);
      renderAdmin();
    });

    statusCell.appendChild(status);
    tr.appendChild(statusCell);

    const actionCell = document.createElement('td');

    actionCell.appendChild(adminButton('Delete', () => {
      if (!confirm('Delete this appointment?')) return;

      const latest = getAppointments().filter(
        a => a.id !== appointment.id
      );

      writeStorage('appointments', latest);
      renderAdmin();
      renderAppointments();
    }));

    tr.appendChild(actionCell);
    body.appendChild(tr);
  });

  if (!body.children.length) {
    emptyAdminRow(body, 'No matching appointments.', 7);
  }
}

/* ==================== ADMIN DEPARTMENTS ==================== */

function renderAdminDepartments() {
  const grid = $('adminDepartmentGrid');

  if (!grid) return;

  grid.replaceChildren();

  depts.forEach(department => {
    const count = doctors.filter(
      d => d.dept === department[0]
    ).length;

    const card = document.createElement('article');
    card.className = 'panel admin-dept-card';

    const icon = document.createElement('div');
    icon.className = 'depticon';
    icon.textContent = department[1];

    const title = document.createElement('h3');
    title.textContent = department[0];

    const description = document.createElement('p');
    description.textContent = department[2];

    const total = document.createElement('strong');
    total.textContent = `${count} doctor(s)`;

    const view = adminButton('View doctors', () => {
      selectedDept = department[0];

      if ($('searchInput')) {
        $('searchInput').value = '';
      }

      if ($('deptFilter')) {
        $('deptFilter').value = department[0];
      }

      go('departments');
    });

    card.append(icon, title, description, total, view);
    grid.appendChild(card);
  });
}

/* ==================== ADMIN BILLING ==================== */

function renderAdminBilling() {
  const body = $('adminBillingRows');

  if (!body) return;

  body.replaceChildren();

  const bills = getBills();

  bills.slice().reverse().forEach(bill => {
    adminRow(body, [
      bill.id,
      bill.patient,
      bill.service,
      bill.doctor,
      money(bill.amount),
      bill.method,
      bill.status
    ]);
  });

  if (!body.children.length) {
    emptyAdminRow(body, 'No billing records yet.', 7);
  }
}

/* ==================== SYNCHRONIZE DROPDOWNS ==================== */

function rebuildDoctorSelects() {
  const billSelect = $('billDoctor');

  if (billSelect) {
    const previous = billSelect.value;

    billSelect.replaceChildren();

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select doctor';
    billSelect.appendChild(placeholder);

    doctors.forEach(d => {
      const option = document.createElement('option');
      option.value = d.id;
      option.textContent = `${d.name} — ${d.dept}`;
      billSelect.appendChild(option);
    });

    if ([...billSelect.options].some(o => o.value === previous)) {
      billSelect.value = previous;
    }
  }

  const departmentSelect = $('appointmentDept');

  if (departmentSelect) {
    const previous = departmentSelect.value;

    departmentSelect.replaceChildren();

    depts.forEach(d => {
      const option = document.createElement('option');
      option.value = d[0];
      option.textContent = d[0];
      departmentSelect.appendChild(option);
    });

    if ([...departmentSelect.options].some(o => o.value === previous)) {
      departmentSelect.value = previous;
    }
  }

  updateAppointmentDoctors();
}

/* ==================== INITIALIZATION ==================== */

function initializeHospital() {
  // Department filter.
  if ($('deptFilter')) {
    $('deptFilter').replaceChildren();

    const all = document.createElement('option');
    all.value = 'all';
    all.textContent = 'All departments';
    $('deptFilter').appendChild(all);

    depts.forEach(d => {
      const option = document.createElement('option');
      option.value = d[0];
      option.textContent = d[0];
      $('deptFilter').appendChild(option);
    });
  }

  // Admin doctor form.
  populateNewDoctorDepartments();

  $('adminDoctorForm')?.addEventListener(
    'submit',
    addAdminDoctor
  );

  // Billing dropdown updates.
  $('billDoctor')?.addEventListener('change', updateBill);
  $('billService')?.addEventListener('change', updateBill);
  $('extraCharge')?.addEventListener('input', updateBill);

  // Navigation buttons.
  document.querySelectorAll('[data-nav]').forEach(button => {
    button.addEventListener('click', () => {
      go(button.dataset.nav);
    });
  });

  // Date input cannot select past dates.
  if ($('appointmentDate')) {
    $('appointmentDate').min =
      new Date().toISOString().slice(0, 10);
  }

  // Connect existing doctor and department data.
  rebuildDoctorSelects();

  // Render initial page.
  renderHome();
  renderDirectory();
  updateBill();
  renderAppointments();

  // Support initial page navigation and direct refresh.
  go('home');
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    initializeHospital,
    { once: true }
  );
} else {
  initializeHospital();
}
