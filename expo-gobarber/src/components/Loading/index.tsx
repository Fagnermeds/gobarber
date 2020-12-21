import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Loading: React.FunctionComponent = () => (
  <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#312e38" }}>
    <ActivityIndicator size="large" />
  </View>
);

export default Loading;
