import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

const apiKey = '';    //use your own RAWG api key here

export default function GameDetailScreen({ route, navigation }) {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGameDetails();
  }, []);

  const fetchGameDetails = async () => {
    try {
      const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
      const data = await res.json();
      setGame(data);

      const ssRes = await fetch(`https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`);
      const ssData = await ssRes.json();
      setScreenshots(ssData.results.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  if (!game) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title */}
        <Text style={styles.title}>{game.name}</Text>

        {/* Cover */}
        <Image source={{ uri: game.background_image }} style={styles.coverImage} />

        {/* Info Boxes */}
        <View style={styles.infoBoxes}>
          <InfoBox icon="star" label="Rating" value={`${game.rating} / ${game.rating_top}`} />
          <InfoBox icon="game-controller" label="Platforms" value={game.platforms.map(p => p.platform.name).join(', ')} />
          <InfoBox icon="apps" label="Genres" value={game.genres.map(g => g.name).join(', ')} />
          <InfoBox icon="pricetags" label="Tags" value={game.tags.slice(0, 5).map(tag => tag.name).join(', ')} />
          <InfoBox icon="code" label="Developers" value={game.developers?.map(d => d.name).join(', ') || 'N/A'} />
          <InfoBox icon="people" label="Publishers" value={game.publishers?.map(p => p.name).join(', ') || 'N/A'} />
          {game.website ? (
            <TouchableOpacity onPress={() => Linking.openURL(game.website)}>
              <InfoBox icon="globe" label="Website" value={game.website} link />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{game.description_raw || 'No description available.'}</Text>

        {/* Screenshots */}
        <Text style={styles.sectionTitle}>Screenshots</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {screenshots.map((ss, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedImage(ss.image)}>
              <Image source={{ uri: ss.image }} style={styles.screenshot} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Expand Image Modal */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <Swiper
      loop={false}
      showsPagination={true}
      index={screenshots.findIndex(ss => ss.image === selectedImage)}
      onIndexChanged={(index) => setSelectedImage(screenshots[index]?.image)}
    >
      {screenshots.map((ss, i) => (
        <View key={i} style={styles.swiperSlide}>
          <Image source={{ uri: ss.image }} style={styles.modalImage} resizeMode="contain" />
        </View>
      ))}
    </Swiper>
    <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedImage(null)}>
      <Ionicons name="close" size={30} color="#fff" />
    </TouchableOpacity>
  </View>
</Modal>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Info box component
function InfoBox({ icon, label, value, link }) {
  return (
    <View style={styles.infoBox}>
      <Ionicons name={icon} size={18} color="#e91e63" style={{ marginRight: 6 }} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.infoValue, link && { color: '#1e90ff' }]} >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    textAlign: 'center',
    marginVertical: 10,
  },
  coverImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoBoxes: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 6,
  },
  infoValue: {
  flex: 1,
  color: '#ddd',
  flexWrap: 'wrap', // ✅ allows multi-line
},

  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 6,
  },
  description: {
    color: '#ccc',
    paddingHorizontal: 16,
    marginBottom: 20,
    lineHeight: 20,
  },
  screenshot: {
    width: 160,
    height: 90,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '60%',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalCloseArea: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
  position: 'absolute',
  top: 70, // change this dynamically based on your logo if needed
  left: 16,
  backgroundColor: '#e91e63',
  padding: 8,
  borderRadius: 20,
  zIndex: 5,
},

  loading: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
  swiperSlide: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

});
