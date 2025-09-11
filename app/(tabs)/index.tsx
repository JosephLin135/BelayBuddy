import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.headerLeft}>
          <ThemedText type="title" style={styles.headerTitle}>BelayBuddy</ThemedText>
        </ThemedView>
      </SafeAreaView>
      <ParallaxScrollView>
        <ThemedView style={styles.bodyInfo}>

        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
  paddingLeft: 5,
  marginBottom: 15,
  backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '300',
    fontFamily: 'Montserrat-Bold',
  },
  bodyInfo: {
    paddingTop: 15,
    backgroundColor: '#000',
  }
});
