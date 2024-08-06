export async function refreshAccessToken() {
  const response = await fetch('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/refresh', {
    method: 'GET',
    credentials: 'include', // Include cookies
  });
  if (!response.ok) {
    return null
  }
  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken); // Update access token in memory
  return data.accessToken;
  }