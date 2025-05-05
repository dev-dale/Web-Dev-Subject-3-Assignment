

document.addEventListener('DOMContentLoaded', () => {
  // fetchDataFromAPI();
  fetchUserProfile();
  setupEditForm();
  setupUploadForm();
  populateUserTable();
});

const BASE_API_URL = 'https://mx.velodata.org/api/v2';

function fetchDataFromAPI() {
  fetch(BASE_API_URL)
    .then(response => response.json())
    .then(data => console.log('Data from API:', data))
    .catch(error => console.error('Error fetching data:', error));
}

    //Profile page functions

// Default User Profile Display
async function fetchUserProfile() {
  const profileImage = document.getElementById('profile-image');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const userAddress = document.getElementById('user-address');

  if (!profileImage || !userName || !userEmail || !userAddress) return;

  const userId = 43;

  try {
    const response = await fetch(`${BASE_API_URL}/teach/users/${userId}`);
    if (!response.ok) throw new Error(`User ${userId} not found`);
    const { data } = await response.json();
    const attrs = data.attributes;

    profileImage.src = attrs.profile_image || 'https://via.placeholder.com/150';
    userName.textContent = attrs.name || 'No Name Provided';
    userEmail.textContent = attrs.email || 'No Email Provided';
    userAddress.textContent = `${attrs.address_1 || ''} ${attrs.address_2 || ''} ${attrs.city || ''} ${attrs.state || ''} ${attrs.postcode || ''}`.trim();
  } catch (err) {
    console.error(err);
    alert('Failed to load user profile.');
  }
}

// Random User Generator

async function fetchRandomUser() {
  try {
    const res = await fetch(`${BASE_API_URL}/teach/users`);
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
    const { data: users } = await res.json();

    if (!users.length) throw new Error("No users found");

    const randomIndex = Math.floor(Math.random() * users.length);
    const user = users[randomIndex];
    const attrs = user.attributes;

    const profileImage = document.getElementById('profile-image');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userAddress = document.getElementById('user-address');

    if (profileImage && userName && userEmail && userAddress) {
      profileImage.src = attrs.profile_image || 'https://via.placeholder.com/150';
      userName.textContent = attrs.name || 'No Name Provided';
      userEmail.textContent = attrs.email || 'No Email Provided';
      userAddress.textContent = `${attrs.address_1 || ''} ${attrs.address_2 || ''} ${attrs.city || ''} ${attrs.state || ''} ${attrs.postcode || ''}`.trim();
    }
  } catch (err) {
    console.error(err);
    alert('Could not fetch a random user.');
  }
}

    // Edit page functions
function setupEditForm() {
  const fetchForm = document.getElementById('fetch-user-form');
  const updateForm = document.getElementById('update-address-form');
  const responseMessage = document.getElementById('response-message');
  const avatarImg = document.getElementById('profile-image');

  if (!fetchForm || !updateForm) return;

  const fields = {
    name: document.getElementById('name'),
    address_1: document.getElementById('address_1'),
    address_2: document.getElementById('address_2'),
    address_3: document.getElementById('address_3'),
    city: document.getElementById('city'),
    state: document.getElementById('state'),
    postcode: document.getElementById('postcode')
  };

  let currentUserId = null;

  fetchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('user-id').value.trim();
    if (!userId) return;

    try {
      const res = await fetch(`${BASE_API_URL}/teach/users/${userId}`);
      if (!res.ok) throw new Error(`User ${userId} not found`);
      const { data } = await res.json();

      currentUserId = data.id;
      const attrs = data.attributes;

      fields.name.value = attrs.name || '';
      fields.address_1.value = attrs.address_1 || '';
      fields.address_2.value = attrs.address_2 || '';
      fields.address_3.value = attrs.address_3 || '';
      fields.city.value = attrs.city || '';
      fields.state.value = attrs.state || '';
      fields.postcode.value = attrs.postcode || '';

      if (avatarImg) avatarImg.src = attrs.profile_image || 'https://via.placeholder.com/100x100?text=No+Image';

      updateForm.classList.remove('d-none');
      responseMessage.innerHTML = '';
    } catch (err) {
      updateForm.classList.add('d-none');
      responseMessage.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  });

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUserId) return;

    const payload = {
      address_1: fields.address_1.value.trim(),
      address_2: fields.address_2.value.trim(),
      address_3: fields.address_3.value.trim(),
      city: fields.city.value.trim(),
      state: fields.state.value.trim(),
      postcode: fields.postcode.value.trim()
    };

    try {
      const res = await fetch(`${BASE_API_URL}/teach/users/${currentUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 403) {
        throw new Error("You don't have permission to update this user's information.");
      }

      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);
      const result = await res.json();

      responseMessage.innerHTML = `<div class="alert alert-success">Address updated successfully for user ID: ${result.user.id}</div>`;
    } catch (err) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  });
}

      //Upload Image Page
// fetch user Image
function setupUploadForm() {
  const fetchForm = document.getElementById('fetch-user-form');
  const uploadForm = document.getElementById('upload-form');
  const responseMessage = document.getElementById('response-message');
  const preview = document.getElementById('preview');
  const imageInput = document.getElementById('image-input');

  if (!fetchForm || !uploadForm || !preview || !imageInput) return;

  let currentUserId = null;

  fetchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('user-id').value.trim();
    if (!userId) return;

    try {
      const res = await fetch(`${BASE_API_URL}/teach/users/${userId}`);
      if (!res.ok) throw new Error(`User ${userId} not found`);
      const { data } = await res.json();

      currentUserId = data.id;
      preview.src = data.attributes.profile_image || 'https://via.placeholder.com/100x100?text=Preview';
      uploadForm.classList.remove('d-none');
      responseMessage.innerHTML = '';
    } catch (err) {
      uploadForm.classList.add('d-none');
      responseMessage.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  });
  // select image to upload
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) preview.src = URL.createObjectURL(file);
  });
  //update profile Image
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUserId || !imageInput.files[0]) return;

    const formData = new FormData();
    formData.append('attachment', imageInput.files[0]);

    try {
      const res = await fetch(`${BASE_API_URL}/teach/users/${currentUserId}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      const data = await res.json();

      responseMessage.innerHTML = `<div class="alert alert-success">Upload successful.</div>`;
    } catch (err) {
      responseMessage.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
  });
}
    // Data View Page
    
//fetch all user data
function populateUserTable() {
  const tbody = document.getElementById('user-table-body');
  const message = document.getElementById('response-message');

  if (!tbody) return;

  fetch(`${BASE_API_URL}/teach/users`)
    .then(res => {
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      return res.json();
    })
    .then(json => {
      const users = json.data;
      tbody.innerHTML = '';

      if (!users.length) {
        tbody.innerHTML = '<tr><td colspan="7">No users found.</td></tr>';
        return;
      }

      users.forEach(user => {
        const attr = user.attributes;
        const row = `
          <tr>
            <td>${user.id}</td>
            <td><img src="${attr.profile_image || 'https://placeholder.com/50'}" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" /></td>
            <td>${attr.name || '-'}</td>
            <td>${attr.email || '-'}</td>
            <td>${attr.address_1 || '-'}</td>
            <td>${attr.city || '-'}</td>
            <td>${attr.state || '-'}</td>
            <td>${attr.postcode || '-'}</td>
          </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
      });
    })
    .catch(err => {
      tbody.innerHTML = '<tr><td colspan="7">Failed to load users.</td></tr>';
      if (message) message.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    });
}

// Dark mode Toggle


document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("dark-mode-toggle");
  const table = document.getElementById("userTable");

  // Load dark mode preference
  const isDark = localStorage.getItem("dark-mode") === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    if (table) table.classList.add("table-dark");
    toggleBtn.textContent = "☀️ Light Mode";

    // Update muted text for dark mode
    document.querySelectorAll(".text-muted").forEach(el => {
      el.classList.remove("text-muted");
      el.classList.add("text-light", "opacity-75");
    });
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
  }

  toggleBtn.addEventListener("click", function () {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    // Toggle table styling
    if (table) table.classList.toggle("table-dark");

    // Toggle text-muted styles
    document.querySelectorAll(".text-muted, .text-light.opacity-75").forEach(el => {
      if (isDarkMode) {
        el.classList.remove("text-muted");
        el.classList.add("text-light", "opacity-75");
      } else {
        el.classList.remove("text-light", "opacity-75");
        el.classList.add("text-muted");
      }
    });

    // Update toggle button
    toggleBtn.textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";

    // Save preference
    localStorage.setItem("dark-mode", isDarkMode);
  });
});
