import { Tabs } from 'expo-router';

export default function TabLayout() {
 return (
  <Tabs
   tabBar={() => null}
   screenOptions={{ headerShown: false }}
  >
   <Tabs.Screen name="index" />
  </Tabs>
 );
}