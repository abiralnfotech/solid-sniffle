import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import {
    Camera,
    ShieldCheck,
    Mail,
    Phone,
    ChevronRight,
    LogOut,
    Trash2,
    User,
    ArrowLeft,
    Verified,
    Bike,
    Car,
    AlertCircle,
    Plus,
    Fingerprint,
    Delete
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { cn } from '@/utils/cn';

export default function EditProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.full_name || 'Arjun Thapa');
  const [email, setEmail] = useState('arjun.thapa@email.com');
  const [phone, setPhone] = useState('9841234567');
  const [vehicleType, setVehicleType] = useState<'bike' | 'scooter' | 'car'>('bike');
  const [biometric, setBiometric] = useState(true);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your changes have been saved successfully.');
    router.back();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await logout();
        router.replace('/(auth)/onboarding');
      }}
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Header */}
      <View className="px-6 h-14 flex-row items-center justify-between bg-white shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <ArrowLeft size={24} color={SahayatriTheme.colors.primary} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-emerald-800">Edit Profile</Text>
        <View className="w-10 items-center justify-center">
            <Verified size={24} color={SahayatriTheme.colors.primary} fill={SahayatriTheme.colors.primaryContainer} />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Community Status (Bento Style) */}
        <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center text-center">
                <View className="bg-emerald-50 px-3 py-1 rounded-full flex-row items-center gap-1 mb-2 border border-emerald-100">
                    <Verified size={14} color={SahayatriTheme.colors.primary} fill={SahayatriTheme.colors.primary} />
                    <Text className="text-[10px] font-bold text-emerald-800 uppercase">Verified</Text>
                </View>
                <Text className="text-[10px] text-gray-400 text-center font-bold">Identity confirmed via Citizenship ID</Text>
            </View>
            <View className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 items-center text-center">
                <Text className="text-2xl font-black text-emerald-800 mb-1">4.9/5.0</Text>
                <Text className="text-[10px] text-orange-600 font-bold uppercase mb-1">Trust Level: High</Text>
                <Text className="text-[10px] text-gray-400 font-bold">Sahayatri Goodwill</Text>
            </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center gap-3 mb-6">
                <User size={20} color={SahayatriTheme.colors.primary} />
                <Text className="text-lg font-bold text-emerald-800">Personal Information</Text>
            </View>

            <View className="gap-6">
                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Full Name</Text>
                    <TextInput
                        className="w-full h-14 px-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-800"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Phone Number</Text>
                    <View className="relative">
                        <View className="absolute left-4 top-0 bottom-0 justify-center">
                            <Text className="font-bold text-gray-400">+977</Text>
                        </View>
                        <TextInput
                            className="w-full h-14 pl-14 pr-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-800"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Email Address</Text>
                    <TextInput
                        className="w-full h-14 px-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-800"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>
        </View>

        {/* Driver Settings */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-3">
                    <Car size={20} color={SahayatriTheme.colors.primary} />
                    <Text className="text-lg font-bold text-emerald-800">Driver Settings</Text>
                </View>
                <View className="bg-emerald-100 px-3 py-1 rounded-full">
                    <Text className="text-[10px] font-bold text-emerald-800">Active</Text>
                </View>
            </View>

            <View className="gap-6">
                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3">Vehicle Type</Text>
                    <View className="flex-row gap-2">
                        {(['bike', 'scooter', 'car'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setVehicleType(type)}
                                className={cn(
                                    "flex-1 h-12 rounded-xl border-2 items-center justify-center flex-row gap-2",
                                    vehicleType === type ? "border-emerald-800 bg-emerald-50" : "border-gray-100"
                                )}
                            >
                                <Text className={cn("font-bold text-xs capitalize", vehicleType === type ? "text-emerald-800" : "text-gray-400")}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Plate Number</Text>
                    <TextInput
                        className="w-full h-14 px-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-800 uppercase"
                        placeholder="e.g. BA 2 PA 1234"
                    />
                </View>

                <View>
                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Driver's License Photo</Text>
                    <TouchableOpacity className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center bg-gray-50 overflow-hidden">
                        <Image
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt9Drwqk-fcK-gqDtPmJYhKf9N_kNg45NtLAQVoosChIujAsndh-aqFjOdUyUtSNrirBoqs8BKpy2aB8t6Y3U6Ke5ZityhGMM7Ru8gnWHdfHWuC7Fbr32_lDDorpy8qXofbxVswKAElHk1qCByr2994VhNll_KlAhAsd_iVwBHALyh6pi3tRBeAYB9DeZN0uLum9PHBUTe-AjRxPb4zPDvbaE8mbN6l3KQWKp9LtHbvkHUI80fyiYKJ_hkfvHHk_zZzmN52lhg6xc' }}
                            className="absolute inset-0 opacity-40 grayscale"
                        />
                        <Camera size={32} color="#94a3b8" />
                        <Text className="text-xs font-bold text-gray-400 mt-2">Update License Image</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Emergency Contacts */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center gap-3 mb-6">
                <AlertCircle size={20} color={SahayatriTheme.colors.error} />
                <Text className="text-lg font-bold text-emerald-800">Emergency Contacts</Text>
            </View>

            <View className="gap-4">
                {[
                    { name: 'Laxman Thapa', relation: 'Father', phone: '+977 9801234567' },
                    { name: 'Sita Sharma', relation: 'Spouse', phone: '+977 9812345678' }
                ].map((contact, idx) => (
                    <View key={idx} className="flex-row items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                            <Phone size={18} color="#ef4444" fill="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800">{contact.name}</Text>
                            <Text className="text-[10px] font-bold text-gray-400">{contact.relation} • {contact.phone}</Text>
                        </View>
                        <TouchableOpacity>
                            <Delete size={18} color="#cbd5e1" />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity className="w-full h-14 border-2 border-dashed border-emerald-800/20 rounded-2xl items-center justify-center flex-row gap-2">
                    <Plus size={20} color={SahayatriTheme.colors.primary} />
                    <Text className="text-emerald-800 font-bold">Add New Contact</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Account Settings */}
        <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-10">
            <View className="flex-row items-center gap-3 mb-6">
                <Fingerprint size={20} color={SahayatriTheme.colors.primary} />
                <Text className="text-lg font-bold text-emerald-800">Account & Privacy</Text>
            </View>

            <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
                <View className="flex-row items-center gap-3">
                    <Fingerprint size={20} color="#64748b" />
                    <Text className="font-bold text-gray-700">Biometric Login</Text>
                </View>
                <Switch
                    value={biometric}
                    onValueChange={setBiometric}
                    trackColor={{ false: '#e2e8f0', true: SahayatriTheme.colors.primary }}
                />
            </View>

            <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100"
            >
                <View className="flex-row items-center gap-3">
                    <LogOut size={20} color="#ef4444" />
                    <Text className="font-bold text-red-600">Logout Session</Text>
                </View>
                <ChevronRight size={20} color="#fecaca" />
            </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
            onPress={handleSave}
            className="w-full h-16 bg-emerald-800 rounded-2xl items-center justify-center shadow-xl"
        >
            <Text className="text-white font-black text-lg">Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center py-10 flex-row justify-center gap-2">
            <Trash2 size={16} color="#ef4444" />
            <Text className="text-red-600 font-bold">Request Account Deletion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
