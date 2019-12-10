import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationStackOptions } from 'react-navigation-stack';
import { SearchHeader } from '../../src/CupertinoHeader';

interface CupertinoProps {}

export function CupertinoScreen({}: CupertinoProps) {
  return (
    <View style={{ flex: 1 }}>
      {/* <SearchHeader /> */}

      <View style={{ flex: 1, backgroundColor: 'pink' }} />
    </View>
  );
}

CupertinoScreen.navigationOptions = {
  title: 'Search',
  headerStyle: {
    borderBottomWidth: 0,
  },
  header: (props) => <SearchHeader placeholder="Search" {...props} />,
} as NavigationStackOptions;
