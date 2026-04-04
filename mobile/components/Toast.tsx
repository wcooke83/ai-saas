import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, type, visible, onHide }: ToastProps) {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 9 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(100);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const bg = type === 'success' ? 'bg-gray-900' : 'bg-red-600';

  return (
    <Animated.View
      style={{ transform: [{ translateY }], opacity, position: 'absolute', bottom: 32, left: 16, right: 16, zIndex: 100 }}
    >
      <View className={`${bg} rounded-2xl px-4 py-3 shadow-lg`}>
        <Text className="text-white text-sm font-medium text-center">{message}</Text>
      </View>
    </Animated.View>
  );
}

// Convenience hook
import { useState, useCallback } from 'react';

export function useToast() {
  const [state, setState] = useState<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const show = useCallback((message: string, type: ToastType = 'success') => {
    setState({ message, type, visible: true });
  }, []);

  const hide = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  return { toastState: state, show, hide };
}
