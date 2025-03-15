// DOM Elements
const form = document.getElementById("multi-step-form");
const steps = document.querySelectorAll(".card");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progressBar = document.getElementById("progress");
const stepIndicators = document.querySelectorAll(".step-indicator");

// Current step tracker
let currentStep = 0;

// Show specified step
function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });

  // Update step indicators
  stepIndicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index <= stepIndex);
  });

  // Update progress bar
  progressBar.style.width = `${(stepIndex / (steps.length - 1)) * 100}%`;
}

// Validate step 1
function validateStep1() {
  let isValid = true;

  // Name validation
  const name = document.getElementById("name");
  const nameError = document.getElementById("name-error");

  if (!name.value.trim()) {
    nameError.textContent = "Name is required";
    nameError.style.display = "block";
    isValid = false;
  } else {
    nameError.style.display = "none";
  }

  // Date of birth validation
  const dob = document.getElementById("dob");
  const dobError = document.getElementById("dob-error");

  if (!dob.value) {
    dobError.textContent = "Date of Birth is required";
    dobError.style.display = "block";
    isValid = false;
  } else {
    dobError.style.display = "none";
  }

  // Gender validation
  const gender = document.getElementById("gender");
  const genderError = document.getElementById("gender-error");

  if (!gender.value) {
    genderError.textContent = "Please select a gender";
    genderError.style.display = "block";
    isValid = false;
  } else {
    genderError.style.display = "none";
  }

  return isValid;
}

// Validate step 2
function validateStep2() {
  let isValid = true;

  // Email validation
  const email = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value.trim()) {
    emailError.textContent = "Email is required";
    emailError.style.display = "block";
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid email";
    emailError.style.display = "block";
    isValid = false;
  } else {
    emailError.style.display = "none";
  }

  // Phone validation
  const phone = document.getElementById("phone");
  const phoneError = document.getElementById("phone-error");

  if (!phone.value.trim()) {
    phoneError.textContent = "Phone number is required";
    phoneError.style.display = "block";
    isValid = false;
  } else if (phone.value.replace(/[^0-9]/g, "").length < 10) {
    phoneError.textContent = "Phone number must have at least 10 digits";
    phoneError.style.display = "block";
    isValid = false;
  } else {
    phoneError.style.display = "none";
  }

  // Address validation
  const address = document.getElementById("address");
  const addressError = document.getElementById("address-error");

  if (!address.value.trim()) {
    addressError.textContent = "Address is required";
    addressError.style.display = "block";
    isValid = false;
  } else {
    addressError.style.display = "none";
  }

  return isValid;
}

// Update summary
function updateSummary() {
  document.getElementById("summary-name").textContent =
    document.getElementById("name").value;
  document.getElementById("summary-dob").textContent = formatDate(
    document.getElementById("dob").value
  );
  document.getElementById("summary-gender").textContent =
    document.getElementById("gender").value;
  document.getElementById("summary-email").textContent =
    document.getElementById("email").value;
  document.getElementById("summary-phone").textContent =
    document.getElementById("phone").value;
  document.getElementById("summary-address").textContent =
    document.getElementById("address").value;
}

// Format date for better display
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Save form data to localStorage
function saveFormData() {
  const formData = {
    name: document.getElementById("name").value,
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  localStorage.setItem("formData", JSON.stringify(formData));
  localStorage.setItem("currentStep", currentStep.toString());
}

// Load form data from localStorage
function loadFormData() {
  const savedData = JSON.parse(localStorage.getItem("formData"));
  const savedStep = localStorage.getItem("currentStep");

  if (savedData) {
    document.getElementById("name").value = savedData.name || "";
    document.getElementById("dob").value = savedData.dob || "";
    document.getElementById("gender").value = savedData.gender || "";
    document.getElementById("email").value = savedData.email || "";
    document.getElementById("phone").value = savedData.phone || "";
    document.getElementById("address").value = savedData.address || "";

    if (savedStep) {
      currentStep = parseInt(savedStep);
      showStep(currentStep);
    }
  }
}

// Next button event listeners
nextBtns.forEach((button) => {
  button.addEventListener("click", () => {
    let isValid = true;

    // Validate current step
    if (currentStep === 0) {
      isValid = validateStep1();
    } else if (currentStep === 1) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);

      // Update summary when reaching step 3
      if (currentStep === 2) {
        updateSummary();
      }

      // Save to localStorage
      saveFormData();
    }
  });
});

// Previous button event listeners
prevBtns.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      saveFormData();
    }
  });
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Create success message
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.innerHTML = `
        <h2 style="color: #28a745;">Form Submitted Successfully!</h2>
        <p>Thank you for your submission.</p>
    `;

  // Clear the form and show success message
  form.innerHTML = "";
  form.appendChild(successMessage);

  // Clear localStorage after successful submission
  localStorage.removeItem("formData");
  localStorage.removeItem("currentStep");

  console.log("Form submitted successfully");
});

// Load saved data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadFormData();

  // If no saved data, start at step 1
  if (currentStep === 0) {
    showStep(currentStep);
  }
});

// Add input event listener to phone field for basic formatting
document.getElementById("phone").addEventListener("input", function () {
  // Remove non-numeric characters
  let phoneNumber = this.value.replace(/\D/g, "");

  // Apply simple formatting if we have enough digits
  if (phoneNumber.length > 6) {
    this.value =
      phoneNumber.slice(0, 3) +
      "-" +
      phoneNumber.slice(3, 6) +
      "-" +
      phoneNumber.slice(6, 10);
  } else if (phoneNumber.length > 3) {
    this.value = phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3);
  } else {
    this.value = phoneNumber;
  }
});
