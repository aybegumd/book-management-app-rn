import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './screens/HomePage';
import BookList from './screens/BookList';
import BookDetail from './screens/BookDetails';
import SignUp from './screens/SignUp'; 
import AdminPage from './screens/AdminPage'; 
import UserProfile from './screens/UserProfile'; 
import ChangePassword from './screens/ChangePassword'; 
import AddBook from './screens/AddBook'; 
import FavoriteBooks from './screens/FavoriteBooks';

import './firebase'; 

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{ title: 'Home Page' }} 
        />
        <Stack.Screen 
          name="BookList" 
          component={BookList} 
          options={{ title: 'Library' }} 
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetail} 
          options={{ title: 'Book Detail' }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="AdminPage" 
          component={AdminPage} 
          options={{ title: 'Admin Page' }} 
        />
        <Stack.Screen 
          name="AddBook"  
          component={AddBook} 
          options={{ title: 'Add New Book' }} 
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfile} 
          options={{ title: 'User Profile' }} 
        />
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePassword} 
          options={{ title: 'Change Password' }} 
        />
        <Stack.Screen 
          name="FavoriteBooks" 
          component={FavoriteBooks} 
          options={{ title: 'Favorite Books' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
