import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {
    User,
    Car,
    Verified,
    Wallet,
    Home,
    UserCircle,
    MapPin,
    Search,
    Clock,
    Users,
    ShieldCheck,
    Navigation,
    Plus,
    ChevronRight,
    Bike,
    Settings
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { MOCK_RIDES, MOCK_RIDE_REQUESTS } from '@/api/mock';
import { useRouter } from 'expo-router';

export default function CoreDashboardScreen() {
  const [mode, setMode] = useState<'passenger' | 'driver'>('passenger');
  const { user } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Top App Bar */}
      <View className="bg-white px-6 h-16 flex-row items-center justify-between shadow-sm z-50 border-b border-gray-50">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: user?.profile_picture_url }}
            className="w-10 h-10 rounded-full border-2 border-emerald-100"
          />
          <Text className="text-xl font-black text-emerald-800 tracking-tighter">Sahayatri</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-orange-50 px-3 py-1.5 rounded-full flex-row items-center gap-2 border border-orange-100">
            <Wallet size={16} color="#f97316" fill="#f97316" />
            <Text className="text-[10px] font-black text-orange-700 uppercase">{user?.credit_balance} Credits</Text>
          </View>
          <ShieldCheck size={24} color={SahayatriTheme.colors.primary} />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Dual Mode Toggle */}
        <View className="px-6 mt-6">
          <View className="bg-gray-100 rounded-full p-1.5 flex-row relative shadow-inner">
            <TouchableOpacity
              onPress={() => setMode('passenger')}
              className={cn(
                "flex-1 py-3 flex-row items-center justify-center gap-2 rounded-full transition-all",
                mode === 'passenger' ? "bg-emerald-800 shadow-md" : ""
              )}
            >
              <User size={18} color={mode === 'passenger' ? 'white' : '#64748b'} />
              <Text className={cn("font-black text-[10px] uppercase tracking-widest", mode === 'passenger' ? "text-white" : "text-gray-500")}>Passenger Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('driver')}
              className={cn(
                "flex-1 py-3 flex-row items-center justify-center gap-2 rounded-full transition-all",
                mode === 'driver' ? "bg-emerald-800 shadow-md" : ""
              )}
            >
              <Car size={18} color={mode === 'driver' ? 'white' : '#64748b'} />
              <Text className={cn("font-black text-[10px] uppercase tracking-widest", mode === 'driver' ? "text-white" : "text-gray-500")}>Driver Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 mt-8 gap-8">
          {mode === 'passenger' ? (
            <>
              {/* Map Panel Simulation */}
              <View className="bg-slate-200 h-96 rounded-[32px] overflow-hidden shadow-lg relative items-center justify-center border border-gray-100">
                <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmCrkP299aLvsmSk3VECZyRhVLvV9RQkwdh2hi9ns-WH7m41CLsF7K-B8N3ryVKip6CF6Wn-_UjY-lgBiztSziLuIpFVKatxM6s_TlEyO-AVG7M9tZoMbDpsJ-Bp40XJti8J9KL27Sx3BSRo2qwls-QQ_kmpWYY6hE65ha4s5aQN8KefraHNpRBEN9WGVSCg4mfHBFh7838rPLO9U-TR-QhROvSWy2DSG3bPeThWOmhTrTAvMIR3_vkaZF4aFmmd2ljcaqtKu4PY8' }}
                    className="absolute inset-0 opacity-40 grayscale"
                />

                {/* Search Overlay */}
                <View className="absolute top-6 left-6 right-6">
                  <View className="bg-white rounded-2xl shadow-2xl p-4 flex-row items-center gap-3 border border-gray-50">
                    <Search color="#94a3b8" size={20} />
                    <TextInput
                        className="flex-1 font-bold text-gray-800"
                        placeholder="Where are you going?"
                        placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {/* Simulated Markers */}
                <View className="absolute top-1/3 left-1/4">
                  <MapPin color="#ef4444" size={40} fill="#ef4444" />
                </View>
                <View className="absolute bottom-1/4 right-1/3">
                  <Bike color="#065f46" size={40} fill="#065f46" />
                </View>
              </View>

              {/* Available Drivers */}
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-black text-gray-800 tracking-tighter">Available Sahayatris</Text>
                  <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Text className="text-[10px] font-bold text-emerald-800 uppercase">{MOCK_RIDES.length} Drivers Live</Text>
                  </View>
                </View>

                {MOCK_RIDES.map((ride) => (
                  <TouchableOpacity
                    key={ride.ride_id}
                    onPress={() => router.push('/ride/live')}
                    className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100"
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View className="flex-row gap-4">
                        <Image source={{ uri: ride.driver_image }} className="w-14 h-14 rounded-2xl" />
                        <View>
                          <View className="flex-row items-center gap-1">
                            <Text className="font-bold text-lg text-gray-800">{ride.driver_name}</Text>
                            <Verified size={16} color="#f97316" fill="#f9731633" />
                          </View>
                          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ride.vehicle_info}</Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-2xl font-black text-emerald-800 tracking-tighter">{ride.goodwill_cost} CC</Text>
                        <Text className="text-[8px] text-gray-400 font-black uppercase">Goodwill Cost</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-6 py-4 border-t border-b border-gray-50 my-2">
                      <View className="flex-row items-center gap-2">
                        <Users size={16} color="#94a3b8" />
                        <Text className="text-xs font-bold text-gray-600">{ride.available_seats} Seat left</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Clock size={16} color="#94a3b8" />
                        <Text className="text-xs font-bold text-gray-600">Leaves soon</Text>
                      </View>
                    </View>

                    <Text className="text-xs text-gray-500 italic mt-2 font-medium">"{ride.comment}"</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Driver Mode: Create Route */}
              <View className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100">
                <Text className="text-2xl font-black text-emerald-800 tracking-tighter mb-8">Create New Route</Text>

                <View className="gap-8">
                  <View className="flex-row gap-4">
                    <View className="items-center">
                      <View className="w-4 h-4 rounded-full bg-emerald-700 border-2 border-white shadow-sm" />
                      <View className="w-0.5 h-16 bg-gray-100 my-1" />
                      <MapPin color="#ef4444" size={20} fill="#ef4444" />
                    </View>
                    <View className="flex-1 gap-8">
                      <View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting From</Text>
                        <View className="border-b border-gray-100 pb-2">
                          <Text className="text-base font-bold text-gray-800">New Baneshwor, Kathmandu</Text>
                        </View>
                      </View>
                      <View>
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination</Text>
                        <View className="border-b border-gray-100 pb-2">
                          <Text className="text-base font-bold text-gray-300">Set destination...</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-4">
                      <TouchableOpacity className="flex-1 bg-emerald-50 h-16 rounded-2xl border-2 border-emerald-800 items-center justify-center gap-2">
                          <Bike size={24} color="#065f46" />
                          <Text className="text-[10px] font-bold text-emerald-800 uppercase">Scooter</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-gray-50 h-16 rounded-2xl border border-gray-100 items-center justify-center gap-2">
                          <Car size={24} color="#94a3b8" />
                          <Text className="text-[10px] font-bold text-gray-400 uppercase">Sedan</Text>
                      </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push('/ride/live')}
                    className="bg-emerald-800 h-16 rounded-2xl items-center justify-center shadow-xl"
                  >
                    <Text className="text-white font-black text-lg">Go Online & Wait</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Request Queue */}
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-black text-gray-800 tracking-tighter">Request Queue</Text>
                  <View className="bg-emerald-50 px-3 py-1 rounded-full flex-row items-center gap-2 border border-emerald-100">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <Text className="text-[10px] font-bold text-emerald-800 uppercase">Live</Text>
                  </View>
                </View>

                {MOCK_RIDE_REQUESTS.map((req) => (
                  <View key={req.request_id} className="bg-white rounded-[32px] p-6 shadow-sm border-l-8 border-emerald-800 border-gray-100">
                    <View className="flex-row gap-4 mb-6">
                      <Image source={{ uri: req.passenger_image }} className="w-14 h-14 rounded-2xl" />
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center">
                          <Text className="text-lg font-bold text-gray-800">{req.passenger_name}</Text>
                          <Text className="text-emerald-700 font-black">+{req.credit_offer} CC</Text>
                        </View>
                        <View className="flex-row items-center gap-2 mt-1">
                          <Users size={14} color="#94a3b8" />
                          <Text className="text-[10px] font-bold text-gray-400 uppercase">{req.mutual_friends} Mutual Friends</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-3">
                      <TouchableOpacity className="flex-1 bg-red-50 h-12 rounded-xl border border-red-100 items-center justify-center">
                        <Text className="text-red-600 font-bold uppercase text-[10px] tracking-widest">Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => router.push('/ride/live')}
                        className="flex-2 bg-emerald-800 h-12 rounded-xl items-center justify-center px-8"
                      >
                        <Text className="text-white font-bold uppercase text-[10px] tracking-widest">Accept Request</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Modern Bottom Navigation */}
      <View className="absolute bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-100 pt-3 pb-8 flex-row justify-around items-center px-4">
        <TouchableOpacity
          onPress={() => router.push('/(main)/dashboard')}
          className="items-center bg-emerald-800 rounded-2xl px-6 py-2.5 flex-row gap-2 shadow-lg"
        >
          <Home size={20} color="white" fill="white" />
          <Text className="text-white font-black text-[10px] uppercase tracking-tighter">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/ride/live')} className="items-center p-2">
          <Car size={24} color="#94a3b8" />
          <Text className="text-gray-400 text-[8px] font-black uppercase mt-1">Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center p-2">
          <Wallet size={24} color="#94a3b8" />
          <Text className="text-gray-400 text-[8px] font-black uppercase mt-1">Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile/edit')} className="items-center p-2">
          <UserCircle size={24} color="#94a3b8" />
          <Text className="text-gray-400 text-[8px] font-black uppercase mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
