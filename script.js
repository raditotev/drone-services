AOS.init({
  duration: 900,
  once: true
});

// Plausible: track custom events (no-op if script blocked or not loaded)
function track(name, props) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, props ? { props } : undefined);
  }
}

// Hero CTA click
document.querySelector('.hero .btn-primary')?.addEventListener('click', function () {
  track('CTA Click');
});

document.querySelector('.contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = this;
  const submitButton = form.querySelector('button[type="submit"]');
  const successMessage = document.querySelector('.form-success');

  // Disable submit button during processing
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Изпраща се...';

  // Collect form data
  const formData = {
    name: form.querySelector('input[name="name"]').value,
    email: form.querySelector('input[name="email"]').value,
    message: form.querySelector('textarea[name="message"]').value
  };

  // Check if in development mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Development: Log form data and skip remote submission
  if (isDevelopment) {
    console.log('📧 Form submission (Development Mode)');
    console.log('=====================================');
    console.log('Name:', formData.name);
    console.log('Email:', formData.email);
    console.log('Message:', formData.message);
    console.log('=====================================');
    console.log('JSON Payload:', JSON.stringify(formData, null, 2));
    console.log('⚠️  Skipping remote server submission in development');

    // Simulate successful submission
    setTimeout(() => {
      form.classList.add('hide');
      setTimeout(() => {
        form.style.display = 'none';
        successMessage.classList.add('show');
      }, 400);
    }, 1000); // Simulate network delay

    return;
  }

  try {
    // Send POST request (production only)
    const response = await fetch('https://mailserver.radi.pro/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      track('Contact Form Submitted');
      // Animate form out
      form.classList.add('hide');

      // Wait for form animation to complete, then show success message
      setTimeout(() => {
        form.style.display = 'none';
        successMessage.classList.add('show');
      }, 400);

    } else {
      throw new Error('Грешка при изпращане');
    }

  } catch (error) {
    console.error('Error:', error);
    alert('Възникна грешка при изпращане на съобщението. Моля, опитайте отново.');

    // Re-enable submit button on error
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Изпрати';
  }
});

