import { Answer, AssessmentResult } from '@/types/assessment';

/**
 * Kategori gejala stres dengan bobot relatifnya
 * Bobot menggambarkan tingkat signifikansi gejala dalam diagnosis
 */
const symptomCategories = {
  physical: {
    ids: ['q3', 'q4', 'q8'], // Gejala fisik: ketegangan, pola tidur, energi rendah
    weight: 1.0,
  },
  cognitive: {
    ids: ['q5', 'q9'], // Gejala kognitif: sulit berkonsentrasi, sulit membuat keputusan
    weight: 1.2,
  },
  emotional: {
    ids: ['q2', 'q6', 'q7'], // Gejala emosional: sulit rileks, mudah kesal, khawatir
    weight: 1.3,
  },
  behavioral: {
    ids: ['q1', 'q10'], // Gejala perilaku: kewalahan dengan tugas, tekanan waktu
    weight: 0.9,
  },
};

/**
 * Implementasi enhanced CF calculation dengan kategorisasi gejala
 * dan kombinasi CF yang lebih kompleks
 */
export function calculateCF(answers: Answer[]): AssessmentResult {
  if (answers.length === 0) {
    return { stressLevel: 'mild', confidence: 0 };
  }

  // 1. Hitung CF untuk setiap kategori gejala
  const categoryCFs = calculateCategoryCFs(answers);

  // 2. Kombinasikan CF dari semua kategori dengan mempertimbangkan bobot
  const combinedCF = combineCategoryValues(categoryCFs);

  // 3. Tentukan tingkat stres berdasarkan nilai CF gabungan
  const stressLevel = determineStressLevel(combinedCF);

  // 4. Hitung confidence berdasarkan nilai absolut CF & konsistensi jawaban
  const consistency = calculateConsistency(answers);
  const confidence = calculateConfidence(combinedCF, consistency);

  return { stressLevel, confidence };
}

/**
 * Menghitung CF untuk setiap kategori gejala
 */
function calculateCategoryCFs(answers: Answer[]): {
  [category: string]: number;
} {
  const result: { [category: string]: number } = {};
  const answerMap = new Map(answers.map((a) => [a.questionId, a.value]));

  // Untuk setiap kategori, hitung CF terpisah
  for (const [category, data] of Object.entries(symptomCategories)) {
    const categoryAnswers = data.ids
      .filter((id) => answerMap.has(id))
      .map((id) => answerMap.get(id) || 0);

    if (categoryAnswers.length === 0) {
      result[category] = 0;
      continue;
    }

    // Hitung MB dan MD untuk kategori ini
    let mb = 0,
      md = 0;
    categoryAnswers.forEach((value) => {
      if (value > 0) mb += value;
      else md += Math.abs(value);
    });

    // Normalisasi
    mb = mb / categoryAnswers.length;
    md = md / categoryAnswers.length;

    // CF kategori (dibobot)
    result[category] = (mb - md) * data.weight;
  }

  return result;
}

/**
 * Menggabungkan nilai CF dari berbagai kategori
 * Menggunakan metode kombinasi CF yang lebih canggih
 */
function combineCategoryValues(categoryCFs: { [category: string]: number }): number {
  // Implementasi Aturan Kombinasi CF yang lebih kompleks
  // CF(A,B) = CF(A) + CF(B) - CF(A) * CF(B) untuk nilai positif
  // CF(A,B) = CF(A) + CF(B) + CF(A) * CF(B) untuk nilai negatif
  // CF(A,B) = [CF(A) + CF(B)] / [1 - min(|CF(A)|, |CF(B)|)] untuk nilai bertanda berbeda

  const values = Object.values(categoryCFs);
  if (values.length === 0) return 0;

  // Mulai dengan nilai CF pertama
  let combinedCF = values[0];

  // Gabungkan dengan nilai-nilai lainnya menggunakan aturan di atas
  for (let i = 1; i < values.length; i++) {
    const cfA = combinedCF;
    const cfB = values[i];

    if (cfA >= 0 && cfB >= 0) {
      // Kedua nilai positif
      combinedCF = cfA + cfB - cfA * cfB;
    } else if (cfA < 0 && cfB < 0) {
      // Kedua nilai negatif
      combinedCF = cfA + cfB + cfA * cfB;
    } else {
      // Nilai bertanda berbeda
      const denominator = 1 - Math.min(Math.abs(cfA), Math.abs(cfB));
      combinedCF = (cfA + cfB) / (denominator === 0 ? 1 : denominator);
    }
  }

  return combinedCF;
}

/**
 * Menghitung konsistensi jawaban sebagai faktor tambahan
 * untuk kepercayaan hasil (0-1)
 */
function calculateConsistency(answers: Answer[]): number {
  if (answers.length <= 1) return 1;

  // Hitung standard deviasi nilai jawaban
  const values = answers.map((a) => a.value);
  const mean = values.reduce((sum: number, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum: number, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Transformasi standar deviasi ke nilai konsistensi (1 = sangat konsisten, 0 = tidak konsisten)
  // Nilai 0.6 dipilih sebagai threshold maximum inconsistency
  const normalizedConsistency = Math.max(0, 1 - stdDev / 0.6);

  return normalizedConsistency;
}

/**
 * Menghitung tingkat keyakinan akhir berdasarkan CF dan konsistensi
 */
function calculateConfidence(cf: number, consistency: number): number {
  // Combine absolute CF value with consistency
  const rawConfidence = Math.abs(cf) * 0.8 + consistency * 0.2;

  // Scale to 0-100%
  return Math.round(rawConfidence * 100);
}

/**
 * Menentukan tingkat stres berdasarkan nilai CF
 */
function determineStressLevel(cf: number): 'mild' | 'moderate' | 'severe' {
  // Threshold values untuk klasifikasi stres
  if (cf < -0.25) return 'mild';
  if (cf < 0.4) return 'moderate';
  return 'severe';
}
