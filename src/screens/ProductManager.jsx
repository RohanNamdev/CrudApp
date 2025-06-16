import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProductManager = () => {
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const loadProducts = async () => {
    const json = await AsyncStorage.getItem('products');
    setProducts(json ? JSON.parse(json) : []);
  };

  const saveProduct = async () => {
    if (!imageUri || !title || !name || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newProduct = {
      id: editingProductId || Date.now().toString(),
      imageUri,
      title,
      name,
      price,
    };

    let updated;
    if (editingProductId) {
      updated = products.map(p => (p.id === editingProductId ? newProduct : p));
    } else {
      updated = [...products, newProduct];
    }

    setProducts(updated);
    await AsyncStorage.setItem('products', JSON.stringify(updated));

    setImageUri(null);
    setTitle('');
    setName('');
    setPrice('');
    setEditingProductId(null);
  };

  const deleteProduct = async id => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    await AsyncStorage.setItem('products', JSON.stringify(updated));
  };

  const editProduct = product => {
    setImageUri(product.imageUri);
    setTitle(product.title);
    setName(product.name);
    setPrice(product.price);
    setEditingProductId(product.id);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text>{item.name}</Text>
        <Text>₹ {item.price}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4B7BEC' }]}
            onPress={() => editProduct(item)}
          >
            <FontAwesome name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF5C5C' }]}
            onPress={() => deleteProduct(item.id)}
          >
            <FontAwesome name="trash" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{editingProductId ? 'Edit Product' : 'Add Product'}</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={{ color: '#888' }}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholderTextColor="#888"
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholderTextColor="#888"
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholderTextColor="#888"
        placeholder="Price"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={saveProduct}>
        <Text style={styles.buttonText}>
          {editingProductId ? 'Update Product' : 'Save Product'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        style={{ marginTop: 20 }}
        contentContainerStyle={products.length === 0 && { flex: 1, justifyContent: 'center', alignItems: 'center' }}
        numColumns={2}
        ListEmptyComponent={<Text style={{ color: '#aaa' }}>No products added</Text>}
        renderItem={renderProduct}
      />
    </View>
  );
};

export default ProductManager;

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#F9F9F9' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4B7BEC',
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  imageBox: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardImage: { width: '100%', height: 120 },
  cardContent: {
    padding: 10,
  },
  cardTitle: { fontWeight: 'bold', marginBottom: 4 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
