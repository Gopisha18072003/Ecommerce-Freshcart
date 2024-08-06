import { QueryClient } from "@tanstack/react-query";
import apiClient from './interseptor'

export const querClient = new QueryClient();

export async function fetchProducts({signal, type, filters, sortBy}) {
    let url = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/';
    if(type === 'featured') {
        url += '?isFeatured=true';
    }else if(type === 'bestSeller') {
        url += '?sort=-ordersQuantity&limit=10';
    } else if(type == 'popular') {
        url += '?discount[gte]=50'
    }
    if(filters) {
        url += '?'
        for (const filter in filters) {
            if(filter == 'category'){
                const filterVals = filters[filter].join(',')
                url += `${filter}=${filterVals}&`
            } else if(filter == 'price') {
                url += `${filter}[lt]=${filters[filter]}&`
            }else if(filter == 'averageRating') {
                url += `${filter}[gt]=${filters[filter]}&`
            }else if(filter == 'quantity') {
                url += `${filter}[gt]=0&`
            }else if(filter == 'isOrganic') {
                url += `${filter}=true`
            }
        }
    if(sortBy) {
        url += `sort=${sortBy}`
    }   
    }
    const response = await fetch(url, {signal: signal});
    if(!response.ok) {
        const error = new Error('An error has occured!');
        error.code = response.status;
        error.info = await response.json()
        throw error;
    }
    const {data} = await response.json();
    return data.groceries;
}

export async function fetchProduct({signal, query}) {
  let url = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/';
  const {productId} = query;
  if(productId !== '') {
    url += `${productId}` 
  }
  const response = await fetch(url, {signal: signal});
    if(!response.ok) {
        const error = new Error('An error has occured!');
        error.code = response.status;
        error.info = await response.json()
        throw error;
    }
    const {data} = await response.json();
    return data.grocery;
}

export async function updateProduct(data) {
  let url = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/';
  
  const { productId, ...rest } = data; // Destructuring to get productId and the rest of the data.
  url += productId;
  
  const jsonData = JSON.stringify(rest); // Stringify the rest of the data.
  
  try {
    const response = await apiClient.patch(url, jsonData, {
      headers: {
        'Content-Type': 'application/json' // Corrected Content-Type header.
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Cannot update product');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Cannot update product');
  }
}

export async function deleteProduct(productId) {
  let url = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/';
  url += productId;
  
  try {
    const response = await apiClient.delete(url);
    if (response.status === 204) {
      return response.data;
    } else {
      throw new Error('Cannot update product');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Cannot update product');
  }
}
  

export async function fetchReviews({signal, query}) {
  let url = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/';
  const {productId} = query;
  if(productId !== '') {
    url += `${productId}/reviews` 
  }
  const response = await fetch(url, {signal: signal});
    if(!response.ok) {
        const error = new Error('An error has occured!');
        error.code = response.status;
        error.info = await response.json()
        throw error;
    }
    const {data} = await response.json();
    return data.reviews;
}



export async function loginUser(userData) {
    const response = await fetch('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData),
    });

    if(!response.ok) {
        console.log('login failed')
        throw new Error('Invalid Email or Password')
    } 
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data;
}
export async function logoutUser() {
    const response = await fetch('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok) {
        console.log('logout failed')
        throw new Error('Something went wrong')
    } 
    
    const data = await response.json();
    localStorage.removeItem('accessToken');
    return data;
}

export const uploadImage = async (id, value, isValid) => {
    try {
        const formData = new FormData();
        formData.append('image', value);
        if(isValid) {
            const response = await apiClient.post('/freshcart/user/updateImage', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.status == 'success') {

                return response.data
            }
        }
      } catch (error) {
        console.error('Error Uploading Image:', error);
      }
}
export const uploadProductImage = async (id, value, isValid) => {
    try {
        const formData = new FormData();
        formData.append('image', value);
        if(isValid) {
            const response = await apiClient.post(`/freshcart/updateImage/${id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            });
            if(response.data.status == 'success') {
                return response.data
            }
        }
      } catch (error) {
        console.error('Error Uploading Image:', error);
      }
}

export const addProduct = async ( data) => {
  try {
        const response = await apiClient.post(`/freshcart/addGrocery`, data,)

          if(response.status == 201) {
              return response.data
          }
      }catch (error) {
      console.error('Error Adding Product:', error);
    }
}

export const updateUserData = async (data) => {
    try {
      const response = await apiClient.patch('/freshcart/user/updateMe', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'success') {
        return response.data.data;
      } else {
          console.error('Update failed:', response.data.error);
        return response.data.error;
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  export const createCart = async () => {
    try {
      const response = await apiClient.post('/freshcart/user/createCart')
      if(response.data.status == 'success')
        return response.data.data;
      else {
        console.log("Cart Creation Failed")
        return response.data.message
      }
    } catch (error) {
      console.log('An error occurred:', error)
    }
  }

  export const updateCart = async (data) => {
    try {
      const response = await apiClient.patch('/freshcart/user/updateCart', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.data.status == 'success')
        return response.data.data
      else {
        console.log('Cart Updation Failed')
        response.data.messsage
      }
    }catch(error) {
      console.log('Updation Failed')
    }
  }
  
  export const removeFromCart = async (data) => {
    try {
      const response = await apiClient.patch('/freshcart/user/removeFromCart', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.data.status == 'success')
        return response.data.data
      else {
        console.log('Cart Updation Failed')
        response.data.messsage
      }
    }catch(error) {
      console.log('Updation Failed')
    }
  }  
  
  export const getCart = async (data) => {
    try {
      const response = await apiClient.get('/freshcart/user/getCart');
      if(response.data.status == 'success')
        return response.data.data
      else {
        console.log('Getting cart data failed')
        response.data.messsage
      }
    }catch(error) {
      console.log('Getting cart data failed')
    }
  }

  export const deleteCart = async (data) => {
    try {
      const response = await apiClient.get('/freshcart/user/deleteCart');
      if(response.data.status == 'success')
        return response.data.data
      else {
        console.log('Cart Deletion Failed')
        response.data.messsage
      }

    } catch(error) {
      console.log('Cart deletion failed')
    }
  }

  

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.patch('/freshcart/user/updatepassword', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status === 'success') {
      return response.data;
    } else {
        console.error('Reset failed:', response.data.error);
        throw new Error('Incorrect Password, Try again!');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

export const fetchCategoryCounts = async () => {
    try {
      const response = await fetch('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/category');
      if (!response.ok) {
        throw new Error('Failed to fetch category counts');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching category counts:', error);
      throw error; // Re-throw the error after logging it
    }
  };

  export const fetchMyOrders = async() => {
    try {
      const response = await apiClient('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/getMyOrder');
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
          console.error('Reset failed:', response.data.error);
          throw new Error('Incorrect Password, Try again!');
      }
    }catch(error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }

  export const emptyCart = async() => {
    try {
      const response = await apiClient.patch('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/resetCart')
      console.log(response)
      return response.data
    }catch(error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
  

  export const deleteAccount = async () => {
    try {
      const response = await apiClient.delete('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/deleteme');
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Could not delete user');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      throw new Error('Could not delete user');
    }
  };
  
  export const writeReview = async(data) => {
    try {
      const response = await apiClient.post('https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/review', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Could not create a review, status code: ${response.status}`);
      }
  
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }

  export const getOrders = async ({ signal, date }) => {
    let baseUrl = 'https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/getAllOrders'
    if(date) {
      baseUrl += `?date=${date}`
    }
    try {
      const response = await apiClient.get(baseUrl, { signal });
  
      if (response.status === 200) {
        return response.data.data.orders;
      } else {
        throw new Error(`Could not fetch orders, status code: ${response.status}`);
      }
  
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }  
  export const getOrder = async ({ signal, id }) => {
    let baseUrl = `https://freshcart-api-4ftp.onrender.com/api/v1/freshcart/user/getOrder/${id}`
    
    try {
      const response = await apiClient.get(baseUrl, { signal });
  
      if (response.status === 200) {
        return response.data.data.order;
      } else {
        throw new Error(`Could not fetch order, status code: ${response.status}`);
      }
  
    } catch (error) {
      console.log('Error:', error);
      throw error;
    }
  }
      