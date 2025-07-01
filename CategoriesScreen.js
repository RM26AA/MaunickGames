import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const SCREEN_WIDTH = Dimensions.get('window').width;
const RAWG_API_KEY = '';    //use your own RAWG API key here
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const categories = ['Action', 'Indie', 'Strategy'];

const CategoriesScreen = ({ navigation }) => {
  const [categoryGames, setCategoryGames] = useState({});
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [gamesByLetter, setGamesByLetter] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gamesByCategory, setGamesByCategory] = useState([]);

  useEffect(() => {
    categories.forEach(async (cat) => {
      try {
        const res = await axios.get(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=${cat.toLowerCase()}&page_size=10`
        );
        const randomGame = res.data.results[Math.floor(Math.random() * res.data.results.length)];
        setCategoryGames((prev) => ({ ...prev, [cat]: randomGame }));
      } catch (err) {
        console.log(`Failed to fetch ${cat} games`, err.message);
      }
    });
  }, []);

  const fetchGamesByLetter = async (letter) => {
    setSelectedCategory(null);
    setSelectedLetter(letter);
    try {
      const res = await axios.get(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${letter}&page_size=20`
      );
      setGamesByLetter(res.data.results);
    } catch (err) {
      console.log('Error fetching by letter:', err.message);
    }
  };

  const fetchGamesByCategory = async (category) => {
    setSelectedLetter(null);
    setSelectedCategory(category);
    try {
      const res = await axios.get(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=${category.toLowerCase()}&page_size=20`
      );
      setGamesByCategory(res.data.results);
    } catch (err) {
      console.log('Error fetching by category:', err.message);
    }
  };

  const renderGameCard = ({ item }) => (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
    >
      <Image source={{ uri: item.background_image }} style={styles.verticalImage} />
      <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Categories</Text>
      </View>

      {/* A–Z Index Bar */}
      <View style={styles.alphabetWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.alphabetContainer}
        >
          {alphabet.map((letter) => (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterButton,
                selectedLetter === letter && styles.letterButtonActive,
              ]}
              onPress={() => fetchGamesByLetter(letter)}
            >
              <Text
                style={[
                  styles.letterText,
                  selectedLetter === letter && styles.letterTextActive,
                ]}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Cards Row */}
      <View style={styles.categoryRow}>
        {categories.map((cat) => {
          const game = categoryGames[cat];
          return (
            <TouchableOpacity
              key={cat}
              style={styles.smallCard}
              onPress={() => fetchGamesByCategory(cat)}
            >
              {game && (
                <Image
                  source={{ uri: game.background_image }}
                  style={styles.smallImage}
                />
              )}
              <Text style={styles.smallCardText}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results Section */}
      <Text style={styles.sectionTitle}>
        {selectedLetter
          ? `Games starting with "${selectedLetter}"`
          : selectedCategory
          ? `${selectedCategory} Games`
          : ''}
      </Text>

      <FlatList
        data={selectedLetter ? gamesByLetter : gamesByCategory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGameCard}
        contentContainerStyle={styles.gamesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 170,
    height: 100,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  alphabetWrapper: {
    height: 50,
    justifyContent: 'center',
  },
  alphabetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  letterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    margin: 4,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  letterButtonActive: {
    backgroundColor: '#e91e63',
  },
  letterText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  letterTextActive: {
    color: '#fff',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  smallCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    alignItems: 'center',
  },
  smallImage: {
    width: '100%',
    height: 70,
  },
  smallCardText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 16,
    marginVertical: 10,
  },
  gamesList: {
    paddingHorizontal: 16,
  },
  verticalCard: {
    marginBottom: 16,
  },
  verticalImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    marginTop: 6,
  },
});

export default CategoriesScreen;



