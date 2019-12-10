import React from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { NavigationStackOptions } from 'react-navigation-stack';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface GestureProps {}

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const circleRadius = 30;
class Circle extends React.Component {
  _touchX = new Animated.Value(30);
  _touchY = new Animated.Value(64);
  _onPanGestureEvent = Animated.event(
    [{ nativeEvent: { x: this._touchX, y: this._touchY } }],
    { useNativeDriver: true },
  );
  translateX = Animated.add(
    this._touchX,
    new Animated.Value(-circleRadius),
  );
  translateY = Animated.add(
    this._touchY,
    new Animated.Value(-circleRadius),
  );

  render() {
    return (
      <PanGestureHandler onGestureEvent={this._onPanGestureEvent}>
        <Animated.View
          style={{
            height: 150,
            justifyContent: 'center',
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: '#42a5f5',
                height: circleRadius * 2,
                width: circleRadius * 2,
              },
              {
                transform: [
                  {
                    translateX: this.translateX,
                  },
                  {
                    translateY: this.translateY,
                  },
                ],
                borderRadius: this.translateY.interpolate({
                  inputRange: [0, windowWidth],
                  outputRange: [0, circleRadius],
                }),
                height: this.translateY.interpolate({
                  inputRange: [64, windowHeight],
                  outputRange: [circleRadius * 2, circleRadius * 6],
                }),
                width: this.translateX.interpolate({
                  inputRange: [0, windowWidth],
                  outputRange: [circleRadius * 2, circleRadius * 6],
                }),
                backgroundColor: this.translateY.interpolate({
                  inputRange: [0, windowWidth],
                  outputRange: ['red', 'blue'],
                }),
              },
            ]}
          />
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

export function GestureScreen({}: GestureProps) {
  return (
    <View style={{ flex: 1 }}>
      <Circle />
    </View>
  );
}

GestureScreen.navigationOptions = {
  title: 'Search',
  headerStyle: {
    borderBottomWidth: 0,
  },
} as NavigationStackOptions;
