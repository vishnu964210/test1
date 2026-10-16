const depts=[
['General Medicine','🩺','Everyday health, checkups and chronic care.'],['Cardiology','💙','Heart health, diagnostics and cardiac care.'],['Neurology','🧠','Brain, spine and nervous system care.'],['Orthopedics','🦴','Bone, joint, sports and mobility care.'],['Pediatrics','🧸','Thoughtful care for infants and children.'],['Obstetrics & Gynecology','🌸','Women’s health, maternity and wellness.'],['Oncology','🎗️','Cancer diagnosis and multidisciplinary care.'],['Dermatology','✨','Skin, hair and nail health.'],['Ophthalmology','👁️','Vision, eye health and treatment.'],['ENT','👂','Ear, nose and throat care.'],['Psychiatry','🧩','Mental wellness and psychiatric support.'],['Gastroenterology','🫁','Digestive health, liver and gut care.'],['Pulmonology','🌬️','Lung health and breathing conditions.'],['Nephrology','💧','Kidney health and renal care.'],['Urology','➕','Urinary tract and men’s health.'],['Endocrinology','⚖️','Hormones, thyroid and diabetes care.'],['Dentistry','🦷','Preventive, restorative and oral care.'],['Emergency & Trauma','🚑','Urgent assessment and emergency treatment.'],['Radiology & Imaging','🔬','Diagnostic imaging and scan services.'],['Pathology & Laboratory','🧪','Lab tests and diagnostic services.'],['Anesthesiology','💉','Anesthesia, pain and perioperative care.'],['Physiotherapy & Rehab','🏃','Recovery, movement and rehabilitation.'],['Infectious Diseases','🦠','Complex infections and antimicrobial care.'],['Plastic & Reconstructive Surgery','🩹','Reconstructive and specialist surgical care.']
];
const firstNames=['Aarav','Meera','Arjun','Ananya','Rohan','Ishita','Kabir','Diya','Vihaan','Sana','Aditya','Nisha','Karan','Priya','Rahul','Aditi','Dev','Mira','Neil','Tara','Ibrahim','Kavya','Vikram','Leena'];
const surnames=['Sharma','Reddy','Mehta','Rao','Kapoor','Nair','Iyer','Patel','Malhotra','Desai','Kulkarni','Chowdhury'];
const qualifications=['MD, DM','MBBS, MD','MBBS, MS','MD, DNB','MBBS, Fellowship'];
const bios=['Known for a clear, patient-first approach and evidence-based treatment plans.','Combines specialist expertise with thoughtful communication and collaborative care.','Focused on accurate diagnosis, personalized treatment, and long-term wellbeing.'];
const slots=['Mon–Fri · 9:00 AM–2:00 PM','Mon–Sat · 10:00 AM–4:00 PM','Tue–Sat · 11:00 AM–6:00 PM'];
const doctors=[];depts.forEach((d,i)=>{for(let j=0;j<3;j++){let idx=i*3+j;let name='Dr. '+firstNames[idx%firstNames.length]+' '+surnames[(idx*3+j+i)%surnames.length];doctors.push({id:idx+1,name,dept:d[0],qual:qualifications[(i+j)%qualifications.length],exp:6+((i*3+j*5)%19),fee:600+((i*3+j)%5)*150,slot:slots[(i+j)%slots.length],bio:bios[(i+j)%bios.length],languages:['English','Hindi',j===1?'Telugu':'Telugu'][0]+(j===2?', Hindi':''),education:['AIIMS New Delhi','NIMS Hyderabad','Christian Medical College, Vellore','JIPMER Puducherry'][(i+j)%4],registration:'SYN-MED-'+String(1000+idx),avatar:(firstNames[idx%firstNames.length][0]+surnames[(idx*3+j+i)%surnames.length][0]),rating:(4.7+((i+j)%3)*.1).toFixed(1),patients:900+idx*73,icon:d[1]})}});
let currentDoctor=null,selectedDept='all',lastReceipt=null;
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function deptCard(d,compact=false){return `<button class="dept ${selectedDept===d[0]?'selected':''}" onclick="chooseDept('${d[0].replace(/'/g,"\\'")}')"><div class="depticon">${d[1]}</div><h3>${d[0]}</h3><p>${d[2]}</p><span class="count">3 SPECIALISTS · VIEW TEAM →</span></button>`}
function doctorCard(d){return `<article class="doctor"><div class="doctor-top"><div class="avatar">${d.avatar}</div><span class="available">● AVAILABLE</span></div><div class="doctor-body"><h3>${d.name}</h3><div class="role">${d.dept}</div><p class="bio">${d.qual} · ${d.exp} years of experience. ${d.bio}</p><div class="tags"><span class="tag">★ ${d.rating}</span><span class="tag">${d.exp}+ yrs exp.</span><span class="tag">${d.education}</span></div><div class="docfoot"><div class="fee">${money(d.fee)}<small>Consultation fee</small></div><button class="primary" onclick="showDoctor(${d.id})">View profile ↗</button></div></div></article>`}
function renderHome(){document.getElementById('homeDepts').innerHTML=depts.slice(0,8).map(d=>deptCard(d,true)).join('');document.getElementById('homeDoctors').innerHTML=doctors.slice(0,3).map(doctorCard).join('')}
function renderDirectory(){const q=(document.getElementById('searchInput')?.value||'').toLowerCase();const dept=document.getElementById('deptFilter')?.value||'all';const sort=document.getElementById('sortFilter')?.value||'name';document.getElementById('allDepts').innerHTML=depts.filter(d=>(dept==='all'||d[0]===dept)&&(!q||d[0].toLowerCase().includes(q)||d[2].toLowerCase().includes(q))).map(d=>deptCard(d)).join('');let arr=doctors.filter(d=>(dept==='all'||d.dept===dept)&&(selectedDept==='all'||d.dept===selectedDept)&&(!q||[d.name,d.dept,d.qual,d.education].join(' ').toLowerCase().includes(q)));if(sort==='fee')arr.sort((a,b)=>a.fee-b.fee);else if(sort==='experience')arr.sort((a,b)=>b.exp-a.exp);else arr.sort((a,b)=>a.name.localeCompare(b.name));document.getElementById('allDoctors').innerHTML=arr.length?arr.map(doctorCard).join(''):'<div class="empty">No matches found. Try another search or department.</div>'}
function chooseDept(name){selectedDept=selectedDept===name?'all':name;document.getElementById('deptFilter').value=selectedDept;go('departments');renderDirectory();document.getElementById('allDoctors').scrollIntoView({behavior:'smooth',block:'start'})}
function showDoctor(id){currentDoctor=doctors.find(d=>d.id===id);if(!currentDoctor)return;const d=currentDoctor;document.getElementById('profileContent').innerHTML=`<div class="panel"><div class="profilehead"><div class="bigavatar">${d.avatar}</div><div style="flex:1"><div class="eyebrow">${d.icon} ${d.dept}</div><h1>${d.name}</h1><p>${d.qual} · ${d.exp} years of clinical experience</p><div class="tags"><span class="tag">★ ${d.rating} patient rating</span><span class="tag">${d.patients.toLocaleString('en-IN')}+ consultations</span><span class="tag">Verified profile</span></div></div><div><div class="fee" style="font-size:25px">${money(d.fee)}<small>Consultation fee</small></div><button class="primary" style="margin-top:12px" onclick="bookDoctor(${d.id})">Book appointment →</button></div></div></div><div class="profilegrid"><section class="panel"><h3>About the doctor</h3><p style="color:var(--muted)">${d.bio} Dr. ${d.name.replace('Dr. ','')} works closely with patients and care teams to support informed decisions and a personalized care plan.</p><div class="infoitem"><small>Specialty</small><strong>${d.dept}</strong></div><div class="infoitem"><small>Qualifications</small><strong>${d.qual}</strong></div><div class="infoitem"><small>Medical education</small><strong>${d.education}</strong></div><div class="infoitem"><small>Registration ID</small><strong>${d.registration}</strong></div><div class="infoitem"><small>Languages</small><strong>${d.languages}</strong></div><div class="infoitem"><small>Clinical experience</small><strong>${d.exp} years</strong></div><div class="infoitem"><small>Consultation hours</small><strong>${d.slot}</strong></div></section><aside class="bookbox"><h3>Book a consultation</h3><p class="smallmuted">Choose a preferred date and visit type.</p><div class="field"><label>Appointment date</label><input id="apptDate" type="date" min="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Visit type</label><select id="apptType"><option>In-person consultation</option><option>Video consultation (demo)</option><option>Follow-up visit</option></select></div><div class="field"><label>Patient name</label><input id="apptName" placeholder="Your full name"></div><button class="primary" style="width:100%" onclick="bookDoctor(${d.id})">Continue to billing · ${money(d.fee)}</button><p class="smallmuted">Appointment and doctor information shown here are sample prototype data.</p></aside></div>`;go('profile')}
function bookDoctor(id){const d=doctors.find(x=>x.id===id);currentDoctor=d;const name=document.getElementById('apptName')?.value||'';document.getElementById('patientName').value=name;document.getElementById('billDoctor').value=String(d.id);document.getElementById('billService').value='consult';updateBill();go('billing')}
function updateBill(){const prices={consult:800,lab:1250,scan:2200,room:3500,pharmacy:650,custom:1000};const base=prices[document.getElementById('billService').value]||800;const did=Number(document.getElementById('billDoctor').value);const doc=doctors.find(d=>d.id===did);const service=doc&&document.getElementById('billService').value==='consult'?doc.fee:base;const facility=100;const extra=Math.max(0,Number(document.getElementById('extraCharge').value)||0);const tax=Math.round((service+facility+extra)*.05);document.getElementById('servicePrice').textContent=money(service);document.getElementById('facilityPrice').textContent=money(facility);document.getElementById('extraPrice').textContent=money(extra);document.getElementById('taxPrice').textContent=money(tax);document.getElementById('totalPrice').textContent=money(service+facility+extra+tax)}
function payBill(){const name=document.getElementById('patientName').value.trim();if(!name){document.getElementById('patientName').focus();alert('Please enter the patient name to continue.');return}const total=document.getElementById('totalPrice').textContent;const service=document.getElementById('billService').selectedOptions[0].text;const doctorId=Number(document.getElementById('billDoctor').value);const doc=doctors.find(d=>d.id===doctorId);lastReceipt={name,id:document.getElementById('patientId').value||'SYN-'+Math.floor(10000+Math.random()*89999),total,service,doctor:doc?doc.name:'Not specified',method:document.getElementById('payMethod').value,date:new Date().toLocaleString('en-IN')};document.getElementById('receiptDetails').innerHTML=`<div class="billrow"><span>Receipt reference</span><strong>${lastReceipt.id}</strong></div><div class="billrow"><span>Patient</span><strong>${escapeHTML(name)}</strong></div><div class="billrow"><span>Service</span><strong>${service}</strong></div><div class="billrow"><span>Doctor</span><strong>${doc?doc.name:'Not specified'}</strong></div><div class="billrow"><span>Payment method</span><strong>${lastReceipt.method}</strong></div><div class="billrow"><span>Date</span><strong>${lastReceipt.date}</strong></div><div class="billrow"><span>Total</span><span class="total">${total}</span></div>`;go('receipt')}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function go(page){const pages={home:'homePage',departments:'directoryPage',doctors:'directoryPage',profile:'profilePage',billing:'billingPage',receipt:'receiptPage'};Object.values(pages).forEach(id=>document.getElementById(id).classList.add('hide'));document.getElementById(pages[page]||'homePage').classList.remove('hide');document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===page||(page==='profile'&&b.dataset.nav==='doctors')));if(page==='departments'||page==='doctors'){document.getElementById('directoryTitle').textContent=page==='departments'?'Departments & specialists':'Meet our doctors';if(page==='doctors')selectedDept='all';document.getElementById('deptFilter').value=selectedDept;renderDirectory()}if(page==='billing')updateBill();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.nav)));depts.forEach(d=>{const o=document.createElement('option');o.value=d[0];o.textContent=d[0];document.getElementById('deptFilter').appendChild(o)});doctors.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.textContent=d.name+' — '+d.dept;document.getElementById('billDoctor').appendChild(o)});document.getElementById('billDoctor').addEventListener('change',updateBill);document.getElementById('billService').addEventListener('change',updateBill);renderHome();updateBill();

function go(page) {
  const pages = {
    home: 'homePage',
    departments: 'directoryPage',
    doctors: 'directoryPage',
    appointments: 'appointmentsPage',
    profile: 'profilePage',
    billing: 'billingPage',
    receipt: 'receiptPage'
  };

  // Hide all pages
  Object.values(pages).forEach(id => {
    document.getElementById(id).classList.add('hide');
  });

  // Show selected page
  document.getElementById(pages[page] || 'homePage')
    .classList.remove('hide');

  // Update active navigation
  document.querySelectorAll('[data-nav]').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.nav === page ||
      (page === 'profile' && button.dataset.nav === 'doctors')
    );
  });

  if (page === 'departments' || page === 'doctors') {
    document.getElementById('directoryTitle').textContent =
      page === 'departments'
        ? 'Departments & specialists'
        : 'Meet our doctors';

    if (page === 'doctors') {
      // Reset filters to show every doctor
      selectedDept = 'all';
      document.getElementById('searchInput').value = '';
      document.getElementById('deptFilter').value = 'all';
      document.getElementById('sortFilter').value = 'name';
    } else {
      document.getElementById('deptFilter').value = selectedDept;
    }

    renderDirectory();
  }

  if (page === 'appointments') {
    renderAppointments();
  }

  if (page === 'billing') {
    updateBill();
  }

  // Scroll to the doctor list when Our Doctors is clicked
  if (page === 'doctors') {
    document.getElementById('allDoctors').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
