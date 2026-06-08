import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
  ScrollView
} from 'react-native';
import { ArrowRight, Fingerprint, ChevronDown, ShieldCheck, Shield } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { useRouter } from 'expo-router';

export default function OnboardingAuthScreen() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const otpInputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setStep('otp');
      setTimer(59);
    } else {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit number');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.every((digit) => digit !== '')) {
      try {
        await login(phone, otp.join(''));
        router.replace('/(main)/dashboard');
      } catch (error) {
        Alert.alert('Error', 'Invalid OTP');
      }
    }
  };

  const updateOtp = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Header */}
      <View className="px-6 h-16 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
            <Shield size={24} color={SahayatriTheme.colors.primary} fill={SahayatriTheme.colors.primary} />
            <Text className="font-black text-xl text-emerald-800 tracking-tighter">Sahayatri</Text>
        </View>
        <TouchableOpacity className="flex-row items-center gap-1">
            <Text className="text-xs font-bold text-gray-500 uppercase">English</Text>
            <ChevronDown size={14} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
          {/* Logo Section */}
          <View className="mb-12 items-center">
            <View className="w-24 h-24 bg-white rounded-3xl shadow-xl items-center justify-center border border-gray-50 mb-6">
                 <ShieldCheck size={48} color={SahayatriTheme.colors.primary} />
            </View>
            <Text className="text-4xl font-black text-gray-800 tracking-tighter mb-2">Welcome to Sahayatri</Text>
            <Text className="text-gray-500 text-center font-medium">Nepal's trusted community ride-sharing network</Text>
          </View>

          {/* Auth Card */}
          <View className="w-full bg-white p-8 rounded-[32px] shadow-2xl border border-gray-100">
            {step === 'phone' ? (
              <View className="gap-8">
                <View>
                  <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Enter Mobile Number</Text>
                  <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 h-14">
                    <Text className="text-lg font-black text-gray-800 pr-4 border-r border-gray-200">+977</Text>
                    <TextInput
                      className="flex-1 text-lg font-black pl-4 text-gray-800"
                      placeholder="98XXXXXXXX"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleSendOTP}
                  className="h-16 rounded-2xl items-center justify-center flex-row gap-3 bg-emerald-800 shadow-lg"
                >
                  <Text className="text-white font-black text-lg">Send OTP</Text>
                  <ArrowRight color="white" size={20} />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-8">
                <View className="items-center">
                  <Text className="text-2xl font-black text-gray-800 tracking-tight">Verify Identity</Text>
                  <Text className="text-gray-500 text-center mt-1">
                    A 6-digit code was sent to <Text className="font-bold text-gray-800">+977 {phone}</Text>
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => (otpInputs.current[i] = ref)}
                      className="w-12 h-16 bg-gray-50 border border-gray-100 rounded-2xl text-center text-2xl font-black text-emerald-800"
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(v) => updateOtp(v, i)}
                      onKeyPress={(e) => handleKeyPress(e, i)}
                    />
                  ))}
                </View>
                <View className="items-center gap-6">
                  <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                    Resend code in <Text className="text-orange-500">00:{timer.toString().padStart(2, '0')}</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={handleVerifyOTP}
                    className="w-full h-16 rounded-2xl items-center justify-center bg-emerald-800 shadow-lg"
                  >
                    <Text className="text-white font-black text-lg">Verify & Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep('phone')}>
                    <Text className="text-emerald-800 font-bold">Change Phone Number</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Biometric Toggle */}
            <View className="mt-8 pt-8 border-t border-gray-50 flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center">
                  <Fingerprint color="#f97316" size={24} />
                </View>
                <View>
                  <Text className="font-bold text-gray-800">Biometric Login</Text>
                  <Text className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">Recommended for Safety</Text>
                </View>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#e2e8f0', true: SahayatriTheme.colors.primary }}
              />
            </View>
          </View>

          {/* Footer */}
          <Text className="mt-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest px-8 leading-4">
            By continuing, you agree to Sahayatri’s {'\n'}
            <Text className="text-emerald-800">Terms of Service</Text> & <Text className="text-emerald-800">Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
