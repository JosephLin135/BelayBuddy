import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { backgroundColor: '#FFF' },
        tabBarLabelStyle: { color: '#000'},
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beta Assistant',
          tabBarIcon: () => <IconSymbol size={28} name="brain.head.profile.fill" color='#000' />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Route Setting',
          tabBarIcon: () => <IconSymbol size={28} name="mappin.and.ellipse.circle" color='#000' />,
        }}
      />
    </Tabs>
  );
}
