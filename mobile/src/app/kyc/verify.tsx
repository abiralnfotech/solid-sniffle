import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  ChevronRight,
  Lock,
  ShieldCheck,
  Gavel,
  Headphones,
  FileText
} from 'lucide-react-native';
import { SahayatriTheme } from '@/constants/sahayatri-theme';
import { apiClient } from '@/api/client';

export default function KYCScreen() {
  const [idNumber, setIdNumber] = useState('');
  const [isDriver, setIsDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!idNumber) {
      Alert.alert("Error", "Please enter your ID number");
      return;
    }
    setLoading(true);
    try {
      await apiClient.kyc.submit({ id_number: idNumber, is_driver_applicant: isDriver });
      Alert.alert(
        "Success",
        "Identity details submitted for manual verification. This usually takes 2-4 hours.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch {
      Alert.alert("Error", "Failed to submit KYC");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            Secure your account and join our trusted community network.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Citizenship / National ID Number</Text>
            <View style={styles.inputWrapper}>
              <FileText size={20} color={SahayatriTheme.colors.outline} />
              <TextInput
                style={styles.input}
                placeholder="Enter your 12-digit ID number"
                value={idNumber}
                onChangeText={setIdNumber}
              />
            </View>
          </View>

          <View style={styles.uploadGrid}>
            <TouchableOpacity style={styles.uploadBox}>
              <Camera size={32} color={SahayatriTheme.colors.primaryContainer} opacity={0.6} />
              <Text style={styles.uploadText}>Document Front</Text>
              <Text style={styles.uploadHint}>Tap to upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBox}>
              <Camera size={32} color={SahayatriTheme.colors.primaryContainer} opacity={0.6} />
              <Text style={styles.uploadText}>Document Back</Text>
              <Text style={styles.uploadHint}>Tap to upload</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.driverToggle, isDriver && styles.driverToggleActive]}
            onPress={() => setIsDriver(!isDriver)}
          >
            <View style={styles.checkbox}>
              {isDriver && <View style={styles.checkboxInner} />}
            </View>
            <View style={styles.toggleContent}>
              <Text style={styles.toggleTitle}>I want to apply to be a Community Driver</Text>
              <Text style={styles.toggleSubtitle}>Help others travel safely and earn goodwill credits.</Text>
            </View>
          </TouchableOpacity>

          {isDriver && (
            <TouchableOpacity style={styles.licenseUpload}>
              <Camera size={24} color={SahayatriTheme.colors.secondary} />
              <Text style={styles.licenseText}>Upload Driver&apos;s License</Text>
            </TouchableOpacity>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitText}>{loading ? 'Processing...' : 'Submit for Verification'}</Text>
              <ChevronRight size={20} color={SahayatriTheme.colors.onPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.draftButton}>
              <Text style={styles.draftText}>Save as Draft</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.badges}>
          <View style={styles.badgeItem}>
            <Lock size={20} color={SahayatriTheme.colors.primaryContainer} />
            <Text style={styles.badgeText}>End-to-End Encrypted</Text>
          </View>
          <View style={styles.badgeItem}>
            <ShieldCheck size={20} color={SahayatriTheme.colors.primaryContainer} />
            <Text style={styles.badgeText}>Manual Review</Text>
          </View>
          <View style={styles.badgeItem}>
            <Gavel size={20} color={SahayatriTheme.colors.primaryContainer} />
            <Text style={styles.badgeText}>Legal Compliance</Text>
          </View>
          <View style={styles.badgeItem}>
            <Headphones size={20} color={SahayatriTheme.colors.primaryContainer} />
            <Text style={styles.badgeText}>24/7 Assistance</Text>
          </View>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurface,
  },
  subtitle: {
    fontSize: 16,
    color: SahayatriTheme.colors.onSurfaceVariant,
    marginTop: 8,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SahayatriTheme.colors.surface,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outlineVariant,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: SahayatriTheme.colors.onSurface,
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadBox: {
    flex: 1,
    height: 160,
    backgroundColor: SahayatriTheme.colors.surfaceContainerLow,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: SahayatriTheme.colors.outlineVariant,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSurface,
  },
  uploadHint: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSurfaceVariant,
  },
  driverToggle: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: SahayatriTheme.colors.secondaryContainer + '11',
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.secondaryContainer + '22',
    borderRadius: 16,
    gap: 16,
  },
  driverToggleActive: {
    backgroundColor: SahayatriTheme.colors.secondaryContainer + '22',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: SahayatriTheme.colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: SahayatriTheme.colors.secondaryContainer,
  },
  toggleContent: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SahayatriTheme.colors.onSecondaryContainer,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: SahayatriTheme.colors.onSecondaryContainer,
    opacity: 0.8,
    marginTop: 2,
  },
  licenseUpload: {
    height: 120,
    backgroundColor: SahayatriTheme.colors.secondaryContainer + '11',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: SahayatriTheme.colors.secondaryContainer + '44',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  licenseText: {
    fontSize: 14,
    fontWeight: '600',
    color: SahayatriTheme.colors.onSecondaryContainer,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: SahayatriTheme.colors.primaryContainer,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: SahayatriTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: SahayatriTheme.colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  draftButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: SahayatriTheme.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftText: {
    color: SahayatriTheme.colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: SahayatriTheme.colors.outlineVariant,
    paddingTop: 24,
  },
  badgeItem: {
    width: '50%',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  badgeText: {
    fontSize: 10,
    color: SahayatriTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
