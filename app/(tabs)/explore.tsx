import { Image } from 'expo-image';
import { Modal, Platform, StyleSheet, Touchable, Alert, ActionSheetIOS } from 'react-native';
import { SignedIn } from '@clerk/clerk-expo';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Button, View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';


export default function TabTwoScreen() {
  const router = useRouter();
  const grades = [
    'V0⇾V2',
    'V3⇾V5',
    'V6⇾V8',
    'V9⇾V11',
    'V12⇾V14',
  ];

  // State for selected grade, modal visibility, route description, saved routes, and enlarged description
  const [selectedGrades, setSelectedGrades] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeDescription, setRouteDescription] = useState('');
  const [routes, setRoutes] = useState<{ grade: string, gradeLevel: string, description: string }[]>([]);
  const [enlargedDescription, setEnlargedDescription] = useState<string | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('0'); // For grade selection in modal

  // Handle grade selection from the horizontal scroll bar
  const handleGradePress = (grade: string) => {
    setSelectedGrades(grade);
  };

  // Add a new route to the list if both grade and description are provided
  const handleAddRoute = () => {
    if (!selectedGrades) {
      Alert.alert('Select a grade range first!');
      return;
    }
    if (!routeDescription.trim()) {
      Alert.alert('Please enter a description.');
      return;
    }
    if (selectedGradeLevel === '0') {
      Alert.alert('Please select a grade level.');
      return;
    }
    setRoutes([
      ...routes,
      {
        grade: selectedGrades,
        gradeLevel: selectedGradeLevel,
        description: routeDescription.trim()
      }
    ]);
    setModalVisible(false);
    setRouteDescription('');
    setSelectedGradeLevel('0');
  };

  // Remove a route by index
  const deleteRoute = (idx: number) => {
    setRoutes(routes.filter((_, i) => i !== idx));
  };

  // Wrap deleteRoute with a confirmation dialog
  const confirmDeleteRoute = (idx: number) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoute(idx) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Grade selection for modal (similar to index.tsx)
  const handleGradeSelect = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: Array.from({ length: 15 }, (_, i) => `V${i}`),
        },
        (buttonIndex) => {
          setSelectedGradeLevel(buttonIndex.toString());
        }
      );
    } else {
      Alert.alert(
        'Select Grade',
        '',
        Array.from({ length: 15 }, (_, i) => ({
          text: `V${i}`,
          onPress: () => setSelectedGradeLevel(i.toString()),
        }))
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'#fff' }}>
      <StatusBar style='dark'/>
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={ styles.headerTitle}>
          RouteVision
        </ThemedText>
        <Button color='#47526a'  title="Sign In" onPress={() => router.push('/(auth)/route-sign-in')} />
      </View>
      <View>
        <ThemedText style={styles.description}>AI Route Setting</ThemedText>
      </View>
      <View>
        <ScrollView horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navBar}
          contentContainerStyle={{alignItems: 'center', paddingHorizontal: 8}}
        >
          {grades.map((grade, idx) => (
            <TouchableOpacity key={grade + idx} style={styles.navItem} onPress={() => handleGradePress(grade)}>
              <Text style={styles.navText}>{grade}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ padding: 20 }}>
          {/* Header for selected grade and add route button */}
          {selectedGrades && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <Text style={{ color: '#47526a', fontWeight: 'bold'}}>{selectedGrades} Routes</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (!selectedGrades) setSelectedGrades(grades[0]);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.addButtonText}>＋ New Route</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Show saved routes for the selected grade */}
          {routes.filter(r => !selectedGrades || r.grade === selectedGrades).length > 0 && (
            <View style={{ marginTop: 8 }}>
              {routes.filter(r => !selectedGrades || r.grade === selectedGrades).map((route, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: '#e5e7eb',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#222', fontWeight: 'bold' }}>
                      Grade: V{route.gradeLevel}
                    </Text>
                    <TouchableOpacity onPress={() => setEnlargedDescription(route.description)}>
                      <Text style={{ color: '#222', textDecorationLine: 'underline' }}>
                        {route.description.length > 40
                          ? route.description.slice(0, 40) + '...'
                          : route.description}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* Delete button for each route */}
                  <TouchableOpacity
                    style={styles.smallDeleteButton}
                    onPress={() => confirmDeleteRoute(idx)}
                  >
                    <Text style={styles.smallDeleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      {/* Modal for adding a new route */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Route Description</Text>
            <TextInput
              value={routeDescription}
              onChangeText={setRouteDescription}
              placeholder="Describe your route idea"
              style={styles.input}
              placeholderTextColor='#888'
              multiline
              numberOfLines={6}
              textAlignVertical='top'
            />
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
                {selectedGradeLevel ? `Grade: V${selectedGradeLevel}` : 'Select Grade'}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddRoute}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setRouteDescription('');
                  setSelectedGradeLevel('0');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal for enlarged description */}
      <Modal visible={!!enlargedDescription} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          activeOpacity={1}
          onPress={() => setEnlargedDescription(null)}
        >
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            padding: 24,
            maxWidth: 350,
            width: '90%',
            maxHeight: 400,
            alignItems: 'center'
          }}>
            <Text style={{ color: '#222', fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Description</Text>
            <ScrollView>
              <Text style={{ color: '#222', fontSize: 16 }}>{enlargedDescription}</Text>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      <ParallaxScrollView>
      </ParallaxScrollView>
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
    color: '#47526a',
    paddingTop: 15,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    fontFamily: Fonts.rounded,
    paddingTop: 10,
    color: '#47526a',
    fontWeight: 800,
  },
  navBar: {
    marginTop: 10,
    height: 50,
  },
  navItem: {
    backgroundColor: '#e1dbcb',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  navText: {
    fontSize: 12,
    color: '#47526a',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e1dbcb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  addButtonText: {
    color: '#47526a',
    fontWeight: 'bold',
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
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#222',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#222',
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
  smallDeleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 12,
    alignSelf: 'flex-end',
  },
  smallDeleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#799FCB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F9665E',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
