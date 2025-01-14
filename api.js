import axios from 'axios';

const API_URL = 'http://192.168.1.52:8080/api';  //API GÜNCELLE


// Kitapları getiren fonksiyon
export const fetchBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    console.error("Kitapları alırken hata:", error.message);
    throw error;
  }
};

// Kitap detaylarını getiren fonksiyon
export const fetchBookDetails = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/books/${bookId}`); 
    return response.data;
  } catch (error) {
    console.error("Kitap detaylarını alırken hata:", error.message);
    throw error;
  }
};

// Kitap ekleyen fonksiyon
export const addBook = async (book) => {
  try {
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data;
  } catch (error) {
    console.error("Kitap eklerken hata:", error.message);
    throw error;
  }
};


export const fetchCategories = async () => {
  try {
    const response = await fetch('http://192.168.1.52:8080/api'); //API GÜNCELLE
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json(); 
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
};


