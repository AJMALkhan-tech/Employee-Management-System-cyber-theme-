const DataManager = (function(){
"use strict";
const STORAGE_KEY = 'sentinel_employees_v1';
let cache = [];
function load(){
try{
const raw = localStorage.getItem(STORAGE_KEY);
cache = raw ? JSON.parse(raw) : [];
}catch(e){
console.error('SENTINEL: failed to parse storage, resetting.', e);
cache = [];
}
return cache;
}
function persist(){ // ye function local storage me data ko save kr dega
localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
}
function getAll(){ // ye function cache me data ko return kr dega
return cache.slice(); 
}
function getById(id){ // ye function cache me se id ke basis pe data ko return kr dega
return cache.find(e => e.id === id) || null; 
}
function emailExists(email, excludeId){ // ye function email ke basis pe data ko check kr dega ki email exist krta h ya nhi
const n = Utils.normalize(email); 
return cache.some(e => Utils.normalize(e.email) === n && e.id !== excludeId);
}
function duplicateExists(name, department, excludeId){ // ye function name aur department ke basis pe data ko check kr dega ki name aur department exist krta h ya nhi
const n = Utils.normalize(name);
const d = Utils.normalize(department);
return cache.some(e => Utils.normalize(e.name) === n && Utils.normalize(e.department) === d && e.id !== excludeId);
}
function add(record){ // ye function record ko add kr dega cache me aur local storage me bhi save kr dega
record.id = Utils.generateId(); // ye function unique id generate kr dega record ke liye
record.createdAt = new Date().toISOString(); // ye function record ke liye createdAt date set kr dega
cache.push(record); // ye function record ko cache me add kr dega
persist(); // ye function local storage me data ko save kr dega
return record; // ye function record ko return kr dega
}
function update(id, patch){ // ye function record ko update kr dega cache me aur local storage me bhi save kr dega
const idx = cache.findIndex(e => e.id === id); // ye function record ke index ko find kr dega cache me
if(idx === -1) return null; 
cache[idx] = Object.assign({}, cache[idx], patch); 
persist();
return cache[idx];
}
function remove(id){ // ye function record ko remove kr dega cache me aur local storage me bhi save kr dega
const idx = cache.findIndex(e => e.id === id); 
if(idx === -1) return false;
cache.splice(idx, 1); 
persist();
return true;
}
function departments(){ // ye function cache me se unique department names ko return kr dega
return Array.from(new Set(cache.map(e => e.department).filter(Boolean))).sort(); // ye function unique department names ko return kr dega aur unhe sort kr dega
}
load();
return { getAll, getById, emailExists, duplicateExists, add, update, remove, departments };
})();
