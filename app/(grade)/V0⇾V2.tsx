import { SafeAreaView, Text, View } from 'react-native';

export default function V0V2Screen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#222' }}>V0⇾V2 Routes</Text>
      </View>
    </SafeAreaView>
  );
}