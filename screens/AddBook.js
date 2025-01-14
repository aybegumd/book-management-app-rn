import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { addBook } from '../api'; 
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';  

const AddBook = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [isbn, setIsbn] = useState('');
    const [category, setCategory] = useState('');
    const [available, setAvailable] = useState(true);
    const [coverImage, setCoverImage] = useState(null);

    const handleAddBook = async () => {
        const book = {
            title,
            author,
            publishedDate,
            isbn,
            category,
            available,
            coverImage,  
        };

        try {
            await addBook(book);
            navigation.navigate('AdminPage'); 
        } catch (error) {
            console.error("Error adding the book:", error.message);
            alert("An error occurred while adding the book.");
        }
    };

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You must grant permission for the app to access the gallery.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,  
            allowsEditing: true,
            aspect: [1, 1],  
            quality: 1,  
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);  
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Add New Book</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor="#A0A4A8"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Author"
                        placeholderTextColor="#A0A4A8"
                        value={author}
                        onChangeText={setAuthor}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Published Date (YYYY-MM-DD)"
                        placeholderTextColor="#A0A4A8"
                        value={publishedDate}
                        onChangeText={setPublishedDate}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="ISBN"
                        placeholderTextColor="#A0A4A8"
                        value={isbn}
                        onChangeText={setIsbn}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Category"
                        placeholderTextColor="#A0A4A8"
                        value={category}
                        onChangeText={setCategory}
                    />
                </View>

                {/* Updated Pick Book Cover Image Button */}
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    <Ionicons name="image-outline" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
                    <Text style={styles.imagePickerButtonText}>Pick Book Cover Image</Text>
                </TouchableOpacity>

                {coverImage && (
                    <Image
                        source={{ uri: coverImage }}
                        style={styles.imagePreview}
                    />
                )}

                <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
                    <Text style={styles.addButtonText}>Add Book</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#e99c44',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 48,
        borderColor: '#e99c44',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        fontSize: 16,
        color: '#333333',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    imagePickerButton: {
        flexDirection: 'row',  
        backgroundColor: '#5f7bde',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 2,
    },
    imagePickerButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 15,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    addButton: {
        backgroundColor: '#e99c44',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 2,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default AddBook;
