const UI = (function(){
"use strict";
const tableBody   = document.getElementById('tableBody'); 
const emptyState  = document.getElementById('emptyState'); 
const deptFilter  = document.getElementById('deptFilter');
const toastStack  = document.getElementById('toastStack'); 
const auditFeed   = document.getElementById('auditFeed');
function renderStats(all, filteredCount){
document.getElementById('statTotal').textContent = all.length;
document.getElementById('statDepts').textContent = DataManager.departments().length;
document.getElementById('statToday').textContent = all.filter(e => Utils.isToday(e.createdAt)).length;
document.getElementById('statFiltered').textContent = filteredCount;
}
function renderDeptOptions(){ // ye function department ke options ko render kr dega select box me
const current = deptFilter.value;
const depts = DataManager.departments();
deptFilter.innerHTML = '<option value="">All Departments</option>' +
depts.map(d => `<option value="${Utils.escapeHtml(d)}">${Utils.escapeHtml(d)}</option>`).join('');
if(depts.includes(current)) deptFilter.value = current;
}
function renderTable(records){
if(!records.length){
tableBody.innerHTML = '';
emptyState.style.display = 'block';
return;
}
emptyState.style.display = 'none';
const frag = document.createDocumentFragment();
records.forEach(emp => {
const tr = document.createElement('tr');
tr.innerHTML = `
<td data-label="ID"><span class="id-tag">${Utils.escapeHtml(emp.id)}</span></td>
<td data-label="Name" class="name-cell">${Utils.escapeHtml(emp.name)}</td>
<td data-label="Email">${Utils.escapeHtml(emp.email)}</td>
<td data-label="Department"><span class="dept-pill">${Utils.escapeHtml(emp.department)}</span></td>
<td data-label="Position">${Utils.escapeHtml(emp.position || '—')}</td>
<td data-label="Joined">${Utils.escapeHtml(Utils.formatDate(emp.joinDate))}</td>
<td data-label="Actions">
<div class="row-actions">
<button class="btn btn-ghost btn-sm btn-icon" data-action="edit" data-id="${emp.id}" title="Edit">&#9998;</button>
<button class="btn btn-danger btn-sm btn-icon" data-action="delete" data-id="${emp.id}" title="Delete">&#128465;</button>
</div>
</td>
`;
frag.appendChild(tr);
});
tableBody.innerHTML = '';
tableBody.appendChild(frag);
}
function toast(message, type, label){
const el = document.createElement('div');
el.className = 'toast' + (type ? ' ' + type : '');
el.innerHTML = `<b>${Utils.escapeHtml(label || 'SYSTEM')}</b>${Utils.escapeHtml(message)}`;
toastStack.appendChild(el);
setTimeout(() => {
el.style.transition = 'opacity .3s ease';
el.style.opacity = '0';
setTimeout(() => el.remove(), 300);
}, 3800);
}
function logAction(type, message){
const tagClass = { add:'tag-add', edit:'tag-edit', del:'tag-del', block:'tag-block' }[type] || 'tag-add';
const tagText  = { add:'ADD', edit:'EDIT', del:'DELETE', block:'BLOCKED' }[type] || 'LOG';
const entry = document.createElement('div');
entry.className = 'audit-entry';
const time = new Date().toLocaleTimeString('en-GB');
entry.innerHTML = `<span class="tag ${tagClass}">${tagText}</span>${Utils.escapeHtml(message)}<span class="t">${time}</span>`;
auditFeed.appendChild(entry);
auditFeed.scrollTop = auditFeed.scrollHeight;
}
function clearFieldErrors(){
document.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
}
function showFieldErrors(errors){
clearFieldErrors();
const map = { name:'fieldName', email:'fieldEmail', department:'fieldDept' };
Object.keys(errors).forEach(key => {
const fieldEl = document.getElementById(map[key]);
if(fieldEl){
fieldEl.classList.add('invalid');
const errEl = fieldEl.querySelector('.err');
if(errEl) errEl.textContent = errors[key];
}
});
}
return { renderStats, renderDeptOptions, renderTable, toast, logAction, clearFieldErrors, showFieldErrors };
})();
