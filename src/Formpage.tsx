import { FormLayout } from "./components/layout/form-layout"
import SplashScreen from "./components/steps/splash-screen"
import SelectSkinType from "./components/steps/select-skin-type"
import SelectSkinGoals from "./components/steps/select-skin-goals"



import { useFormStore } from "./lib/store"

import EnvironmentalFactors from "./components/steps/environmental-factors"
import ExfoliationTolerance from "./components/steps/exofiliate-tolerance"
import { IngredientPreferences } from "./components/steps/ingredient-preferences"
import ItemType from "./components/steps/routine-complexity"
import BudgetAllocation from "./components/steps/budget-allocation"
import MakeupQuestion from "./components/steps/makeup-question"
import LifestyleFactors from "./components/steps/lifestyle-factors"
import LocationType from "./components/steps/age-group"
import FinalStep from "./components/steps/final-step"
import EthicalPreferences from "./components/steps/ethical-preferences"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
function Formpage() {
  const currentStep = useFormStore((state) => state.currentStep)
  const { user } = useUser();
  const setUserId = useFormStore((state) => state.setUserId);
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SplashScreen />
      case 2:
        return <LifestyleFactors step={2} />
      case 3:
        return <LocationType step={3} />
      case 4:
        return <BudgetAllocation step={4} />
      case 5:
        return <ItemType step={5} />
      case 6:
        return <MakeupQuestion step={6} />
      case 7:
        return <FinalStep step={7} />
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

export default Formpage
