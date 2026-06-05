import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Fingerprint, CheckCircle2 } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { apiClient } from '@/api/client';

export default function AuthScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async () => {
    if (phone.length === 10) {
      await apiClient.auth.sendOtp(phone);
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.every((digit) => digit !== '')) {
      const res = await apiClient.auth.verifyOtp(phone, otp.join(''));
      if (res.access_token) {
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>स</Text>
          </View>
          <Text style={styles.title}>Sahayatri</Text>
          <Text style={styles.subtitle}>Mutual Aid Community</Text>
        </View>

        <View style={styles.card}>
          {step === 'phone' ? (
            <View style={styles.stepContainer}>
              <Text style={styles.label}>Enter Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.countryCode}>+977</Text>
                <TextInput
                  style={styles.input}
                  placeholder="98XXXXXXXX"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, phone.length !== 10 && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={phone.length !== 10}
              >
                <Text style={styles.buttonText}>Send OTP</Text>
                <ArrowRight color={SahayatriTheme.colors.onPrimary} size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stepContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.otpTitle}>Verify Identity</Text>
                <Text style={styles.otpSubtitle}>
                  A 6-digit code was sent to <Text style={styles.boldText}>+977 {phone}</Text>
                </Text>
              </View>
              <View style={styles.otpContainer}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => {
                      const newOtp = [...otp];
                      newOtp[i] = val;
                      setOtp(newOtp);
                    }}
                  />
                ))}
              </View>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerHighlight}>00:{timer.toString().padStart(2, '0')}</Text>
                </Text>
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep('phone')}>
                  <Text style={styles.changePhoneText}>Change Phone Number</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.biometricContainer}>
            <View style={styles.biometricLeft}>
              <View style={styles.biometricIcon}>
                <Fingerprint color={SahayatriTheme.colors.secondary} size={20} />
              </View>
              <View>
                <Text style={styles.biometricTitle}>Enable Biometric Login</Text>
                <Text style={styles.biometricSubtitle}>RECOMMENDED FOR SAFETY</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          By continuing, you agree to Sahayatri’s{'\n'}
          <Text style={styles.linkText}>Terms of Service</Text> & <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SahayatriTheme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  subtitle: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: SahayatriTheme.colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: SahayatriTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 4,
  },
  stepContainer: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outline,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurface,
    borderRightWidth: 1,
    borderRightColor: SahayatriTheme.colors.outlineVariant,
    paddingRight: 12,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: SahayatriTheme.colors.onSurface,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  otpSubtitle: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 44,
    height: 56,
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outline,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  timerContainer: {
    alignItems: 'center',
    gap: 16,
  },
  timerText: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  timerHighlight: {
    color: SahayatriTheme.colors.secondary,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 52,
    width: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhoneText: {
    color: SahayatriTheme.colors.primaryContainer,
    fontSize: 14,
    fontWeight: '600',
  },
  biometricContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: SahayatriTheme.colors.outlineVariant,
  },
  biometricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    padding: 12,
    borderRadius: 16,
  },
  biometricIcon: {
    width: 40,
    height: 40,
    backgroundColor: SahayatriTheme.colors.secondaryContainer + '33',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  biometricSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: SahayatriTheme.colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  footerText: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 14,
    color: SahayatriTheme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  linkText: {
    color: SahayatriTheme.colors.primaryContainer,
    fontWeight: 'bold',
  },
});
