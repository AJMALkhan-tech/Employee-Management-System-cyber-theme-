const Validator = (function(){
"use strict";
function validate(form, excludeId){ // ye function form ke data ko validate kr dega aur errors ko return kr dega
const errors = {};
if(!form.name || !form.name.trim()){
errors.name = 'Name is required.';
}
if(!form.email || !form.email.trim()){
errors.email = 'Email is required.';
} else if(!Utils.isValidEmail(form.email)){
errors.email = 'Enter a valid email address.';
} else if(DataManager.emailExists(form.email, excludeId)){
errors.email = 'This email already exists in the database.';
}
if(!form.department || !form.department.trim()){
errors.department = 'Please select a department.';
}
if(!errors.name && !errors.department && DataManager.duplicateExists(form.name, form.department, excludeId)){
errors.name = 'Duplicate record: this name already exists in that department.';
}
return { valid: Object.keys(errors).length === 0, errors };
}
return { validate };
})();
