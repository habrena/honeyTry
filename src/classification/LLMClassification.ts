export interface LLMClassification {
  classification: string;
  confidence: number;
  severity: string; //koliko je ovo bitno
  explanation: string;
}
//export {}