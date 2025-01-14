import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBooks } from '../api';

const FavoriteBooks = ({ route, navigation }) => {
  const { email } = route.params;
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [booksDetails, setBooksDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem(`favoriteBooks_${email}`);
      if (favorites) {
        const favoriteIds = JSON.parse(favorites);
        setFavoriteBooks(favoriteIds);
        const allBooks = await fetchBooks();
        const favoritesDetails = allBooks.filter(book => favoriteIds.includes(book.id));
        setBooksDetails(favoritesDetails);
      } else {
        setFavoriteBooks([]);
        setBooksDetails([]);
      }
    } catch (err) {
      setError("An error occurred while loading favorite books.");
      setFavoriteBooks([]);
      setBooksDetails([]);
    } finally {
      setLoading(false);
    }
  };

  loadFavorites();
}, [email]); 
  if (loading) {
    return <ActivityIndicator size="large" color="#B68FB2" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Favorite Books</Text>
      <FlatList
        data={booksDetails}
        keyExtractor={(item) => item.id.toString()}
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
          </TouchableOpacity>
        )}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B68FB2',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center', 
  },
  bookCover: {
    width: 100, 
    height: 150, 
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default FavoriteBooks;
