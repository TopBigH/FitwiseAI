import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import GradientBackground from '../../components/GradientBackground';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    fullName: false,
  });

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const isFullNameValid = fullName.trim().length >= 2;
  const canSubmit = isEmailValid && isPasswordValid && isFullNameValid && !loading;

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your fitness journey with FitWise AI</Text>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                touched.fullName && !isFullNameValid && styles.inputError
              ]}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={fullName}
              onChangeText={setFullName}
              onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
              autoCapitalize="words"
            />
            {touched.fullName && !isFullNameValid && (
              <Text style={styles.validationText}>Please enter your full name</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && !isEmailValid && styles.inputError
              ]}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && !isEmailValid && (
              <Text style={styles.validationText}>Please enter a valid email address</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                touched.password && !isPasswordValid && styles.inputError
              ]}
              placeholder="Create a password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              secureTextEntry
            />
            {touched.password && !isPasswordValid && (
              <Text style={styles.validationText}>Password must be at least 6 characters</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={!canSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login" style={styles.link}>
              <Text style={styles.linkText}>Sign In</Text>
            </Link>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  form: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255,59,48,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  validationText: {
    color: '#FF3B30',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  link: {
    marginLeft: 4,
  },
  linkText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
});