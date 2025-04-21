# Frontend Architecture

The frontend of the Skincare Routine Builder is built with React, TypeScript, and a suite of modern libraries to create a seamless multi-step form experience. This document outlines the key architectural components and patterns used in the frontend.

## Directory Structure

```
src/
├── assets/           # Static assets like images and icons
├── components/       # UI components
│   ├── background/   # Background visual elements
│   ├── layout/       # Layout components like form containers
│   ├── steps/        # Individual form step components
│   └── ui/           # Reusable UI components (buttons, inputs, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and store setup
├── modules/          # Feature-specific modules
├── providers/        # React context providers
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## State Management with Zustand

The application uses Zustand for global state management, which provides a simple yet powerful way to manage form state across multiple steps.

### Store Implementation (src/lib/store.ts)

```typescript
import { SkincareFormData } from '@/types/global'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FormState = {
  currentStep: number
  formData: SkincareFormData
  formId?: string
  pdfUrl?: string
  setCurrentStep: (step: number) => void
  setFormData: (data: SkincareFormData) => void
  setFormId: (id: string) => void
  setPdfUrl: (url: string) => void
  resetForm: () => void
  getLatestState: () => FormState
}

// Helper function to get the latest state from localStorage
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
        skinType: "OILY", // Default value
      },
      setCurrentStep: (step) => set({ currentStep: step }),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setFormId: (id) => set({ formId: id }),
      setPdfUrl: (url) => set({ pdfUrl: url }),
      resetForm: () =>
        set({ currentStep: 1, formData: {}, formId: undefined, pdfUrl: undefined }),
      getLatestState: () => getStorageData() || get(),
    }),
    {
      name: 'form-storage', // Key for localStorage
    }
  )
)
```

Key features of the store:
- Uses Zustand's `persist` middleware to automatically save state to localStorage
- Maintains the current step, form data, and document URLs
- Provides methods to update state and navigate between steps
- Includes a `getLatestState` method to retrieve the most up-to-date state from localStorage

## Custom Form Step Hook

The `useFormStep` hook provides a consistent interface for all form steps, handling form state, validation, and navigation.

### Hook Implementation (src/hooks/use-form-step.ts)

```typescript
import { useForm, FieldValues, DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useFormStore } from "@/lib/store"

interface UseFormStepProps<T extends FieldValues> {
  schema?: z.ZodSchema<T>
  currentStep: number
}

export function useFormStep<T extends FieldValues>({ 
  schema, 
  currentStep 
}: UseFormStepProps<T>) {
  const { setCurrentStep, setFormData, getLatestState } = useFormStore()

  const form = useForm<T>({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: "onChange",
    defaultValues: getLatestState().formData as DefaultValues<T>,
  })

  const handleNext = (data: T) => {
    setFormData(data)
    setCurrentStep(currentStep + 1)
  }

  const handleNextOveride = (data: T, overideStep?: number) => {
    setFormData(data)
    setCurrentStep(overideStep || currentStep + 1)
  }

  const handleBack = () => {
    const currentValues = form.getValues()
    setFormData(currentValues)
    setCurrentStep(currentStep - 1)
  }

  return {
    form,
    setFormData,
    handleNext,
    handleBack,
    handleNextOveride
  }
}
```

Key features of the hook:
- Integrates React Hook Form with Zustand store
- Provides schema-based validation using Zod
- Handles form submission and navigation between steps
- Supports conditional navigation with `handleNextOveride`
- Preserves form data when navigating back

## Step Components

Each step in the form is implemented as a standalone component that uses the `useFormStep` hook. This modular approach makes the form easy to maintain and extend.

### Example Step Component (src/components/steps/select-skin-type.tsx)

```typescript
import { z } from "zod"
import { useFormStep } from "@/hooks/use-form-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const skinTypeSchema = z.object({
  skinType: z.enum(["OILY", "DRY", "COMBINATION", "SENSITIVE"], {
    required_error: "Please select your skin type",
  }),
})

type SkinTypeForm = z.infer<typeof skinTypeSchema>

function SkinTypeStep({step}: {step: number}) {
  const { form, handleBack, handleNext, handleNextOveride } = useFormStep({
    schema: skinTypeSchema,
    currentStep: step,
  })

  // Example of conditional navigation
  const customHandleSubmit = (data: SkinTypeForm) => {
    if (data.skinType === "SENSITIVE") {
      handleNextOveride(data, 3) // Skip to step 3 for sensitive skin
    } else {
      handleNext(data)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Skin Type</CardTitle>
        <CardDescription>
          Select the option that best matches your skin's characteristics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(customHandleSubmit)}>
            <FormField
              control={form.control}
              name="skinType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      {/* Radio options here */}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
```

Key features of step components:
- Each step defines its own validation schema using Zod
- Uses the `useFormStep` hook for form state and navigation
- Can implement custom submission logic for conditional navigation
- Maintains a consistent UI pattern across all steps

## Form Coordinator (App.tsx)

The main App component serves as a coordinator that renders the appropriate step based on the current step in the Zustand store.

```typescript
import { FormLayout } from "./components/layout/form-layout"
import SplashScreen from "./components/steps/splash-screen"
import SelectSkinType from "./components/steps/select-skin-type"
import SelectSkinGoals from "./components/steps/select-skin-goals"
import { useFormStore } from "./lib/store"
// Import other step components...

function App() {
  const currentStep = useFormStore((state) => state.currentStep)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SplashScreen />
      case 2:
        return <SelectSkinType step={2}/>
      case 3:
        return <SelectSkinGoals step={3}/>
      // Additional cases for other steps...
      default:
        return <div>Step {currentStep} coming soon...</div>
    }
  }

  return (
    <FormLayout>
      {renderStep()}
    </FormLayout>
  )
}
```

## Form Submission

The final step component includes a lead form that collects user contact information and submits the complete form data to the backend.

```typescript
// In LeadForm component
const onSubmit = async (data: FormValues) => {
  try {
    // Submit form data to backend
    const response = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret-Key': process.env.API_KEY,
      },
      body: JSON.stringify({
        ...formData,
        ...data,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    
    const result = await response.json();
    
    // Update store with form ID and PDF URL
    setFormId(result.form_id);
    setPdfUrl(result.pdf_url);
    
    // Show success message
    toast({
      title: "Success",
      description: "Your skincare routine has been created!",
    });
  } catch (error) {
    // Handle error
    toast({
      variant: "destructive",
      title: "Error",
      description: "There was a problem submitting your form. Please try again.",
    });
  }
};
```

## Best Practices and Patterns

1. **Modular Components**: Each step is a self-contained component with its own validation logic.
2. **Type Safety**: TypeScript is used throughout to ensure type safety and improve developer experience.
3. **Schema Validation**: Zod schemas provide runtime validation and TypeScript type inference.
4. **State Persistence**: Form state is persisted in localStorage to prevent data loss on page refresh.
5. **Conditional Logic**: Form flow can be customized based on user input.
6. **Consistent UI**: Shadcn UI components provide a consistent look and feel.
7. **Animations**: Framer Motion is used for smooth transitions between steps.

## Conclusion

The frontend architecture of the Skincare Routine Builder is designed to be modular, maintainable, and extensible. By leveraging modern React patterns and libraries, it provides a seamless user experience while maintaining code quality and developer productivity. 