import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const cameraRef = useRef(null);

  // Cloudinary details
  const cloudName = '';    //use your own cloud name here
  const uploadPreset = ''; // <-- create this in Cloudinary dashboard, use your own

  // Imagga details
  const imaggaKey = '';  //use your own Imagga key here
  const imaggaSecret = '';  //use your own Imagga secret key here

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const uploadToCloudinary = async (photoUri) => {
    const data = new FormData();
    data.append('file', {
      uri: photoUri,
      type: 'image/jpg',
      name: 'photo.jpg',
    });
    data.append('upload_preset', uploadPreset);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const res = await axios.post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      Alert.alert('Upload Error', 'Failed to upload image to Cloudinary');
      return null;
    }
  };

  const getImaggaTags = async (imageUrl) => {
    const base64Auth = btoa(`${imaggaKey}:${imaggaSecret}`);
    try {
      const res = await axios.get('https://api.imagga.com/v2/tags', {
        headers: {
          Authorization: `Basic ${base64Auth}`,
        },
        params: {
          image_url: imageUrl,
        },
      });
      return res.data.result.tags.map((tag) => tag.tag.en);
    } catch (error) {
      console.error('Imagga error:', error);
      Alert.alert('Error', 'Failed to get tags from Imagga');
      return [];
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    setTags([]);

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const uploadedUrl = await uploadToCloudinary(photo.uri);
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      const imaggaTags = await getImaggaTags(uploadedUrl);
      setTags(imaggaTags);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }

    setLoading(false);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false)
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={Camera.Constants.Type.back} />

      <TouchableOpacity style={styles.captureBtn} onPress={takePicture} disabled={loading}>
        <Text style={styles.captureText}>{loading ? 'Processing...' : '📸'}</Text>
      </TouchableOpacity>

      {tags.length > 0 && (
        <ScrollView style={styles.tagsContainer}>
          <Text style={styles.tagsTitle}>Detected Tags:</Text>
          {tags.map((tag, i) => (
            <Text key={i} style={styles.tagText}>
              • {tag}
            </Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  captureBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#e91e63',
    padding: 20,
    borderRadius: 50,
  },
  captureText: { fontSize: 24, color: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tagsContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    backgroundColor: '#222',
    maxHeight: 150,
  },
  tagsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  tagText: {
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});













