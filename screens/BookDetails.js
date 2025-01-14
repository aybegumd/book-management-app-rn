import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { fetchBookDetails } from '../api'; 

const BookDetail = ({ route }) => {
    const { bookId } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookDetails = async () => {
            try {
                const data = await fetchBookDetails(bookId);
                setBook(data);
            } catch (err) {
                setError("An error occurred while loading the book details.");
            } finally {
                setLoading(false);
            }
        };

        loadBookDetails();
    }, [bookId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#B68FB2" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                {/* Bulanık arka plan resmi */}
                <ImageBackground 
                    source={{ uri: book.coverImage }} 
                    style={styles.coverImageBackground} 
                    imageStyle={styles.bulkyCoverImage} 
                >
                    {/* net kapak resmi */}
                    <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
                </ImageBackground>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.author}>Author: <Text style={styles.value}>{book.author}</Text></Text>
                <Text style={styles.publishedDate}>Published Date: <Text style={styles.value}>{new Date(book.publishedDate).toLocaleDateString()}</Text></Text>
                <Text style={styles.isbn}>ISBN: <Text style={styles.value}>{book.isbn}</Text></Text>
                <Text style={styles.category}>Category: <Text style={styles.value}>{book.category}</Text></Text>
                <Text style={styles.available}>
                    Available: <Text style={[styles.value, { color: book.available ? 'green' : 'red' }]}>
                        {book.available ? 'Yes' : 'No'}
                    </Text>
                </Text>
                <Text style={styles.description}>{book.description}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F6F4F2',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center', 
        marginBottom: 20,
    },
    coverImageBackground: {
        width: 500, 
        height: 275, 
        borderRadius: 10,
        overflow: 'hidden', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    bulkyCoverImage: {
        opacity: 0.4, 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        resizeMode: 'cover',
    },
    coverImage: {
        width: 150, 
        height: 250, 
        borderRadius: 10,
        resizeMode: 'cover',
    },
    infoContainer: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 10,
        padding: 20,
        elevation: 5, 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#B68FB2',
        marginBottom: 10,
    },
    author: {
        fontSize: 18,
        marginBottom: 5,
        color: '#333',
    },
    publishedDate: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    isbn: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    category: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    available: {
        fontSize: 16,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    value: {
        fontWeight: 'bold',
    },
});

export default BookDetail;
