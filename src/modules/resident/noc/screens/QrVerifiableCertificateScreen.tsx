import { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { CertificatePreview } from '../../../../ui/patterns/CertificatePreview';
import { AppButton } from '../../../../shared/components/AppButton';
import { SafeText } from '../../../../shared/components/SafeText';
import { StatusPill, type StatusTone } from '../../../../ui/components/StatusPill';
import { useMessages } from '../../../../shared/constants/useMessages';
import { styles, createRootStyle, createSurfaceStyle, createColorStyle } from '../styles/screens/QrVerifiableCertificatePlaceholderScreen.styles';
import {
  type QrVerificationStatus,
  type QrVerificationResult,
  createQrVerificationService,
} from '../services/qrVerificationService';
import { vaultRepository } from '../../documents/vault/infrastructure/vaultRepository';

type IconName = keyof typeof Ionicons.glyphMap;

interface QrVerificationScreenProps {
  verificationCode?: string;
}

export function QrVerifiableCertificateScreen({ verificationCode }: QrVerificationScreenProps) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const copy = {
    title: messages.noc?.qrVerification ?? 'Verify Certificate',
    subtitle: 'Scan or enter verification code',
    scanButton: 'Scan QR Code',
    manualEntry: 'Enter Code Manually',
    verifying: 'Verifying...',
    verified: 'Certificate Verified',
    notFound: 'Certificate Not Found',
    revoked: 'Certificate Revoked',
    superseded: 'Certificate Superseded',
    integrityFailed: 'Integrity Check Failed',
    networkError: 'Network Error',
    enterCodePlaceholder: 'Enter verification code',
    verifyButton: 'Verify',
  };

  const [inputCode, setInputCode] = useState(verificationCode ?? '');
  const [result, setResult] = useState<QrVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const qrService = createQrVerificationService(vaultRepository);

  const handleVerify = useCallback(async () => {
    const code = inputCode.trim();
    if (!code) {
      Alert.alert('Error', 'Please enter a verification code');
      return;
    }

    setIsVerifying(true);
    try {
      const verificationResult = await qrService.verify({ verificationCode: code });
      setResult(verificationResult);
      setShowResult(true);
    } catch (error) {
      setResult({
        status: 'NETWORK_ERROR',
        error: error instanceof Error ? error.message : 'Verification failed',
        timestamp: new Date().toISOString(),
      });
      setShowResult(true);
    } finally {
      setIsVerifying(false);
    }
  }, [inputCode, qrService]);

  useEffect(() => {
    if (verificationCode) {
      void handleVerify();
    }
  }, [verificationCode, handleVerify]);

  const handleScan = useCallback(() => {
    Alert.alert('QR Scanner', 'QR code scanning would be implemented here');
  }, []);

  const getStatusConfig = (status: QrVerificationStatus): { tone: StatusTone; label: string; icon: IconName; description: string } => {
    const configs: Record<QrVerificationStatus, { tone: StatusTone; label: string; icon: IconName; description: string }> = {
      VALID: {
        tone: 'success',
        label: 'VALID',
        icon: 'checkmark-circle',
        description: 'This certificate is valid and has not been tampered with.',
      },
      REVOKED: {
        tone: 'danger',
        label: 'REVOKED',
        icon: 'close-circle',
        description: 'This certificate has been revoked and is no longer valid.',
      },
      SUPERSEDED: {
        tone: 'warning',
        label: 'SUPERSEDED',
        icon: 'refresh',
        description: 'A newer version of this certificate has been issued.',
      },
      NOT_FOUND: {
        tone: 'danger',
        label: 'NOT FOUND',
        icon: 'search-outline',
        description: 'No certificate found with this verification code.',
      },
      INTEGRITY_FAILED: {
        tone: 'danger',
        label: 'INTEGRITY FAILED',
        icon: 'alert-circle',
        description: 'Certificate data integrity check failed. Possible tampering detected.',
      },
      NETWORK_ERROR: {
        tone: 'danger',
        label: 'NETWORK ERROR',
        icon: 'alert-circle-outline',
        description: 'Unable to verify certificate. Please check your connection and try again.',
      },
    };
    return configs[status] ?? configs.NOT_FOUND;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (!showResult) {
    return (
      <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
        <ResidentPageHeader title={copy.title} showBackButton />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, createSurfaceStyle(theme.accentSoft)]}>
            <SafeText variant="h1" style={createColorStyle(theme.textPrimary)}>{copy.title}</SafeText>
            <SafeText variant="body" style={createColorStyle(theme.textSecondary)}>{copy.subtitle}</SafeText>
            <View style={styles.heroIcon}>
              <Ionicons name="qr-code-outline" size={64} color={theme.accent} />
            </View>
          </View>

          <View style={[styles.sectionCard, createSurfaceStyle(theme.surface)]}>
            <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>{copy.manualEntry}</SafeText>
            <TextInput
              style={styles.textInput}
              value={inputCode}
              onChangeText={setInputCode}
              placeholder={copy.enterCodePlaceholder}
              placeholderTextColor={theme.textMuted}
              autoCapitalize="characters"
            />

            <View style={styles.buttonRow}>
              <AppButton
                title={copy.scanButton}
                variant="secondary"
                onPress={handleScan}
                iconLeft={<Ionicons name="qr-code-outline" size={18} color={theme.accent} />}
                fullWidth
              />
              <AppButton
                title={isVerifying ? copy.verifying : copy.verifyButton}
                variant="primary"
                onPress={handleVerify}
                disabled={isVerifying || !inputCode.trim()}
                loading={isVerifying}
                fullWidth
              />
            </View>
          </View>

          <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} />
            <View style={styles.securityCopy}>
              <SafeText variant="caption" style={createColorStyle(theme.textPrimary)}>Secure Verification</SafeText>
              <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>
                Verification uses cryptographic integrity checks. No sensitive data is exposed.
              </SafeText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const config = getStatusConfig(result!.status);

  return (
    <SafeAreaView style={[styles.root, createRootStyle(theme.background)]}>
      <ResidentPageHeader title={copy.title} showBackButton onBackPress={() => setShowResult(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.resultCard, createSurfaceStyle(theme.surface)]}>
          <View style={[styles.resultIcon, createSurfaceStyle(`${config.tone === 'success' ? theme.success : config.tone === 'danger' ? theme.danger : theme.warning}Soft`)]}>
            <Ionicons name={config.icon} size={48} color={config.tone === 'success' ? theme.success : config.tone === 'danger' ? theme.danger : theme.warning} />
          </View>
          <SafeText variant="title" style={createColorStyle(theme.textPrimary)}>{config.label}</SafeText>
          <SafeText variant="body" style={createColorStyle(theme.textSecondary)}>{config.description}</SafeText>
          <StatusPill label={config.label} tone={config.tone} />
        </View>

        {result?.certificate && (
          <View style={[styles.certCard, createSurfaceStyle(theme.surface)]}>
            <SafeText variant="bodyStrong" style={createColorStyle(theme.textPrimary)}>Certificate Details</SafeText>
            <CertificatePreview
              title={result.certificate.nocType}
              certificateNumber={result.certificate.certificateNumber}
              residentName={result.certificate.societyName || 'Resident'}
              unitLabel={result.certificate.flatNumber ?? 'N/A'}
              issueDate={formatDate(result.certificate.issuedAt)}
              {...(result.certificate.expiresAt ? { validTill: formatDate(result.certificate.expiresAt) } : {})}
              authorizedSignatory={result.certificate.issuedBy}
              verificationCode={result.certificate.verificationCode}
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          <AppButton
            title="Verify Another"
            variant="secondary"
            onPress={() => { setShowResult(false); setInputCode(''); setResult(null); }}
            iconLeft={<Ionicons name="qr-code-outline" size={18} color={theme.accent} />}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default QrVerifiableCertificateScreen;