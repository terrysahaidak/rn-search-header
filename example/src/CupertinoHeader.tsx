import React, { useRef, useCallback, useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TextInput,
  View,
  LayoutChangeEvent,
  Easing,
} from 'react-native';
import {
  Header as RNHeader,
  HeaderProps,
} from 'react-navigation-stack';
import { SceneInterpolatorProps } from 'react-navigation-stack/lib/typescript/types';
import { useTween } from './useTween';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Header() {
  return (
    <View style={s.headerContainer}>
      <View style={s.header} />
    </View>
  );
}

const LANDSCAPE_HEADER_HEIGHT = 32;
const DURATION = 250;
const STATUS_BAR = 20;
const APPBAR_HEIGHT = 44;
const FULL_HEADER = STATUS_BAR + APPBAR_HEIGHT; // 64 (20 + 44)
const SEARCH_BAR_HEIGHT = 36;
const PADDING_HORIZONTAL = 16;
const INACTIVE_PADDING_BOTTOM = 16;
const ACTIVE_VERTICAL_PADDING = 8;
const ACTIVE_SEARCH_HEADER =
  STATUS_BAR +
  ACTIVE_VERTICAL_PADDING +
  SEARCH_BAR_HEIGHT +
  ACTIVE_VERTICAL_PADDING;
const INACTIVE_SEARCH_HEADER =
  FULL_HEADER + SEARCH_BAR_HEIGHT + INACTIVE_PADDING_BOTTOM;
// regular header height
// active search header height 72 (20 + 36 + 8 + 8)
// inactive search header height 72 (20 + 44 + 36 + 16)
// Search box 36
// Padding horizontal 16
// active padding bottom 8
// inactive padding bottom 16

type IProps = HeaderProps & {
  leftLabelInterpolator: (props: SceneInterpolatorProps) => any;
  leftButtonInterpolator: (props: SceneInterpolatorProps) => any;
  titleFromLeftInterpolator: (props: SceneInterpolatorProps) => any;
  layoutInterpolator: (props: SceneInterpolatorProps) => any;
  theme: string;
};

export interface SearchHeaderProps extends IProps {
  isHeaderHidden?: boolean;
  placeholder: string;
}

const s = StyleSheet.create({
  // mock
  headerContainer: {
    paddingTop: STATUS_BAR,
    backgroundColor: 'white',
  },
  header: {
    height: APPBAR_HEIGHT,
    backgroundColor: 'gray',
  },

  // actual styles
  container: {
    zIndex: 1000,
    backgroundColor: 'white',
    borderBottomColor: '#d6d6d6',
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  searchBox: {
    flex: 1,
    marginHorizontal: PADDING_HORIZONTAL,
  },
  input: {
    paddingLeft: 8,
    backgroundColor: '#EBEBEC',
    height: SEARCH_BAR_HEIGHT,
    borderRadius: 8,
    fontSize: 17,
    color: '#000',
  },
  dismissButton: {
    color: '#037aff',
    fontSize: 17,
  },
  buttonContainer: {
    // position: 'absolute',
  },
});

function useLayout(): [
  { height: number; width: number },
  (evt: LayoutChangeEvent) => void,
] {
  const [layout, setLayout] = useState({
    height: 0,
    width: 0,
  });

  const onLayout = useCallback((evt: LayoutChangeEvent) => {
    setLayout(evt.nativeEvent.layout);
  }, []);

  return [layout, onLayout];
}

export function SearchHeader({
  placeholder,
  searchBoxLeadingComponent,
  ...props
}: SearchHeaderProps) {
  const inputRef = useRef<TextInput>(null);
  const [button, onButtonLayout] = useLayout();

  const initiallyActive =
    props.scene.route.params?.['initiallyActive'];
  const autoFocus = props.scene.route.params?.['autoFocus'];

  const { values, ...animation } = useTween(
    () => ({
      initiallyActive,
      duration: DURATION,
      easing: Easing.inOut(Easing.ease),
      from: {
        searchBoxMarginTop: 0,
        searchBoxMarginBottom: 16,
        buttonMarginRight: -button.width,
      },
      to: {
        searchBoxMarginTop: -APPBAR_HEIGHT + ACTIVE_VERTICAL_PADDING,
        searchBoxMarginBottom: ACTIVE_VERTICAL_PADDING,
        buttonMarginRight: 16,
      },
    }),
    [button.width],
  );

  const headerOpacity = animation.transition.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [1, 0, 0],
  });
  const buttonOpacity = animation.transition.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  function onFocus() {
    animation.play();
  }

  function onBlur() {
    inputRef.current?.blur();
    animation.playBackward();
  }

  return (
    <Animated.View style={s.container}>
      <Animated.View style={{ opacity: headerOpacity }}>
        <RNHeader {...props} />
      </Animated.View>

      <Animated.View
        style={[
          s.searchContainer,
          {
            marginTop: values.searchBoxMarginTop,
            marginBottom: values.searchBoxMarginBottom,
          },
        ]}
      >
        <Animated.View style={s.searchBox}>
          <View style={s.searchBoxLeadingComponent}>
            {searchBoxLeadingComponent}
          </View>
          <TextInput
            ref={inputRef}
            onFocus={onFocus}
            onBlur={onBlur}
            style={s.input}
            autoFocus={autoFocus}
            placeholder={placeholder}
            placeholderTextColor="#838388"
          />
        </Animated.View>
        <Animated.View
          style={[
            s.buttonContainer,
            {
              marginRight: values.buttonMarginRight,
              opacity: buttonOpacity,
            },
          ]}
        >
          <TouchableOpacity onPress={onBlur}>
            <Text onLayout={onButtonLayout} style={s.dismissButton}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
  // return <Header {...props} />;
}
