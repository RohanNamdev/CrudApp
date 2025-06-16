import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSecureEntry = () => setSecureText(!secureText);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      return setError('Both email and password are required.');
    }

    if (email === 'test@example.com' && password === '123456') {
      setLoading(true);
      await AsyncStorage.setItem('token', 'dummy-token');
      Alert.alert('Success', 'Login Successful!');
      onLoginSuccess();
      setLoading(false);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/login.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Login</Text>

        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={20} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#999"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
          />
          <TouchableOpacity onPress={toggleSecureEntry}>
            <Ionicons
              name={secureText ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginRight: 8,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
