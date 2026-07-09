const App = (function()
{
"use strict";
let editingId = null;
let pendingDeleteId = null;
const el = {
overlay: document.getElementById('modalOverlay'), 
modalTitle: document.getElementById('modalTitle'),
form: document.getElementById('employeeForm'),
name: document.getElementById('empName'),
email: document.getElementById('empEmail'),
dept: document.getElementById('empDept'),
position: document.getElementById('empPosition'),
join: document.getElementById('empJoin'),
btnAdd: document.getElementById('btnAdd'),
btnCancel: document.getElementById('btnCancel'),
btnSubmit: document.getElementById('btnSubmit'),
modalClose: document.getElementById('modalClose'),
search: document.getElementById('searchInput'),
deptFilter: document.getElementById('deptFilter'),
tableBody: document.getElementById('tableBody'),
confirmOverlay: document.getElementById('confirmOverlay'),
confirmOk: document.getElementById('confirmOk'),
confirmCancel: document.getElementById('confirmCancel'),
confirmClose: document.getElementById('confirmClose'),
};
function currentFilters(){ // ye function current filters ko return krta hai search term aur department filter ke liye
return {
term: Utils.normalize(el.search.value),
dept: el.deptFilter.value,
};
}
function getFilteredRecords(){ // ye function filtered records ko return krta hai based on current filters
const { term, dept } = currentFilters();
return DataManager.getAll()
.filter(e => !dept || e.department === dept)
.filter(e => !term ||
Utils.normalize(e.name).includes(term) ||
Utils.normalize(e.department).includes(term))
.sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}
function refresh(){ // ye function UI ko refresh krta hai table, stats aur department options ke liye
const all = DataManager.getAll();
const filtered = getFilteredRecords();
UI.renderDeptOptions();
UI.renderTable(filtered);
UI.renderStats(all, filtered.length);
}
function openModal(mode, record){ // ye function modal ko open krta hai add/edit mode me aur agar record available hai to usko populate krta hai form fields me
editingId = record ? record.id : null; 
el.modalTitle.textContent = mode === 'edit' ? 'EDIT_RECORD.EXE' : 'ADD_RECORD.EXE'; 
UI.clearFieldErrors(); 
el.name.value = record ? record.name : ''; // ye form fields ko populate krta hai agar record available hai to, otherwise empty fields set krta hai
el.email.value = record ? record.email : '';
el.dept.value = record ? record.department : '';
el.position.value = record ? (record.position || '') : ''; 
el.join.value = record ? (record.joinDate || '') : Utils.todayISO(); 
el.overlay.classList.add('open'); 
setTimeout(() => el.name.focus(), 50); // ye ensure krta hai ki modal open hone ke baad name field pe focus ho jaye
}
function closeModal(){ 
el.overlay.classList.remove('open');
editingId = null;
}
function handleSubmit(e){
e.preventDefault();
const formData = {
name: el.name.value.trim(),
email: el.email.value.trim(),
department: el.dept.value,
position: el.position.value.trim(),
joinDate: el.join.value || Utils.todayISO(),
};
const result = Validator.validate(formData, editingId);
if(!result.valid){
UI.showFieldErrors(result.errors);
UI.toast('Entry rejected — validation rules violated.', 'err', 'Intrusion Blocked');
UI.logAction('block', `Rejected submission for "${formData.name || 'unnamed'}" — validation failure.`);
return;
}
if(editingId){
DataManager.update(editingId, formData);
UI.toast(`Record ${editingId} updated successfully.`, null, 'Record Modified');
UI.logAction('edit', `Updated record for ${formData.name} (${formData.department}).`);
} else {
const record = DataManager.add(formData);
UI.toast(`Record ${record.id} committed to database.`, null, 'Record Added');
UI.logAction('add', `New record: ${formData.name} added to ${formData.department}.`);
}
closeModal();
refresh();
}
function handleTableClick(e){
const btn = e.target.closest('button[data-action]');
if(!btn) return;
const id = btn.getAttribute('data-id');
const action = btn.getAttribute('data-action');
if(action === 'edit'){
const record = DataManager.getById(id);
if(record) openModal('edit', record);
} else if(action === 'delete'){
pendingDeleteId = id;
el.confirmOverlay.classList.add('open');
}
}
function closeConfirm(){
el.confirmOverlay.classList.remove('open');
pendingDeleteId = null;
}
function confirmDelete(){
if(!pendingDeleteId) return;
 const record = DataManager.getById(pendingDeleteId);
DataManager.remove(pendingDeleteId);
UI.toast(`Record ${pendingDeleteId} purged from database.`, 'err', 'Record Deleted');
UI.logAction('del', `Deleted record: ${record ? record.name : pendingDeleteId}.`);
closeConfirm();
refresh();
}
function tickClock(){
const clockEl = document.getElementById('clock');
const now = new Date();
clockEl.textContent = now.toLocaleTimeString('en-GB');
}
function bindEvents(){
el.btnAdd.addEventListener('click', () => openModal('add', null));
el.btnCancel.addEventListener('click', closeModal);
el.modalClose.addEventListener('click', closeModal);
el.overlay.addEventListener('click', (e) => { if(e.target === el.overlay) closeModal(); });
el.form.addEventListener('submit', handleSubmit);
el.btnSubmit.addEventListener('click', handleSubmit);
el.tableBody.addEventListener('click', handleTableClick);
el.confirmOk.addEventListener('click', confirmDelete);
el.confirmCancel.addEventListener('click', closeConfirm);
el.confirmClose.addEventListener('click', closeConfirm);
el.confirmOverlay.addEventListener('click', (e) => { if(e.target === el.confirmOverlay) closeConfirm(); });
el.search.addEventListener('input', Utils.debounce(refresh, 150));
el.deptFilter.addEventListener('change', refresh);
document.addEventListener('keydown', (e) => {
if(e.key === 'Escape'){
closeModal();
closeConfirm();
}
});
}
function seedIfEmpty(){
if(DataManager.getAll().length) return;
const seed = [
{ name:'Ayesha Khan', email:'ayesha.khan@sentinel.local', department:'Cybersecurity', position:'SOC Analyst', joinDate:'2024-02-11' },
{ name:'Bilal Ahmed', email:'bilal.ahmed@sentinel.local', department:'Engineering', position:'Backend Engineer', joinDate:'2023-08-04' },
{ name:'Sara Malik', email:'sara.malik@sentinel.local', department:'Design', position:'UI/UX Designer', joinDate:'2025-01-20' },
];
seed.forEach(s => {
const r = DataManager.add(s);
UI.logAction('add', `Seed record initialized: ${r.name} (${r.department}).`);
});
}
function init(){
seedIfEmpty();
bindEvents();
tickClock();
setInterval(tickClock, 1000);
refresh();
UI.logAction('add', 'SENTINEL dashboard session initialized.');
}
return { init };
})();
document.addEventListener('DOMContentLoaded', App.init);
