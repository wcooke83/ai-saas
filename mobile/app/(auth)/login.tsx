import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message);
      }
      // Auth state change will trigger redirect in root layout
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Logo / wordmark */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 rounded-2xl bg-primary-500 items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">V</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">VocUI Agent</Text>
            <Text className="text-sm text-gray-500 mt-1">Sign in to manage conversations</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="next"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">Password</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
              />
            </View>

            {error && (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <Text className="text-sm text-red-700">{error}</Text>
              </View>
            )}

            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              className="bg-primary-500 rounded-xl py-3.5 items-center active:bg-primary-600 disabled:opacity-60"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Sign In</Text>
              )}
            </Pressable>
          </View>

          <Text className="text-xs text-gray-400 text-center mt-8">
            Agent accounts are managed by your chatbot owner.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
