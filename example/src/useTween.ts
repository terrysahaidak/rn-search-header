import { useState, useCallback, useMemo } from 'react';
import { Animated, EasingFunction, Easing } from 'react-native';

export interface AnimationValues {
  [key: string]: Animated.Value;
}

export interface AnimationInputValues {
  [key: string]: number;
}

export interface TimingTweenAnimation<T> {
  duration: number;
  initiallyActive?: boolean;
  easing?: EasingFunction;
  from: T;
  to: T;
}

export type AnimatedValues<T> = { [K in keyof T]: Animated.Value };

export interface AnimationBag<T extends AnimationInputValues> {
  transition: Animated.Value;
  values: AnimatedValues<T>;
  play(onFinish?: () => void): void;
  playBackward(onFinish?: () => void): void;
  stop(): void;
}

export type TweenAnimationProps<T> = TimingTweenAnimation<T>;

export interface TweenAnimationValues {
  from: AnimationValues;
  to: AnimationValues;
}

interface Animation<T extends AnimationInputValues>
  extends AnimationBag<T> {
  animation?: any; // TODO: Use better type
}

export function isNumber(v: any): v is number {
  return typeof v === 'number';
}

function generateTweenAnimation<T extends AnimationInputValues>(
  props: TweenAnimationProps<T>,
): Animation<T> {
  const keys = Object.keys(props.from);
  let currentStartValue = props.initiallyActive ? 1 : 0;
  const masterValue = new Animated.Value(currentStartValue);
  const inputRange: [number, number] = [0, 1];

  const values: AnimatedValues<T> = keys.reduce((acc, current) => {
    const from = props.from[current];
    const to = props.to[current];

    if (isNumber(from) && isNumber(to)) {
      acc[current] = masterValue.interpolate({
        inputRange,
        outputRange: [from, to],
      });
    } else {
      throw new Error(
        `Unsupported value 'from: ${from}, to: ${to}' of prop ${current}`,
      );
    }

    return acc;
  }, {} as any);

  let animation: Animated.CompositeAnimation;

  function createAnimation(toValue: number) {
    return Animated.timing(masterValue, {
      toValue,
      duration: props.duration,
      easing: props.easing,
      useNativeDriver: true,
    });
  }

  function play(onFinish: () => void) {
    masterValue.stopAnimation();

    animation = createAnimation(1);

    animation.start(onFinish);
  }

  function playBackward(onFinish: () => void) {
    masterValue.stopAnimation();

    animation = createAnimation(0);

    animation.start(onFinish);
  }

  function stop() {
    animation?.stop();
  }

  return {
    play,
    playBackward,
    stop,
    values,
    transition: masterValue,
  };
}

function useReset() {
  const [count, setCount] = useState<number>(0);

  const reset = useCallback<any>(() => {
    setCount((val) => val + 1);
  }, []);

  return [count, reset];
}

export function useTween<TValues extends AnimationInputValues>(
  config: () => TweenAnimationProps<TValues>,
  deps: any[] = [],
): AnimationBag<TValues> {
  // TODO: Find better way to stop/reset animation
  const [count, stop] = useReset();

  const depsToUse = [...deps, count];

  const { play, playBackward, values, transition } = useMemo<
    Animation<TValues>
  >(() => {
    const animation = config();

    return generateTweenAnimation<TValues>(animation);
  }, depsToUse);

  return {
    play,
    playBackward,
    stop,
    values,
    transition,
  };
}
