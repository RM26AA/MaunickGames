import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const apiKey = '';    //use your own RAWG api key here

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchActionGames();
  }, []);

  const fetchActionGames = async () => {
    try {
      const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&genres=action&page_size=12`);
      const data = await res.json();
      setGames(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const searchGames = async () => {
    if (!search.trim()) return;
    Keyboard.dismiss();
    try {
      const res = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(search)}&page_size=12`);
      const data = await res.json();
      setGames(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const renderGameCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
    >
      <Image source={{ uri: item.background_image }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Discover Amazing Games</Text>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search games..."
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchGames}
          style={styles.searchInput}
        />
      </View>

      {/* Games */}
      <FlatList
        data={games}
        keyExtractor={item => item.id.toString()}
        renderItem={renderGameCard}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    padding: 8,
  },
  
});


