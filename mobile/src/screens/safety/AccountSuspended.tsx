import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { ShieldAlert, Mail, Info, FileText, Lock, Home, Car, Wallet, UserCircle } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';

export default function AccountSuspendedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Top Bar Anchor */}
      <View className="px-6 h-14 flex-row items-center justify-between bg-white shadow-sm border-b border-gray-50">
        <Text className="text-xl font-bold text-emerald-800">Sahayatri</Text>
        <ShieldAlert size={20} color="#94a3b8" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        {/* Lockout Card */}
        <View className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
            <View className="h-2 bg-orange-400 w-full" />

            <View className="p-10 items-center">
                <View className="mb-8 relative">
                    <View className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-50" />
                    <View className="bg-orange-50 p-8 rounded-full border border-orange-100">
                        <ShieldAlert size={64} color="#f97316" fill="#f9731633" />
                    </View>
                </View>

                <Text className="text-4xl font-black text-gray-800 text-center mb-4 tracking-tighter">Account Suspended</Text>

                <View className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8">
                    <Text className="text-sm leading-relaxed text-gray-600 text-center font-medium">
                        Your profile has accumulated a <Text className="font-bold text-red-600">negative feedback ratio greater than 15%</Text>. Access is restricted pending manual administrative review.
                    </Text>
                </View>

                <View className="w-full gap-3">
                    <TouchableOpacity
                        disabled
                        className="w-full h-16 bg-gray-100 rounded-2xl flex-row items-center justify-center gap-2 opacity-60"
                    >
                        <Lock size={20} color="#94a3b8" />
                        <Text className="text-gray-400 font-bold text-lg uppercase tracking-widest">Restoration Disabled</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {}}
                        className="w-full h-16 bg-emerald-800 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
                    >
                        <Mail size={20} color="white" />
                        <Text className="text-white font-bold text-lg">Contact Administration</Text>
                    </TouchableOpacity>
                </View>

                <Text className="mt-8 font-mono text-[10px] text-gray-400 uppercase font-bold">Reference Case ID: SAHA-9921-X</Text>
            </View>

            {/* Footer Details */}
            <View className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                    <Info size={14} color="#64748b" />
                    <Text className="text-[10px] font-bold text-gray-500 uppercase">Review: 3-5 days</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <FileText size={14} color="#64748b" />
                    <Text className="text-[10px] font-bold text-gray-500 uppercase">Community Guidelines</Text>
                </View>
            </View>
        </View>
      </ScrollView>

      {/* Bottom Aesthetic Placeholder */}
      <View className="h-20 flex-row justify-around items-center opacity-30 grayscale pointer-events-none">
        <Home size={28} color="#64748b" />
        <Car size={28} color="#64748b" />
        <Wallet size={28} color="#64748b" />
        <UserCircle size={28} color="#64748b" />
      </View>
    </SafeAreaView>
  );
}
