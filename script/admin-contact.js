const responseMsg = document.getElementById('responseMsg');
const loader = document.getElementById('loaderOverlay');

document.getElementById('contactForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };

  // Show full-screen loader
  loader.style.display = 'flex';

  // Wait 2 seconds for loader effect
  setTimeout(async () => {
    try {
      const response = await fetch('YOUR_BACKEND_URL/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      const emoji = '<img src="assets/sparkling_heart (1).png" style="width:1.5em; vertical-align:middle; margin-right:5px;">';
      responseMsg.innerHTML = response.ok 
        ? `${emoji} ${result.message || 'Message Sent successfully! We will get back to you soon.'}`
        : `${emoji} ${result.error || 'Failed to send message. Please try again.'}`;

      // Show alert with animation
      responseMsg.classList.remove('hide');
      responseMsg.classList.add('show');

      if (response.ok) this.reset();

      // Hide alert 
      setTimeout(() => {
        responseMsg.classList.remove('show');
        responseMsg.classList.add('hide');
        setTimeout(() => { responseMsg.style.display = 'none'; }, 500);
      }, 5000);

    } catch (error) {
      console.error('Error:', error);
      const emoji = '<img src="assets/male-cook.png" style="width:2.5em; vertical-align:middle; margin-right:5px;">';
      responseMsg.innerHTML = `${emoji} Side Server Is Turned Off. Please try again.`;
      responseMsg.classList.remove('hide');
      responseMsg.classList.add('show');

      setTimeout(() => {
        responseMsg.classList.remove('show');
        responseMsg.classList.add('hide');
        setTimeout(() => { responseMsg.style.display = 'none'; }, 500);
      }, 5000);
    } finally {
      loader.style.display = 'none';
    }
  }, 2000);
});