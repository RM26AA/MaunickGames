import React, { useState, useEffect } from 'react';
import { View, Button, Image, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CLOUDINARY_URL = '';    //use your own cloudinary URL here 
const CLOUDINARY_UPLOAD_PRESET = ''; // make sure this is your unsigned preset name, Use your own cloudinary upload preset code/name here
const IMAGGA_API_KEY = '';   //use your own Imagga api key here
const IMAGGA_API_SECRET = '';     //use your own Imagga API secret key here
const RAWG_API_KEY = '';    //use your own RAWG api key here

export default function UploadImageScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need permission to access your gallery.');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResults([]);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const uploadAndAnalyze = async () => {
    if (!image) {
      Alert.alert('No image', 'Please pick an image first.');
      return;
    }
    setUploading(true);
    setResults([]);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const cloudResp = await axios.post(CLOUDINARY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = cloudResp.data.secure_url;
      if (!imageUrl) throw new Error('No image URL from Cloudinary');

      // Get tags from Imagga
      const auth = Buffer.from(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`).toString('base64');
      const imaggaResp = await axios.get(
        `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`,
        { headers: { Authorization: `Basic ${auth}` } }
      );

      const tags = imaggaResp.data.result.tags
        .slice(0, 3)
        .map(tag => tag.tag.en)
        .join(',');

      if (!tags) throw new Error('No tags found');

      // Search RAWG games by tags
      const rawgResp = await axios.get(
        `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(tags)}`
      );

      setResults(rawgResp.data.results || []);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong with image recognition.');
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Processing image...</Text>
      </View>
    );
  }

  if (results.length > 0) {
    return (
      <ScrollView style={{ backgroundColor: '#000' }}>
        <Text style={styles.resultTitle}>Similar Games:</Text>
        {results.map((game, i) => (
          <TouchableOpacity
            key={game.id || i}
            onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
            style={styles.card}
          >
            {game.background_image && <Image source={{ uri: game.background_image }} style={styles.cardImage} />}
            <Text style={styles.cardTitle}>{game.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => {
          setResults([]);
          setImage(null);
        }} style={styles.retryBtn}>
          <Text style={styles.retryText}>📷 Try Another</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
        <Text style={styles.uploadText}>📁 Upload Image from Gallery</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      {image && (
        <TouchableOpacity onPress={uploadAndAnalyze} style={styles.analyzeBtn}>
          <Text style={styles.analyzeText}>Analyze Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  uploadBtn: { backgroundColor: '#e91e63', padding: 15, borderRadius: 30, marginBottom: 15 },
  uploadText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  analyzeBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 30, marginTop: 20 },
  analyzeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  preview: { width: 250, height: 250, borderRadius: 10, marginTop: 10 },
  resultTitle: { fontSize: 22, marginVertical: 20, textAlign: 'center', color: '#fff' },
  card: { margin: 10, backgroundColor: '#222', borderRadius: 10, overflow: 'hidden' },
  cardImage: { width: '100%', height: 180 },
  cardTitle: { padding: 10, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  retryBtn: { marginVertical: 20, alignSelf: 'center', backgroundColor: '#e91e63', padding: 12, borderRadius: 30 },
  retryText: { color: '#fff', fontWeight: 'bold' },
};








