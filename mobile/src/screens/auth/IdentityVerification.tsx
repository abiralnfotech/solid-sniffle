import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import {
    ShieldCheck,
    ArrowLeft,
    Info,
    Badge,
    Camera,
    ChevronRight,
    Lock,
    Shield,
    Gavel,
    Headset,
    AlertCircle,
    UserCheck,
    CheckCircle2,
    Loader2
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';
import { cn } from '@/utils/cn';

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const [idNumber, setIdNumber] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const MOCK_DUPLICATE_ID = "999988887777";
  const isDuplicate = idNumber === MOCK_DUPLICATE_ID;

  const handleSubmit = () => {
    if (isDuplicate) return;
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        Alert.alert(
            'Submission Successful',
            'Identity details submitted for manual verification. This usually takes 2-4 hours.',
            [{ text: 'Continue', onPress: () => router.replace('/(main)/dashboard') }]
        );
    }, 1500);
  };

  const toggleFront = () => setFrontImage(frontImage ? null : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGkTKHMm-zjX8TZ5sFVrJlTiLQ5DaL4oxPPBg3eAWvRrn8di-lwUWwO6K8ofmiVj3XPoGoeUOmSdCev-IjSN_Lvl-2XWvR9PgXhhqcSRKg8KDaAXmxpV6T_AOnxF80jQKRwAs94rr8Pl0dVC6HCL129DMoJXXxUHYfbEas-nubGVv4XMiub5LjsLJUk6yIw7EmpsBwXUaTCpuCMIp6NLZ07hWBOE0HKN7mVO72qN7Mg5SPAIyhoeghb1qtMmid1Qqf6a_giFhdv3g');
  const toggleBack = () => setBackImage(backImage ? null : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDszxXRwx3njzVGqRm1ladKkd6W3kyW3E5ubxW6Q9sd2a_zO3zJnzK2ck3UPwzHKJSBlZda_yfs8O_SZyOk3JNU1YvwzCgqxhn-WZVx9DqHwBHx1KxeVxe3rM7dhCrxgYgGYoa7Hfgg-3xWkn9QczjUXdD00ql-BpxiHaYL0qn6wCdvBQUA7Ad3maBnqO7_WVX1213zTdiLP700qWo7V6sEHPwhHBNF6FoJDXBh0mTGLM-ux6E5LvPQamtSjGXVIs34URIxjSQzxZc');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Header */}
      <View className="px-6 h-14 flex-row items-center justify-between bg-white shadow-sm border-b border-gray-50">
        <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={SahayatriTheme.colors.primary} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-emerald-800">Sahayatri</Text>
        </View>
        <ShieldCheck size={24} color={SahayatriTheme.colors.primary} />
      </View>

      <ScrollView className="flex-1 px-6 pt-8" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Progress */}
        <View className="mb-8">
            <View className="flex-row justify-between items-end mb-3">
                <Text className="text-2xl font-black text-gray-800 tracking-tighter">Identity Verification</Text>
                <Text className="text-[10px] font-bold text-gray-400 uppercase">Step 2 of 3</Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View className="h-full bg-emerald-800 w-[66%]" />
            </View>
            <View className="flex-row items-center gap-2 mt-3">
                <Info size={14} color="#64748b" />
                <Text className="text-[10px] font-bold text-gray-400 uppercase">Community Safety Verification: Helping build trust</Text>
            </View>
        </View>

        {/* Duplicate Error */}
        {isDuplicate && (
            <View className="mb-6 bg-red-50 p-4 rounded-2xl border border-red-100 flex-row gap-4">
                <AlertCircle size={24} color="#ef4444" />
                <View className="flex-1">
                    <Text className="font-bold text-red-600 text-sm uppercase">Critical Error</Text>
                    <Text className="text-xs text-red-500 font-medium">This identity is already linked to an active account. Please contact support.</Text>
                </View>
            </View>
        )}

        {/* Form Card */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-8">
            <View className="mb-8">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Citizenship / National ID Number</Text>
                <View className={cn(
                    "flex-row items-center bg-gray-50 border rounded-2xl p-4 h-14",
                    isDuplicate ? "border-red-500" : "border-gray-100"
                )}>
                    <UserCheck size={20} color="#94a3b8" />
                    <TextInput
                        className="flex-1 ml-3 font-bold text-gray-800"
                        placeholder="Enter 12-digit ID number"
                        value={idNumber}
                        onChangeText={setIdNumber}
                        keyboardType="number-pad"
                    />
                </View>
            </View>

            <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Document Front</Text>
                    <TouchableOpacity
                        onPress={toggleFront}
                        className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden"
                    >
                        {frontImage ? (
                            <Image source={{ uri: frontImage }} className="w-full h-full" />
                        ) : (
                            <Camera size={32} color="#cbd5e1" />
                        )}
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Document Back</Text>
                    <TouchableOpacity
                        onPress={toggleBack}
                        className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden"
                    >
                        {backImage ? (
                            <Image source={{ uri: backImage }} className="w-full h-full" />
                        ) : (
                            <Camera size={32} color="#cbd5e1" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Driver Toggle */}
            <TouchableOpacity
                onPress={() => setIsDriver(!isDriver)}
                className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex-row items-center gap-4 mb-8"
            >
                <Switch
                    value={isDriver}
                    onValueChange={setIsDriver}
                    trackColor={{ false: '#fed7aa', true: '#f97316' }}
                />
                <View className="flex-1">
                    <Text className="font-bold text-orange-900 text-sm">Become a Community Driver</Text>
                    <Text className="text-[10px] text-orange-700 font-bold uppercase opacity-60">Earn Goodwill Credits</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!idNumber || isDuplicate || isSubmitting}
                className={cn(
                    "h-16 rounded-2xl items-center justify-center flex-row gap-3 shadow-lg",
                    (!idNumber || isDuplicate) ? "bg-gray-200" : "bg-emerald-800"
                )}
            >
                {isSubmitting ? (
                    <Loader2 size={24} color="white" className="animate-spin" />
                ) : (
                    <>
                        <Text className="text-white font-black text-lg">Submit for Verification</Text>
                        <ChevronRight size={20} color="white" />
                    </>
                )}
            </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <View className="flex-row flex-wrap justify-between gap-y-6">
            {[
                { icon: Lock, label: 'Encrypted' },
                { icon: Shield, label: 'Manual Review' },
                { icon: Gavel, label: 'Compliant' },
                { icon: Headset, label: '24/7 Support' }
            ].map((badge, idx) => (
                <View key={idx} className="items-center w-[22%]">
                    <View className="w-10 h-10 bg-emerald-50 rounded-full items-center justify-center mb-2">
                        <badge.icon size={18} color={SahayatriTheme.colors.primary} fill={SahayatriTheme.colors.primary + '22'} />
                    </View>
                    <Text className="text-[8px] font-black text-gray-400 uppercase text-center">{badge.label}</Text>
                </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
