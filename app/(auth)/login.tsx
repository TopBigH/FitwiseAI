import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import GradientBackground from '../../components/GradientBackground';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const canSubmit = isEmailValid && isPasswordValid && !loading;

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw signInError;
      }

      if (!data?.session) {
        throw new Error('No session created');
      }

      // Verify the session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error('Session verification failed');
      }

      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>FitWise AI</Text>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>

        <View style={styles.form}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && !isEmailValid && styles.inputError
              ]}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
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
              placeholder="Enter your password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              secureTextEntry
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
            />
            {touched.password && !isPasswordValid && (
              <Text style={styles.validationText}>Password must be at least 6 characters</Text>
            )}
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, !canSubmit && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={!canSubmit || loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/signup" style={styles.link}>
              <Text style={styles.linkText}>Sign Up</Text>
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
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 42,
    color: '#fff',
    marginBottom: 20,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#fff',
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
    marginBottom: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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