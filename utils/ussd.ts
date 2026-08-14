import type { OperatorId } from "@/constants/operators";

export function buildUssdCode(
  operatorId: OperatorId,
  phoneNumber: string,
  amount: string
): string {
  switch (operatorId) {
    case "yas":
      return `#111*1*4*1*${phoneNumber}*${amount}#`;
    case "airtel":
      return `*436*4*${phoneNumber}*${amount}*12#`;
    case "orange":
      return `#114*8*${phoneNumber}*${phoneNumber}*${amount}#`;
  }
}