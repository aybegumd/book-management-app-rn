import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { db } from '../firebase'; 
import { doc, setDoc } from 'firebase/firestore'; 

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignup = async () => {
    let errorMessage = '';

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
    } else if (password.length < 6) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else if (!email.includes('@')) {
      errorMessage = 'Please enter a valid email address.';
    }

    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    const auth = getAuth(); 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      });

      Alert.alert('Success!', 'Registration successful, you can now log in.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      navigation.navigate('Home'); 
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Üst Kısım: Resim */}
      <Image 
        source={require('../assets/signup.png')} 
        style={styles.image} 
      />
      
      {/* Scrollable Form */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          
          {/* Sign Up Başlığı */}
          <Text style={styles.title}>Sign Up</Text>

          {/* First Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor="#B0B0B0"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor="#B0B0B0"
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#B0B0B0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#B0B0B0"
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#B0B0B0"
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Zaten bir hesabınız var mı? */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4F2',
  },
  image: {
    width: '100%',
    height: '50%', 
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
  },
  scrollViewContent: {
    flexGrow: 1, 
    justifyContent: 'flex-end', 
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 5,
    padding: 20,
    marginTop: '60%', 
  },
  title: {
    fontSize: 24,  
    fontWeight: 'bold',
    color: '#333', 
    textAlign: 'center',
    marginBottom: 20, 
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    color: '#B0B0B0', 
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#B68FB2',
    paddingVertical: 15,
    borderRadius: 50,
    alignSelf: 'center', 
    width: '50%', 
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: 40,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginButton: {
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#B68FB2',
    fontWeight: 'bold',
  },
});

export default SignUp;
