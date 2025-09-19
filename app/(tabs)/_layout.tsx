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
        tabBarLabelStyle: { color: '#000' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beta Assistant',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="brain.head.profile.fill"
              color={focused ? '#000' : '#d1d5db'} // gray when focused
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Route Setting',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="mappin.and.ellipse.circle"
              color={focused ? '#000' : '#d1d5db'} // gray when focused
            />
          ),
        }}
      />
    </Tabs>
  );
}
