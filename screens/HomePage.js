import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Image, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const HomePage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth();
    const lowerCaseEmail = email.toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, lowerCaseEmail, password);
      const user = userCredential.user;

      // Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firstName = docSnap.data().firstName; 

       
        navigation.navigate('BookList', { firstName });
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Error', 'The username or password is incorrect. Please try again.');
    }
  };

  const handleAdminLogin = () => {
    const adminUsername = 'Admin1';
    const adminPassword = '080502';

    if (email === adminUsername && password === adminPassword) {
      navigation.navigate('AdminPage');
    } else {
      Alert.alert('Admin Login Error', 'Admin username or password is incorrect. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
          <Image 
            source={require('../assets/bookpic.png')} 
            style={styles.image} 
          />
          <Text style={styles.welcomeText}>Welcome!</Text>
          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={email}
            onChangeText={setEmail}
            autoCompleteType="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
              <Text style={styles.buttonText}>User Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleAdminLogin}>
              <Text style={styles.buttonText}>Admin Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpPrompt}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.registerText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4F2',
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#B68FB2',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: '#B68FB2',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  signUpPrompt: {
    color: '#B68FB2',
    fontSize: 16,
  },
  registerText: {
    color: '#B68FB2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default HomePage;
