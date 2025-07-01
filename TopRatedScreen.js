import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const { width } = Dimensions.get('window');
const RAWG_API_KEY = '';    //use your own RAWG api key here

const TopRatedScreen = ({ navigation }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedGames();
  }, []);

  const fetchTopRatedGames = async () => {
    try {
      const res = await axios.get(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&ordering=-rating&page_size=20`
      );
      setGames(res.data.results);
    } catch (err) {
      console.error('Failed to fetch top rated games:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
      >
        <Image
          source={{ uri: item.background_image || 'https://via.placeholder.com/400' }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Top Rated Games</Text>
      </View>

      {/* Loader or List */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default TopRatedScreen;

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
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: width - 32,
    height: 200,
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    color: '#ffcc00',
    fontSize: 14,
    marginTop: 4,
  },
});

