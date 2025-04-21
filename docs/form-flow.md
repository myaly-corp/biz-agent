# Form Flow & Conditional Logic

The Skincare Routine Builder implements a sophisticated multi-step form with conditional logic that adapts to user input. This document explains how the form flow works and how conditional logic is implemented.

## Form Flow Overview

The form consists of multiple steps that guide users through a series of questions about their skin type, concerns, and preferences. The flow is designed to be intuitive and adaptive, showing only relevant questions based on previous answers.

### Step Sequence

The basic step sequence is defined in the `App.tsx` file:

```typescript
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
      case 4:
        return <LocationType step={4}/>
      case 5:
        return <EnvironmentalFactors step={5}/>
      case 6:
        return <LifestyleFactors step={6}/>
      case 7: 
        return <ExfoliationTolerance step={7}/>
      case 8:
        return <IngredientPreferences step={8}/>
      case 9:
        return <ItemType step={9}/>
      case 10:
        return <BudgetAllocation step={10}/>
      case 11:
        return <EthicalPreferences step={11}/>
      case 12:
        return <MakeupQuestion step={12}/>
      case 13:
        return <FinalStep step={13}/>
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

## Conditional Logic Implementation

Conditional logic is implemented at two levels:

1. **Step-level conditional logic**: Determining which step to show next based on previous answers
2. **Field-level conditional logic**: Showing or hiding fields within a step based on user input

### Step-Level Conditional Logic

Step-level conditional logic is implemented using the `handleNextOveride` function provided by the `useFormStep` hook. This function allows a step to specify which step should be shown next, overriding the default sequential flow.

Example from `select-skin-type.tsx`:

```typescript
function SkinTypeStep({step}: {step: number}) {
  const { form, handleBack, handleNext, handleNextOveride } = useFormStep({
    schema: skinTypeSchema,
    currentStep: step,
  })

  // Custom submission handler with conditional logic
  const customHandleSubmit = (data: SkinTypeForm) => {
    if (data.skinType === "SENSITIVE") {
      // Skip to step 3 for sensitive skin
      handleNextOveride(data, 3)
    } else {
      // Normal flow for other skin types
      handleNext(data)
    }
  }

  return (
    // Form JSX...
    <form onSubmit={form.handleSubmit(customHandleSubmit)}>
      {/* Form fields... */}
    </form>
  )
}
```

In this example, if the user selects "SENSITIVE" as their skin type, they will be taken directly to step 3, skipping step 2. This allows for a customized flow based on user input.

### Field-Level Conditional Logic

Field-level conditional logic is implemented using React's conditional rendering capabilities. Fields can be shown or hidden based on the values of other fields.

Example from a hypothetical step:

```typescript
function LifestyleFactorsStep({step}: {step: number}) {
  const { form, handleBack, handleNext } = useFormStep({
    schema: lifestyleSchema,
    currentStep: step,
  })

  // Get the current value of a field to use for conditional rendering
  const watchbudgetLevels = form.watch("budgetLevels")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)}>
        <FormField
          control={form.control}
          name="budgetLevels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How much time do you spend in the sun?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                  <RadioGroupItem value="BEGINNER">Less than 1 hour per day</RadioGroupItem>
                  <RadioGroupItem value="MEDIUM">1-3 hours per day</RadioGroupItem>
                  <RadioGroupItem value="HIGH">More than 3 hours per day</RadioGroupItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Conditional field that only appears for medium or high sun exposure */}
        {(watchbudgetLevels === "MEDIUM" || watchbudgetLevels === "HIGH") && (
          <FormField
            control={form.control}
            name="useSunscreen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you use sunscreen daily?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                    <RadioGroupItem value="YES">Yes</RadioGroupItem>
                    <RadioGroupItem value="NO">No</RadioGroupItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {/* Navigation buttons */}
        <Button type="button" onClick={handleBack}>Back</Button>
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}
```

In this example, the "Do you use sunscreen daily?" question only appears if the user selects "1-3 hours per day" or "More than 3 hours per day" for the sun exposure question.

## Planning Conditional Logic

Before implementing a multi-step form with conditional logic, it's important to plan the flow carefully. Here are some best practices:

1. **Create a flow diagram**: Map out all possible paths through the form
2. **Define dependencies**: Identify which questions depend on answers to previous questions
3. **Establish validation rules**: Define validation requirements for each field
4. **Plan skip logic**: Determine which steps can be skipped based on certain conditions
5. **Consider edge cases**: Think about all possible combinations of user inputs

## Implementing New Conditional Logic

To add new conditional logic to the form:

1. **Update the step component**:
   ```typescript
   const customHandleSubmit = (data: YourFormType) => {
     if (condition) {
       handleNextOveride(data, targetStep)
     } else {
       handleNext(data)
     }
   }
   ```

2. **Add conditional rendering for fields**:
   ```typescript
   const watchValue = form.watch("fieldName")
   
   {watchValue === "SPECIFIC_VALUE" && (
     <FormField
       // Conditional field definition
     />
   )}
   ```

3. **Update validation schema if needed**:
   ```typescript
   const conditionalSchema = z.object({
     mainField: z.string(),
     conditionalField: z.string().optional(),
   }).refine(data => {
     // If mainField has a specific value, conditionalField is required
     if (data.mainField === "SPECIFIC_VALUE" && !data.conditionalField) {
       return false
     }
     return true
   }, {
     message: "This field is required based on your previous selection",
     path: ["conditionalField"]
   })
   ```

## Best Practices for Conditional Logic

1. **Keep it simple**: Avoid overly complex conditional paths that might confuse users
2. **Provide clear feedback**: Make it obvious why certain questions appear or disappear
3. **Maintain state**: Ensure form data is preserved when navigating back and forth
4. **Test thoroughly**: Verify all possible paths through the form
5. **Consider performance**: Complex conditional logic can impact performance, especially with many fields
6. **Document the flow**: Maintain documentation of the form flow for future reference

## Conclusion

The conditional logic implementation in the Skincare Routine Builder creates a dynamic and personalized experience for users. By carefully planning and implementing both step-level and field-level conditional logic, the form adapts to user input and only shows relevant questions, resulting in a more efficient and user-friendly experience. 