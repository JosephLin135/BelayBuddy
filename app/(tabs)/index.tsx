import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
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

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <ThemedText type="title" style={ styles.headerTitle}>
          BelayBuddy
        </ThemedText>
        <Button title="Sign In" onPress={() => router.push('/(auth)/sign-in')} />
      </View>
      <View>
        <ThemedText style= {styles.description}>AI Beta Assistant</ThemedText>
      </View>
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
    color: '#fff',
    paddingTop: 15,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  }
});
