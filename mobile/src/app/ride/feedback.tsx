import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { Star, MessageSquare, ShieldCheck, Heart, Clock, ThumbsUp } from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { useRouter } from 'expo-router';

export default function RideFeedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const availableTags = ['Safe Driving', 'Punctual', 'Great Conversation', 'Clean Vehicle', 'Helpful'];

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How was your ride?</Text>
          <Text style={styles.subtitle}>Your feedback helps maintain community trust.</Text>
        </View>

        <View style={styles.driverProfile}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8WwWQd5tr4fUiuaNuevdCggJX0_jHrC_SbnLtf9Y-4JGIowahUALhMAvkITkqFuYxjVbEb2KKJWeyFtocMbHqzEg4pi8mG4jwEgcp1ukyFpAdgDo-OcNlbA47WO_KhWitO34YfyhQn31k0RA1JM1RxugYTr7PVG_EPpcFROuTh0aOrptcT0aWsgX3kQwuDW7K8r12XXot4KJJCkCB79sb23xCyKdG7Ac9OdXHVGQqvLSTi_ZyIjXwNYdJVWuHUpIi6HAan_u6TGI' }}
            style={styles.avatar}
          />
          <Text style={styles.driverName}>Binod Thapa</Text>
          <View style={styles.rideMeta}>
            <Clock size={14} color={SahayatriTheme.colors.onSurfaceVariant} />
            <Text style={styles.metaText}>Completed 15m ago • Koteshwor to Thapathali</Text>
          </View>
        </View>

        <View style={styles.ratingSection}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Star
                  size={48}
                  fill={rating >= s ? SahayatriTheme.colors.secondaryContainer : 'none'}
                  color={rating >= s ? SahayatriTheme.colors.secondaryContainer : SahayatriTheme.colors.outlineVariant}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating > 0 ? 'Needs Improvement' : 'Tap to rate'}
          </Text>
        </View>

        <View style={styles.tagSection}>
          <Text style={styles.sectionLabel}>What went well?</Text>
          <View style={styles.tagGrid}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, tags.includes(tag) && styles.tagActive]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[styles.tagText, tags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.sectionLabel}>Additional Comments (Optional)</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Write your experience here..."
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />
          </View>
        </View>

        <View style={styles.trustBanner}>
          <Heart size={20} color={SahayatriTheme.colors.primaryContainer} />
          <Text style={styles.trustText}>
            Sahayatri is built on mutual respect. Your rating helps Binod earn more Goodwill Credits.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, rating === 0 && styles.submitDisabled]}
          onPress={() => router.replace('/(tabs)')}
          disabled={rating === 0}
        >
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SahayatriTheme.colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  subtitle: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 8,
  },
  driverProfile: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  rideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.secondary,
  },
  tagSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outlineVariant,
    backgroundColor: SahayatriTheme.colors.surface,
  },
  tagActive: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    borderColor: SahayatriTheme.colors.primaryContainer,
  },
  tagText: {
    fontSize: 14,
    color: SahayatriTheme.colors.onSurface,
  },
  tagTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentSection: {
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: SahayatriTheme.colors.surface,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outlineVariant,
    borderRadius: 16,
    padding: 16,
  },
  input: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurface,
    textAlignVertical: 'top',
    height: 100,
  },
  trustBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: SahayatriTheme.colors.primaryContainer + '11',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: SahayatriTheme.colors.primaryContainer,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
