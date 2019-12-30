import { Text, View } from "react-native";
import React from "react";
import { DotIndicator } from "react-native-indicators";
export default (props: any) => {
  return (
    <View style={{ backgroundColor: "lightyellow" }}>
      <Text style={{ color: "black" }}>
        Basic React Native Typescript Package xxx
      </Text>
      <View>
        <DotIndicator color="blue" />
      </View>
    </View>
  );
};
