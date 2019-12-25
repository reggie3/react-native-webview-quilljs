import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SampleComponent() {
  return (
    <View style={styles.container}>
      <Text>Here is the test package component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
