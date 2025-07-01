// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';


// Screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import TopRatedScreen from './screens/TopRatedScreen';
import UpcomingScreen from './screens/UpcomingScreen';
import ContactScreen from './screens/ContactScreen';
import CameraScreen from './screens/CameraScreen';

import GameDetailScreen from './screens/GameDetailScreen';
import UploadImageScreen from './screens/UploadImageScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator (bottom nav bar)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0d0d0d' },
        tabBarActiveTintColor: '#fff',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Categories':
              iconName = 'grid';
              break;
            case 'Top Rated':
              iconName = 'star';
              break;
            case 'Upcoming':
              iconName = 'calendar';
              break;
            case 'Contact':
              iconName = 'mail';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Top Rated" component={TopRatedScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Contact" component={ContactScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="GameDetail" component={GameDetailScreen} />
        <Stack.Screen name="Upload" component={UploadImageScreen} />
        <Stack.Screen name="Top Rated" component={TopRatedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



