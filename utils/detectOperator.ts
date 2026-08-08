export type ScanResult = {
  operator: "YAS" | "ORANGE" | "AIRTEL";
  number: string;
  ussd: string;
};
export function detectOperator(text: string): ScanResult | null {
  const clean = text.replace(/\s+/g, " ").trim();

  // =====================
  // SCORES
  // =====================
  let yasScore = 0;
  let orangeScore = 0;
  let airtelScore = 0;

  // MOTS CLÉS YAS
  if (/kikiso/i.test(clean)) yasScore += 10;
  if (/tsindrio/i.test(clean)) yasScore += 10;
  if (/service client\s*:?\s*800/i.test(clean)) yasScore += 15;
  if (/#321/i.test(clean)) yasScore += 20;

  // MOTS CLÉS ORANGE
  if (/orange/i.test(clean)) orangeScore += 10;
  if (/raha\s*hampiditra/i.test(clean)) orangeScore += 20;
  if (/14\s*chiffres/i.test(clean)) orangeScore += 20;
  if (/code\s*à\s*14/i.test(clean)) orangeScore += 15;

  // MOTS CLÉS AIRTEL
  if (/raha\s*credit/i.test(clean)) airtelScore += 15;
  if (/raha\s*internet/i.test(clean)) airtelScore += 15;
  if (/raha\s*antso/i.test(clean)) airtelScore += 15;
  if (/\*436\*/i.test(clean)) airtelScore += 20;

  // ==================================================
  // PRIORITÉ 1 : DÉTECTION PAR FORMAT DE CODE
  // ==================================================

  // ---------- ORANGE ----------
  const orangeMatch = clean.match(/(\d{4})\s+(\d{4})\s+(\d{4})\s+(\d{2})/);
  if (orangeMatch) {
    const code = orangeMatch.slice(1).join("");
    return { operator: "ORANGE", number: code, ussd: `202${code}` };
  }

  // ---------- AIRTEL ----------
  const airtelMatch = clean.match(/(\d{5})\s+(\d{5})\s+(\d{5})/);
  if (airtelMatch) {
    const code = airtelMatch[0];
    return { operator: "AIRTEL", number: code, ussd: `*888*${code}#` };
  }

  // ---------- YAS ----------
  const yasMatch = clean.match(/\d{13,16}/g);
  if (yasMatch?.length) {
    const code = yasMatch.sort((a, b) => b.length - a.length)[0];
    return { operator: "YAS", number: code, ussd: `#321*${code}#` };
  }

  // ==================================================
  // PRIORITÉ 2 : SCORE SI OCR IMPARFAIT
  // ==================================================

  const scores = [
    { operator: "YAS" as const, score: yasScore },
    { operator: "ORANGE" as const, score: orangeScore },
    { operator: "AIRTEL" as const, score: airtelScore },
  ];

  const best = scores.sort((a, b) => b.score - a.score)[0];

  if (best.score < 20) {
    return null;
  }

  // ==================================================
  // EXTRACTION SECONDAIRE
  // ==================================================

  const digits = clean.replace(/\D/g, "");

  switch (best.operator) {
    case "ORANGE":
      if (digits.length >= 14) {
        const code = digits.slice(0, 14);
        return { operator: "ORANGE", number: code, ussd: `202${code}` };
      }
      break;

    case "AIRTEL":
      if (digits.length >= 15) {
        const code = digits.slice(0, 15);
        return { operator: "AIRTEL", number: code, ussd: `*888*${code}#` };
      }
      break;

    case "YAS":
      if (digits.length >= 13) {
        return { operator: "YAS", number: digits, ussd: `#321*${digits}#` };
      }
      break;
  }

  return null;
}