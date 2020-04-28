let strength = {
    0: "Weakest",
    1: "Weak",
    2: "OK",
    3: "Good",
    4: "Strong"
}

let password = document.getElementById('password');
let meter = document.getElementById('password-strength');
let text = document.getElementById('password-strength-text');

password.addEventListener('input', function() {
    let val = password.value;
    let result = zxcvbn(val);

    // This updates the password strength meter
    meter.value = result.score;

    // This updates the password meter text
    if (val !== "") {
        text.innerHTML = "Password Strength: " + strength[result.score];
    } else {
        text.innerHTML = "";
    }
});