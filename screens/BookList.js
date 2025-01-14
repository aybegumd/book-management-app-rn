import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBooks } from '../api'; 
import profileImage from '../assets/profile.png'; 
import searchIcon from '../assets/search.png'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const BookList = ({ route, navigation }) => {
  const { firstName, email } = route.params;
  const [books, setBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
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
    { name: 'Young Adult' },
    { name: 'Self-Help' }
  ];

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError("Kitapları yüklerken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    const loadFavorites = async () => {
      try {
        const favorites = await AsyncStorage.getItem(`favoriteBooks_${email}`);
        if (favorites) {
          setFavoriteBooks(JSON.parse(favorites));
        } else {
          setFavoriteBooks([]); 
        }
      } catch (error) {
        console.error("Favori kitapları yüklerken bir hata oluştu: ", error);
        setFavoriteBooks([]); 
      }
    };
  
    loadBooks();
    loadFavorites();
  }, [email]); 

  const toggleFavorite = async (bookId) => {
    let updatedFavorites;
    if (favoriteBooks.includes(bookId)) {
      updatedFavorites = favoriteBooks.filter(id => id !== bookId);
    } else {
      updatedFavorites = [...favoriteBooks, bookId];
    }
    setFavoriteBooks(updatedFavorites);
    await AsyncStorage.setItem(`favoriteBooks_${email}`, JSON.stringify(updatedFavorites));
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

  if (loading) {
    return <ActivityIndicator size="large" color="#B68FB2" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Hello, {firstName}!</Text>
          <Text style={styles.subText}>Let's Discover Books...</Text>
        </View>
        <View style={styles.favoriteHeader}>
        <Text style={styles.favoriteHeaderText}>Favorites</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FavoriteBooks', { email })} style={styles.favoriteIconContainer}>
          <Icon 
            name="heart" 
            size={35} 
            color="#B68FB2" 
          />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.searchAndCategoryContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search books by title, author, or category..."
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                setCurrentPage(0); 
              }} 
            />
            <Image source={searchIcon} style={styles.searchIcon} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.name}
                style={[styles.categoryButton, selectedCategory === category.name && styles.selectedCategoryButton]} 
                onPress={() => {
                  setSelectedCategory(category.name);
                  setCurrentPage(0); 
                }}
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
              <TouchableOpacity 
                style={styles.item} 
                onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
              >
                <Image 
                  source={{ uri: item.coverImage }} 
                  style={styles.bookCover}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text>{item.author}</Text>
                <Text>{item.category}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteIconButton}>
                  <Icon 
                    name={favoriteBooks.includes(item.id) ? 'heart' : 'heart-o'} 
                    size={25} 
                    color={favoriteBooks.includes(item.id) ? '#B68FB2' : '#000'}
                    style={styles.favoriteIcon} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
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
    padding: 20,
    backgroundColor: '#F6F4F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F6F4F2',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B68FB2',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B68FB2',
  },
  subText: {
    color: '#B68FB2',
  },
  searchAndCategoryContainer: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchIcon: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#B68FB2',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 0.5,
  },
  categoryButton: {
    backgroundColor: '#F6F4F2',
    borderColor: '#B68FB2',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#B68FB2',
  },
  categoryButtonText: {
    color: '#B68FB2',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
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
    borderRadius: 5,
    width: '48%',
  },
  bookCover: {
    width: '100%',
    height: 250,
    borderRadius: 5,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#B68FB2',
    backgroundColor: '#F6F4F2',
  },
  pageButton: {
    color: '#B68FB2',
  },
  disabledButton: {
    color: '#C0C0C0',
  },
  pageInfo: {
    color: '#B68FB2',
  },
  scrollContainer: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'column', 
    alignItems: 'center',    
    marginLeft: 'auto',      
  },
  favoriteIconButton: {
    alignItems: 'center',   
  },
  favoriteHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#B68FB2',
    marginTop: 5,            
  },
  
  
});

export default BookList;
