import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {useFonts, RobotoSlab_400Regular, RobotoSlab_500Medium} from '@expo-google-fonts/roboto-slab';
import { AppLoading } from 'expo';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';
import AppProvider from './src/hooks';

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" translucent/>
      <AppProvider>
        <View style={styles.container}>
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#312e38',
  },
});
