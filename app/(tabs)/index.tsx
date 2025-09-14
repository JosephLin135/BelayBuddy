import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Platform, StyleSheet, TextInput, TouchableOpacity, Text, FlatList, Alert } from 'react-native';
import { SignedIn } from '@clerk/clerk-expo';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();

  const [routes, setRoutes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoute, setNewRoute] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>(undefined);

  const addRoute = () => {
    if (newRoute.trim()) {
      setRoutes([...routes, newRoute.trim()]);
      setNewRoute('');
      setNewImage(undefined);
      setModalVisible(false);
    }
  };

  const deleteRoute = (idx: number) => {
    setRoutes(routes.filter((_, i) => i !== idx));
  };

  // Add confirmation before deleting
  const confirmDeleteRoute = (idx: number) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoute(idx) },
      ]
    );
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        setNewImage(result.assets[0].uri);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      setNewImage(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar style='dark'/>
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.headerTitle}>
          BelayBuddy
        </ThemedText>
        <Button color="#000" title="Sign In" onPress={() => router.push('/(auth)/belay-sign-in')} />
      </View>
      <View>
        <ThemedText style={styles.description}>AI Beta Assistant</ThemedText>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>My Routes Log</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={routes}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.routeItem}>
            <Text style={styles.routeText}>{item}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeleteRoute(index)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No routes yet. Add one!</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Climb</Text>
            <TextInput
              value={newRoute}
              onChangeText={setNewRoute}
              placeholder="Route Name"
              style={styles.input}
              placeholderTextColor="#888"
            />

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                <Text style={styles.imageText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageText}>
                  {newImage ? 'Change Image' : 'Pick Image'}
                </Text>
              </TouchableOpacity>
            </View>
            {newImage && (
              <Image
                source={{ uri: newImage }}
                style={{ width: 100, height: 100, borderRadius: 12, marginVertical: 8 }}
              />
            )}
            <View style={{ flexDirection: 'row', gap: 110}}>
            <TouchableOpacity style={styles.cancelText} onPress={addRoute}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: Fonts.rounded,
    fontWeight: 900,
    color: '#000',
    paddingTop: 15,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 5,
    color: '#000',
    fontWeight: 800,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: 900,
    color: '#222',
  },
  addButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 32,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    margin: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#222',
  },
  imageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  routeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeText: {
    fontSize: 18,
    color: '#222',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
