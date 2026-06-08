import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  AlertTriangle,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Star,
  Navigation,
  Car,
  Share2,
  ShieldAlert,
  X
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';
import { cn } from '@/utils/cn';

const { width, height } = Dimensions.get('window');

export default function LiveRideTrackingScreen() {
  const router = useRouter();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Logic for emergency triggered
    }
    return () => clearInterval(timer);
  }, [sosActive, countdown]);

  const handleCancelSos = () => {
    setSosActive(false);
    setCountdown(5);
  };

  return (
    <View style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Full Screen Map Placeholder */}
      <View className="absolute inset-0 bg-slate-200">
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmCrkP299aLvsmSk3VECZyRhVLvV9RQkwdh2hi9ns-WH7m41CLsF7K-B8N3ryVKip6CF6Wn-_UjY-lgBiztSziLuIpFVKatxM6s_TlEyO-AVG7M9tZoMbDpsJ-Bp40XJti8J9KL27Sx3BSRo2qwls-QQ_kmpWYY6hE65ha4s5aQN8KefraHNpRBEN9WGVSCg4mfHBFh7838rPLO9U-TR-QhROvSWy2DSG3bPeThWOmhTrTAvMIR3_vkaZF4aFmmd2ljcaqtKu4PY8' }}
          className="w-full h-full opacity-60 grayscale"
          resizeMode="cover"
        />

        {/* Animated Car Simulation */}
        <View className="absolute top-[60%] left-[30%] -mt-6 -ml-6 items-center">
            <View className="bg-emerald-800 p-2 rounded-full border-2 border-white shadow-xl">
                <Car size={24} color="white" />
            </View>
            <View className="bg-white px-2 py-1 rounded-lg shadow-sm mt-2 border border-gray-100">
                <Text className="text-[10px] font-bold text-emerald-800">Binod T.</Text>
            </View>
        </View>
      </View>

      {/* Top Header Overlays */}
      <SafeAreaView className="flex-none pt-4">
        <View className="px-6 flex-row items-center justify-between">
            <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
            >
                <ArrowLeft size={20} color="#1f2937" />
            </TouchableOpacity>

            <View className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-100 flex-row items-center gap-2">
                <ShieldCheck size={16} color={SahayatriTheme.colors.primary} />
                <Text className="text-emerald-800 font-bold text-[10px] uppercase tracking-widest">Secure Session</Text>
            </View>
        </View>

        {/* Ride Status Banner */}
        <View className="mx-6 mt-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-emerald-50 flex-row items-center gap-4">
            <View className="w-12 h-12 bg-emerald-100 rounded-xl items-center justify-center">
                <Navigation size={24} color={SahayatriTheme.colors.primary} />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ride in Progress</Text>
                    <Text className="text-[10px] font-bold text-emerald-600 animate-pulse">LIVE</Text>
                </View>
                <Text className="text-lg font-bold text-gray-800">To: Putalisadak</Text>
            </View>
            <View className="items-end">
                <Text className="text-xl font-bold text-emerald-800">12</Text>
                <Text className="text-[10px] font-bold text-gray-400">mins</Text>
            </View>
        </View>
      </SafeAreaView>

      {/* SOS Floating Action Button */}
      <TouchableOpacity
        onPress={() => setSosActive(true)}
        className="absolute bottom-64 right-6 bg-red-600 w-20 h-20 rounded-full items-center justify-center shadow-2xl z-50 border-4 border-white"
        style={{ elevation: 10 }}
      >
        <AlertTriangle size={32} color="white" fill="white" />
        <Text className="text-white font-black text-xs mt-1">SOS</Text>
      </TouchableOpacity>

      {/* Bottom Information Sheet */}
      <View className="absolute bottom-0 w-full bg-white rounded-t-[40px] shadow-2xl p-8 pt-4 pb-12">
        <View className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

        <View className="flex-row gap-4 mb-6">
            <View className="flex-1 bg-emerald-50 p-4 rounded-2xl flex-row items-center gap-3">
                <ShieldCheck size={24} color={SahayatriTheme.colors.primary} />
                <View>
                    <Text className="text-[10px] font-bold text-gray-500 uppercase">Safety Status</Text>
                    <Text className="text-sm font-bold text-emerald-800">Monitored</Text>
                </View>
            </View>
            <TouchableOpacity className="flex-1 bg-gray-50 p-4 rounded-2xl flex-row items-center gap-3 border border-gray-100">
                <Share2 size={24} color={SahayatriTheme.colors.secondary} />
                <View>
                    <Text className="text-[10px] font-bold text-gray-500 uppercase">Share Trip</Text>
                    <Text className="text-sm font-bold text-gray-800">Trusted Contacts</Text>
                </View>
            </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between border-t border-gray-50 pt-6">
            <View className="flex-row items-center gap-4">
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLD14MsQG1FVepJu8XnfpNFEUTRaTPyEMSfK4scm2Q5Qewux5U8w3dgy2la0c2o224LQQpFFRrq6ot3xv8MyJMxVBuB06cLaK8FCYNXbo46DdTw6kJsE13INoTzZrRneI6hdJQX2iTuShKkmWcPDCvuOeSZhbnWbFpIdEyw4w1dHsr8OapD6dr2su77dYVk4_ss6SnZTzptceX40Mj5J3tIuLrkOXuyYMOkDXN4_VHNV3gz6saU6b-xcg-SHDi143FYdodh5hFImE' }}
                    className="w-14 h-14 rounded-full border-2 border-emerald-50"
                />
                <View>
                    <Text className="text-xl font-bold text-gray-800">Binod Thapa</Text>
                    <Text className="text-xs text-gray-400 font-bold">BA 98 PA 4321 • Suzuki Gixxer</Text>
                </View>
            </View>
            <TouchableOpacity className="w-14 h-14 bg-emerald-800 rounded-full items-center justify-center shadow-md">
                <Phone size={24} color="white" fill="white" />
            </TouchableOpacity>
        </View>
      </View>

      {/* SOS OVERLAY */}
      {sosActive && (
        <View className="absolute inset-0 bg-red-600/95 z-[100] items-center justify-center px-8">
            <View className="bg-white/20 p-8 rounded-full mb-8">
                <ShieldAlert size={100} color="white" />
            </View>
            <Text className="text-4xl font-black text-white text-center mb-4 tracking-tighter">EMERGENCY TRIPPED</Text>
            <Text className="text-white text-lg text-center opacity-90 mb-12">
                Sending live coordinates to the Sahayatri Command Center and local authorities...
            </Text>

            <View className="w-40 h-40 items-center justify-center mb-12">
                <View className="absolute inset-0 border-8 border-white/20 rounded-full" />
                <Text className="text-6xl font-black text-white">{countdown}</Text>
            </View>

            <TouchableOpacity
                onPress={handleCancelSos}
                className="bg-white px-12 py-5 rounded-2xl shadow-2xl active:scale-95 transition-transform"
            >
                <Text className="text-red-600 font-black text-lg">CANCEL (False Alarm)</Text>
            </TouchableOpacity>

            <View className="mt-12 gap-4">
                <View className="flex-row items-center gap-3">
                    <MapPin size={20} color="white" />
                    <Text className="text-white font-bold opacity-80">27.7172° N, 85.3240° E</Text>
                </View>
                <View className="flex-row items-center gap-3">
                    <Phone size={20} color="white" />
                    <Text className="text-white font-bold opacity-80">Connecting to Nepal Police...</Text>
                </View>
            </View>
        </View>
      )}
    </View>
  );
}
