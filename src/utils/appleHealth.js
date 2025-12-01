// utils/appleHealth.ts
// Apple Health Integration for Recovery Score Calculation

interface HealthData {
  hrv?: number;
  sleepHours?: number;
  restingHeartRate?: number;
}

interface RecoveryResult {
  score: number;
  status: 'optimal' | 'suboptimal' | 'fatigue';
  details: {
    hrvScore: number;
    sleepScore: number;
    hrScore: number;
  };
}

/**
 * Normalize HRV value to 0-100 score
 * Typical HRV range: 20-100ms
 * Higher is better
 */
function normalizeHRV(hrv: number): number {
  if (hrv >= 80) return 100;
  if (hrv <= 20) return 40;
  
  // Linear interpolation between 20-80ms
  return 40 + ((hrv - 20) / 60) * 60;
}

/**
 * Normalize sleep hours to 0-100 score
 * Optimal: 7-9 hours
 */
function normalizeSleep(hours: number): number {
  if (hours >= 7 && hours <= 9) return 100;
  if (hours >= 6 && hours < 7) return 85;
  if (hours >= 9 && hours <= 10) return 90;
  if (hours < 6) return Math.max(50, 100 - ((6 - hours) * 15));
  return Math.max(60, 100 - ((hours - 10) * 10));
}

/**
 * Normalize resting heart rate to 0-100 score
 * Lower is better (better cardiovascular fitness)
 * Typical range: 50-100 bpm
 */
function normalizeHeartRate(bpm: number): number {
  if (bpm <= 60) return 100;
  if (bpm >= 90) return 60;
  
  // Linear interpolation
  return 100 - ((bpm - 60) / 30) * 40;
}

/**
 * Main function to calculate recovery score
 * Integrates with Capacitor Health plugin
 */
export async function getRecoveryScore(): Promise<RecoveryResult> {
  try {
    // Check if running in Capacitor environment
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      const { Health } = await import('@capacitor-community/health');
      
      // Request permissions first
      await Health.requestAuthorization({
        read: ['HRV', 'SLEEP', 'RESTING_HEART_RATE'],
        write: []
      });
      
      // Query HRV (last 24 hours)
      const hrvData = await Health.queryHKitSampleType({
        sampleName: 'HRV',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date(),
        limit: 10
      });
      
      // Query Sleep (last night)
      const sleepData = await Health.queryHKitSampleType({
        sampleName: 'SLEEP',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date()
      });
      
      // Query Resting Heart Rate
      const hrData = await Health.queryHKitSampleType({
        sampleName: 'RESTING_HEART_RATE',
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endDate: new Date(),
        limit: 1
      });
      
      // Extract values
      const hrvValue = hrvData.resultData?.[0]?.value || 50;
      const sleepValue = calculateSleepHours(sleepData.resultData);
      const hrValue = hrData.resultData?.[0]?.value || 70;
      
      return calculateRecoveryScore({
        hrv: hrvValue,
        sleepHours: sleepValue,
        restingHeartRate: hrValue
      });
      
    } else {
      // Fallback for web/development
      console.warn('Apple Health not available. Using simulated data.');
      return getSimulatedRecoveryScore();
    }
    
  } catch (error) {
    console.error('Apple Health error:', error);
    return getSimulatedRecoveryScore();
  }
}

/**
 * Calculate total sleep hours from sleep segments
 */
function calculateSleepHours(sleepData: any[]): number {
  if (!sleepData || sleepData.length === 0) return 7;
  
  const totalMinutes = sleepData.reduce((sum, segment) => {
    const start = new Date(segment.startDate).getTime();
    const end = new Date(segment.endDate).getTime();
    return sum + (end - start) / 1000 / 60;
  }, 0);
  
  return totalMinutes / 60;
}

/**
 * Calculate final recovery score from health metrics
 */
function calculateRecoveryScore(data: HealthData): RecoveryResult {
  const hrvScore = normalizeHRV(data.hrv || 50);
  const sleepScore = normalizeSleep(data.sleepHours || 7);
  const hrScore = normalizeHeartRate(data.restingHeartRate || 70);
  
  // Weighted average (HRV most important for recovery)
  const finalScore = Math.round(
    hrvScore * 0.5 +
    sleepScore * 0.35 +
    hrScore * 0.15
  );
  
  let status: 'optimal' | 'suboptimal' | 'fatigue';
  if (finalScore >= 85) status = 'optimal';
  else if (finalScore >= 70) status = 'suboptimal';
  else status = 'fatigue';
  
  return {
    score: finalScore,
    status,
    details: {
      hrvScore: Math.round(hrvScore),
      sleepScore: Math.round(sleepScore),
      hrScore: Math.round(hrScore)
    }
  };
}

/**
 * Simulated recovery score for development/testing
 */
function getSimulatedRecoveryScore(): RecoveryResult {
  // Vary score based on time of day for realistic testing
  const hour = new Date().getHours();
  let baseScore = 87;
  
  // Lower in morning (not fully recovered)
  if (hour < 10) baseScore = 75;
  // Peak in afternoon
  else if (hour >= 14 && hour <= 18) baseScore = 92;
  // Decline in evening
  else if (hour > 20) baseScore = 78;
  
  // Add some randomness
  const score = Math.min(100, Math.max(60, baseScore + Math.floor(Math.random() * 10 - 5)));
  
  let status: 'optimal' | 'suboptimal' | 'fatigue';
  if (score >= 85) status = 'optimal';
  else if (score >= 70) status = 'suboptimal';
  else status = 'fatigue';
  
  return {
    score,
    status,
    details: {
      hrvScore: score + 5,
      sleepScore: score - 3,
      hrScore: score + 2
    }
  };
}

/**
 * Format recovery score for display
 */
export function formatRecoveryScore(result: RecoveryResult): string {
  return `${result.score}% ${result.status.toUpperCase()}`;
}

/**
 * Get color based on recovery status
 */
export function getRecoveryColor(status: string): string {
  switch (status) {
    case 'optimal': return '#10b981';
    case 'suboptimal': return '#f59e0b';
    case 'fatigue': return '#ef4444';
    default: return '#6b7280';
  }
}
