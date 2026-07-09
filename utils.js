const Utils = (function(){
"use strict";
function generateId(){
return 'EMP-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.floor(Math.random()*90+10);
}
function isValidEmail(value){
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(String(value).trim());
}
function normalize(str){
return String(str || '').trim().toLowerCase();
}
function escapeHtml(str){   //Help krna h xss atack ko prevent krne se
const div = document.createElement('div');
div.textContent = String(str == null ? '' : str);
return div.innerHTML;
}
function formatDate(isoStr){
if(!isoStr) return '—'; // agr data emply then em dash
const d = new Date(isoStr + 'T00:00:00'); //html ki date input h
if(isNaN(d)) return '—';// if date hi invalid ho jae to again this em dash return krdo
return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });// ye readable format me date ko convert kr dega
}
function todayISO(){
return new Date().toISOString().slice(0,10);
}
function isToday(isoStr){
return isoStr && isoStr.slice(0,10) === todayISO();
}
function debounce(fn, wait){ // ye function ko delay kr dega jab tak user type krta rhega
let t; 
return function(...args){ 
clearTimeout(t); // ye function ko clear kr dega agr user ne type krna band kr diya h to
t = setTimeout(() => fn.apply(this, args), wait); // ye function ko call kr dega agr user ne type krna band kr diya h to
};
}
return { generateId, isValidEmail, normalize, escapeHtml, formatDate, todayISO, isToday, debounce }; // ye object return kr dega jisme ye sare functions honge
})();
