import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ onLogout, navigation }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const loadProducts = async () => {
        const stored = await AsyncStorage.getItem('products');
        const parsed = stored ? JSON.parse(stored) : [];
        setProducts(parsed);
        setFiltered(parsed);
      };
      loadProducts();
    }, [])
  );

  const deleteProduct = async id => {
    const updated = products.filter(item => item.id !== id);
    setProducts(updated);
    setFiltered(updated);
    await AsyncStorage.setItem('products', JSON.stringify(updated));
  };

  const goToProductManager = () => {
    navigation.navigate('ProductManager');
  };

  const handleSearch = text => {
    setSearchText(text);
    const filteredData = products.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.name}</Text>
      <Text style={styles.text}>₹ {item.price}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteProduct(item.id)}
      >
        <FontAwesome name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No Product Found</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.column}
          />
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={goToProductManager}>
        <FontAwesome name="plus" color="white" size={18} />
      </TouchableOpacity>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#E9446A',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  flatList: {
    width: '100%',
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  listContainer: {
    paddingBottom: 80,
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#FF5C5C',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 80,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
