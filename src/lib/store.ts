import { SkincareFormData } from '@/types/global'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


type FormState = {
  currentStep: number
  formData: SkincareFormData
  formId?: string
  pdfUrl?: string
  userId?: string
  setCurrentStep: (step: number) => void
  setFormData: (data: SkincareFormData) => void
  setFormId: (id: string) => void
  setPdfUrl: (url: string) => void
  setUserId: (id: string) => void
  resetForm: () => void
  getLatestState: () => FormState
}

// Add this helper function to get the latest state
const getStorageData = () => {
  try {
    const storageData = localStorage.getItem('form-storage')
    if (!storageData) return null
    
    const parsedData = JSON.parse(storageData)
    return parsedData.state as FormState
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

export const useFormStore = create<FormState>()(
  
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {
        itemType: "Hobby Accessories",
      },
      setUserId: (id) => set({ userId: id }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setFormId: (id) => set({ formId: id }),
      setPdfUrl: (url) => set({ pdfUrl: url }),
      resetForm: () =>
        set({ currentStep: 1, formData: {}, formId: undefined, pdfUrl: undefined, userId: undefined }),
      getLatestState: () => getStorageData() || get(),
    }),
    {
      name: 'form-storage',
    }
  )
) 