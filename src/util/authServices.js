export async function refreshAccessToken() {
  const response = await fetch('http://127.0.0.1:8001/api/v1/freshcart/user/refresh', {
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