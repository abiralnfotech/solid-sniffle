import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {
    Heart,
    ThumbsUp,
    ThumbsDown,
    CheckCircle2,
    X,
    MessageSquare,
    ChevronRight,
    Loader2
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';
import { cn } from '@/utils/cn';

export default function RideFeedbackScreen() {
  const [selection, setSelection] = useState<'good' | 'bad' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!selection) return;

    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => {
            router.replace('/(main)/dashboard');
        }, 1500);
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: SahayatriTheme.colors.background }}>
      {/* Background Content (Blurred representation) */}
      <View className="flex-1 opacity-20 p-6 pt-12 grayscale">
          <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-bold text-emerald-800">Sahayatri</Text>
              <View className="w-10 h-10 rounded-full bg-gray-300" />
          </View>
          <View className="h-32 bg-gray-100 rounded-2xl mb-6" />
          <View className="flex-row gap-4">
              <View className="flex-1 h-24 bg-gray-100 rounded-2xl" />
              <View className="flex-1 h-24 bg-gray-100 rounded-2xl" />
          </View>
      </View>

      {/* Modal Overlay */}
      <View className="absolute inset-0 bg-black/40 backdrop-blur-md items-center justify-center p-6">
        <View className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl">
            {/* Progress Bar */}
            <View className="h-1.5 bg-gray-100 w-full">
                <View
                    className="h-full bg-emerald-800 transition-all duration-500"
                    style={{ width: selection === 'good' ? '100%' : selection === 'bad' ? '75%' : '50%' }}
                />
            </View>

            <ScrollView className="p-8" showsVerticalScrollIndicator={false}>
                <View className="items-center mb-8">
                    <View className="bg-emerald-50 w-20 h-20 rounded-full items-center justify-center mb-6">
                        <Heart size={40} color={SahayatriTheme.colors.primary} fill={SahayatriTheme.colors.primaryContainer} />
                    </View>
                    <Text className="text-2xl font-bold text-center text-gray-800">How was your mutual aid experience?</Text>
                    <Text className="text-gray-500 text-center mt-2 text-sm">Your feedback helps maintain trust within the Sahayatri community.</Text>
                </View>

                <View className="flex-row gap-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setSelection('good')}
                        className={cn(
                            "flex-1 aspect-square rounded-3xl border-2 items-center justify-center gap-3 transition-all",
                            selection === 'good' ? "border-emerald-800 bg-emerald-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                    >
                        <ThumbsUp
                            size={40}
                            color={selection === 'good' ? SahayatriTheme.colors.primary : "#94a3b8"}
                            fill={selection === 'good' ? SahayatriTheme.colors.primary : "none"}
                        />
                        <Text className={cn("font-bold text-xs", selection === 'good' ? "text-emerald-800" : "text-gray-400")}>Good Experience</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelection('bad')}
                        className={cn(
                            "flex-1 aspect-square rounded-3xl border-2 items-center justify-center gap-3 transition-all",
                            selection === 'bad' ? "border-red-500 bg-red-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                    >
                        <ThumbsDown
                            size={40}
                            color={selection === 'bad' ? "#ef4444" : "#94a3b8"}
                            fill={selection === 'bad' ? "#ef4444" : "none"}
                        />
                        <Text className={cn("font-bold text-xs", selection === 'bad' ? "text-red-600" : "text-gray-400")}>Bad Experience</Text>
                    </TouchableOpacity>
                </View>

                {selection === 'bad' && (
                    <View className="mb-8 gap-3 animate-in fade-in slide-in-from-top-2">
                        <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">What went wrong?</Text>
                        {['Reckless Driving', 'Unpunctual', 'Inappropriate Behavior', 'Asked for Cash'].map(issue => (
                            <TouchableOpacity key={issue} className="flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Text className="font-semibold text-gray-700">{issue}</Text>
                                <View className="w-5 h-5 rounded border border-gray-300" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!selection || isSubmitting}
                    className={cn(
                        "w-full h-16 rounded-2xl items-center justify-center flex-row gap-3 shadow-lg",
                        !selection ? "bg-gray-200" : "bg-emerald-800"
                    )}
                >
                    {isSubmitting ? (
                        <Loader2 size={24} color="white" className="animate-spin" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Submit & Unlock Dashboard</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
      </View>

      {/* Success Toast */}
      {showSuccess && (
        <View className="absolute top-20 left-0 right-0 items-center z-[110]">
            <View className="bg-emerald-800 px-8 py-3 rounded-full shadow-2xl flex-row items-center gap-3">
                <CheckCircle2 size={20} color="white" />
                <Text className="text-white font-bold">Dashboard Unlocked</Text>
            </View>
        </View>
      )}
    </SafeAreaView>
  );
}
