import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { fetchBooks } from '../api';
import axios from 'axios'; 
import searchIcon from '../assets/search.png';


const AdminPage = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const booksPerPage = 10;

  const categories = [
    { name: 'All' },
    { name: 'Fiction' },
    { name: 'Science Fiction' },
    { name: 'Romance' },
    { name: 'Magic Realism' },
    { name: 'Adventure' },
    { name: 'Gothic Fiction' },
    { name: 'Fantasy' },
    { name: 'Dystopian Fiction' },
    { name: 'Psychological Fiction' },
    { name: "Children's Literature" },
    { name: 'Thriller' },
    { name: 'Historical Fiction' },
    { name: 'Philosophical Fiction' },
    { name: 'Southern Gothic' },
    { name: 'Young Adult' }
  ];

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError("An error occurred while loading books.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  const toggleAvailability = async (bookId, currentAvailability) => {
    const newAvailability = !currentAvailability;

    try {
      await axios.patch(`http://192.168.1.52:8080/api/books/${bookId}/availability`, {
        available: newAvailability,
      });
       
      const updatedBooks = books.map(book => 
        book.id === bookId ? { ...book, available: newAvailability } : book
      );
      setBooks(updatedBooks);
    } catch (error) {
      console.error("Error while changing book status:", error.message);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`http://192.168.1.52:8080/api/books/${bookId}`);
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
      Alert.alert("Success", "The book was deleted successfully.");
    } catch (error) {
      console.error("An error occurred while deleting the book:", error.message);
      Alert.alert("Error", "An error occurred while deleting the book.");
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: () => deleteBook(bookId) }
      ]
    );
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    setCurrentPage(0); 
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0); 
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ffb278" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Welcome, Admin!</Text>
            <Text style={styles.subText}>Manage the library effectively.</Text>
          </View>
          <TouchableOpacity style={styles.addBookButton} onPress={() => navigation.navigate('AddBook')}>
            <Text style={styles.addBookButtonText}>Add New Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchAndCategoryContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChangeText={handleSearchChange} 
            />
            <Image source={searchIcon} style={styles.searchIcon} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.name}
                style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]}
                onPress={() => handleCategoryChange(category.name)}
              >
                <Text style={[styles.categoryButtonText, selectedCategory === category.name && styles.selectedCategoryButtonText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bookListSection}>
          <FlatList
            data={paginatedBooks}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
                  style={styles.bookTouchable}
                >
                  <Image
                    source={{ uri: item.coverImage }}
                    style={styles.bookCover}
                  />
                  <Text style={styles.title}>{item.title}</Text>
                  <Text>{item.author}</Text>
                  <Text>{item.category}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, item.available ? styles.available : styles.unavailable]}
                  onPress={() => toggleAvailability(item.id, item.available)}
                >
                  <Text style={styles.toggleButtonText}>
                    {item.available ? 'Mark as Unavailable' : 'Mark as Available'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 0}>
          <Text style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>{currentPage + 1} / {totalPages}</Text>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage >= totalPages - 1}>
          <Text style={[styles.pageButton, currentPage >= totalPages - 1 && styles.disabledButton]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e99c44',
    marginBottom: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e99c44',
  },
  subText: {
    fontSize: 14,
    color: '#e99c44',
  },
  addBookButton: {
    backgroundColor: '#e99c44',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
  },
  addBookButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  searchAndCategoryContainer: {
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e99c44',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#FFF',
    marginRight: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#FF8C00', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#e99c44', 
  },
  categoryButtonText: {
    color: '#FFF', 
    fontWeight: 'bold', 
  },
  selectedCategoryButtonText: {
    color: '#FFF',
  },
  bookListSection: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  item: {
    backgroundColor: '#FFF',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  bookTouchable: {
    alignItems: 'center',
  },
  bookCover: {
    width: 90,
    height: 130,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  toggleButton: {
    marginTop: 10,
    padding: 5,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  available: {
    backgroundColor: '#28A745',
  },
  unavailable: {
    backgroundColor: '#DC3545',
  },
  toggleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 10,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#cac7c6',
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#e99c44',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageButton: {
    color: '#e99c44',
    fontWeight: 'bold',
  },
  disabledButton: {
    color: '#cccccc',
  },
  pageInfo: {
    fontWeight: 'bold',
  },
});

export default AdminPage;
