import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';

const ContactScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const handleSend = () => {
    if (!fullName || !email || !phone || !message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // You can plug in email sending service here (e.g. EmailJS, Firebase)

    Alert.alert('Message Sent', 'Thank you for contacting us!');
    resetForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Logo & Title */}
          <View style={styles.header}>
            <Image
              source={require('../assets/logo1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Contact</Text>
          </View>

          {/* Form */}
          <View style={styles.formGroup}>
            <FontAwesome name="user" size={20} color="#fff" style={styles.icon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <MaterialIcons name="email" size={20} color="#fff" style={styles.icon} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Feather name="phone" size={20} color="#fff" style={styles.icon} />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroupMessage}>
            <Feather name="message-square" size={20} color="#fff" style={styles.icon} />
            <TextInput
              placeholder="Message"
              placeholderTextColor="#aaa"
              multiline
              value={message}
              onChangeText={setMessage}
              style={styles.inputMessage}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scroll: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 90,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
  formGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  formGroupMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#111',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
    paddingTop: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: 50,
  },
  inputMessage: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    height: 100,
    paddingTop: 12,
  },
  button: {
    backgroundColor: '#ff4757',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
