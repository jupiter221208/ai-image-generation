declare module "@/lib/formSlice" {
  export interface FormState {
    prompt: string;
    negativePrompt: string;
    numImages: number;
    model: string;
    openaiApiKey: string;
    stabilityApiKey: string;
    googleApiKey: string;
  }
}
