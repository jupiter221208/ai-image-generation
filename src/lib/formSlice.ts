import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  prompt: string;
  negativePrompt: string;
  numImages: number;
  model: string;
  openaiApiKey: string;
  stabilityApiKey: string;
  googleApiKey: string;
}

const initialState: FormState = {
  prompt: "",
  negativePrompt: "",
  numImages: 1,
  model: "dall-e-3",
  openaiApiKey: "",
  stabilityApiKey: "",
  googleApiKey: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Partial<FormState>>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => {
      return initialState;
    },
  },
});

export const { setFormData, resetForm } = formSlice.actions;
export default formSlice.reducer;
