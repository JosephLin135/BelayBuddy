import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Platform, StyleSheet, TextInput, TouchableOpacity, Text, FlatList, Alert, ActionSheetIOS } from 'react-native';
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
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // State for routes, modal, form fields, error, editing, etc.
  const [routes, setRoutes] = useState<{ name: string; image?: string; grade?: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRoute, setNewRoute] = useState('');
  const [newImage, setNewImage] = useState<string | undefined>(undefined);
  const [enlargedImage, setEnlargedImage] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState(''); // State for selected grade

  

  // Save or update a route (called when Save is pressed)
  const handleSaveRoute = () => {
    if (!newRoute.trim()) {
      setError('Route name is required.');
      return;
    }
    setError('');
    if (editIndex !== null) {
      // Edit mode: update existing route
      const updatedRoutes = [...routes];
      updatedRoutes[editIndex] = { name: newRoute.trim(), image: newImage, grade: selectedGrade };
      setRoutes(updatedRoutes);
      setEditIndex(null);
    } else {
      // Add mode: add new route
      setRoutes([...routes, { name: newRoute.trim(), image: newImage, grade: selectedGrade }]);
    }
    setNewRoute('');
    setNewImage(undefined);
    setModalVisible(false);
  };

  // Open modal to edit a route
  const handleEditRoute = (idx: number) => {
    setEditIndex(idx);
    setNewRoute(routes[idx].name);
    setNewImage(routes[idx].image);
    setSelectedGrade(routes[idx].grade ?? '');
    setModalVisible(true);
    setError('');
  };

  // Delete a route by index
  const deleteRoute = (idx: number) => {
    setRoutes(routes.filter((_, i) => i !== idx));
  };

  // Show confirmation before deleting a route
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

  // Handle picking/taking an image for a route
  const handleImageSelect = () => {
    if (Platform.OS === 'ios') {
      // iOS: show action sheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Take Photo
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
          } else if (buttonIndex === 2) {
            // Pick Image
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
              allowsEditing: true,
            });
            if (!result.canceled && result.assets.length > 0) {
              setNewImage(result.assets[0].uri);
            }
          }
        }
      );
    } else {
      // Android: show alert with options
      Alert.alert(
        'Add Image',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: async () => {
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
            }
          },
          { text: 'Choose from Library', onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
              });
              if (!result.canceled && result.assets.length > 0) {
                setNewImage(result.assets[0].uri);
              }
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  // Filter routes based on search text
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle grade selection
  const handleGradeSelect = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: Array.from({ length: 15 }, (_, i) => `V${i}`),
        },
        (buttonIndex) => {
          setSelectedGrade(buttonIndex.toString());
        }
      );
    } else {
      Alert.alert(
        'Select Grade',
        '',
        Array.from({ length: 15 }, (_, i) => ({
          text: `V${i}`,
          onPress: () => setSelectedGrade(i.toString()),
        }))
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <StatusBar style='dark'/>
      {/* App title and sign in button */}
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={styles.headerTitle}>
          BelayBuddy
        </ThemedText>
        <Button color="#47526a" title="Sign In" onPress={() => router.push('/(auth)/belay-sign-in')} />
      </View>
      {/* Description text */}
      <View>
        <ThemedText style={styles.description}>AI Beta Assistant</ThemedText>
      </View>
      {/* Header for route log and add button */}
      <View style={styles.header}>
        <Text style={styles.title}>My Routes Log</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>＋ Add</Text>
        </TouchableOpacity>
      </View>
      {/* Search bar and helper text (shown if there are routes) */}
      {routes.length > 0 && ( 
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8 }}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search routes..."
              style={{
                flex: 1,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#222',
                backgroundColor: '#fff',
                padding: 10,
                fontSize: 16,
                color: '#222',
              }}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={{
                marginLeft: 8,
                backgroundColor: '#47526a',
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#f8f6f2', fontWeight: 'bold', fontSize: 16 }}>Search</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
            <Text style={{ color: '#888', fontSize: 10 }}>
              Tap image to enlarge it
            </Text>
          </View>
        </>
      )}
      {/* List of routes */}
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.routeItem}>
            {/* Show route image if available */}
            {item.image && (
              <TouchableOpacity onPress={() => setEnlargedImage(item.image)}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 50, height: 50, borderRadius: 3, marginRight: 15 }}
                />
              </TouchableOpacity>
            )}
            {/* Route name and grade */}
            <View style={{ flex: 1 }}>
              <Text style={styles.routeText}>{item.name}</Text>
              <Text style={{ color: '#666', fontSize: 14 }}>
                Grade: {item.grade !== undefined && item.grade !== '' ? `V${item.grade}` : 'Not set'}
              </Text>
            </View>
            {/* Edit and Delete buttons */}
            <TouchableOpacity
              style={[styles.editButton, { marginRight: 8 }]}
              onPress={() => handleEditRoute(index)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeleteRoute(index)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        // Show message if no routes match search or if no routes exist
        ListEmptyComponent={
          searchText.trim().length > 0 && filteredRoutes.length === 0 ? (
            <Text style={styles.emptyText}>
              No route called "{searchText.trim()}"
            </Text>
          ) : (
            <Text style={styles.emptyText}>No routes yet. Add one!</Text>
          )
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {/* Modal for adding/editing a route */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editIndex !== null ? 'Edit Climb' : 'Add a Climb'}</Text>
            {/* Input for route name */}
            <TextInput
              value={newRoute}
              onChangeText={setNewRoute}
              placeholder="Route Name"
              style={styles.input}
              placeholderTextColor="#888"
            />
            {/* Error message if route name is missing */}
            {error ? (
              <Text style={{ color: '#ef4444', marginBottom: 8 }}>{error}</Text>
            ) : null}
            {/* Button to add/change image */}
            <TouchableOpacity style={[styles.imageButton]} onPress={handleImageSelect}>
              <Text style={[styles.imageText]}>
                {newImage ? 'Change Image' : 'Add Image'}
              </Text>
            </TouchableOpacity>
            {/* Show selected image */}
            {newImage && (
              <Image
                source={{ uri: newImage }}
                style={{ width: 100, height: 100, borderRadius: 4, marginVertical: 8 }}
              />
            )}

            {/* Grade selection button */}
            <TouchableOpacity
              onPress={handleGradeSelect}
              style={{
                marginBottom: 10,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: '#47526a',
                alignSelf: 'center',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
                {selectedGrade ? `Grade: V${selectedGrade}` : 'Select Grade'}
              </Text>
            </TouchableOpacity>

            {/* Save and Cancel buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 25, marginTop: 8 }}>
              <TouchableOpacity onPress={handleSaveRoute}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setEditIndex(null);
                setError('');
                setNewRoute('');
                setNewImage(undefined);
              }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal for enlarged route image */}
      <Modal visible={!!enlargedImage} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          onPress={() => setEnlargedImage(undefined)}
        >
          {enlargedImage && (
            <Image
              source={{ uri: enlargedImage }}
              style={{ width: 400, height: 450, borderRadius: 4 }}
            />
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Styles for all components
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 5,
    color: 'f8f6f2',
  },
  headerTitle: {
    fontSize: 35,
    fontFamily: Fonts.rounded,
    fontWeight: 900,
    color: '#47526a',
    paddingTop: 15,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 5,
    color: '#47526a',
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
    color: '#47526a',
  },
  addButton: {
    backgroundColor: '#47526a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#f8f6f2',
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
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  imageButton: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: -10,
    marginBottom: 6,
  },
  saveText: {
    color: '#fff',
    backgroundColor: '#799FCB',
    borderRadius: 8,
    paddingHorizontal: 14, 
    paddingVertical: 6,  
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelText: {
    color: '#fff',
    backgroundColor: '#F9665E',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6, 
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
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
  editButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
