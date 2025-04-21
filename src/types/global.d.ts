export type SkincareFormData = {
  skinType?: "OILY" | "DRY" | "COMBINATION" | "SENSITIVE"
  skinGoal?: "ANTI_AGING" | "ACNE" | "HYDRATION" | "EVEN_TONE"
  acneType?: "HORMONAL" | "STRESS" | "CONGESTION"
  budgetLevels?: "300-500" | "500-1500" | "1500-5000" | "5000+"
  climateType?: "ARID" | "HUMID" | "URBAN"
  exfoliationFrequency?: "NEVER" | "WEEKLY" | "DAILY"
  exfoliationType?: "PHYSICAL_SCRUBS" | "CHEMICAL_EXFOLIANTS" | "ENZYME_EXFOLIATORS"
  locationType?: "Major Urban Center" | "Mid Size City" | "Suburban Area" | "Rural/Remote"
  blacklistedIngredients?: string[]
  texturePreference?: "LIGHTWEIGHT" | "RICH" | "NO_PREFERENCE"
  packagingPreference?: "ECO_REFILL" | "AIRLESS_PUMP" | "STANDARD"
  monetizationLevel?: ("Hobby Income" | "Side Income" | "Income Replacement" | "Scalable Business")[]
  makeupFrequency?: 'DAILY' | 'FEW_TIMES_WEEK' | 'WEEKENDS_ONLY' | 'SPECIAL_OCCASIONS'
  ethicalPreferences?: ("NONE"|"CRUELTY_FREE" | "VEGAN" | "SUSTAINABLE_PACKAGING" | "REEF_SAFE" | "PALM_OIL_FREE")[]
  experienceLevel?: "BASIC" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  workPatterns?: "LESS_THAN_6_HRS" | "6_TO_8_HRS" | "MORE_THAN_8_HRS"
  preferredIngredients?: ("HYALURONIC_ACID" | "VITAMIN_C" | "NIACINAMIDE" | "CERAMIDES" | "PEPTIDES" | "PANTHENOL" | "CENTELLA_ASIATICA")[]
  avoidedIngredients?: ("PARABENS" | "SILICONES" | "MINERAL_OIL" | "ESSENTIAL_OILS")[]
  ItemType?: "Functional Items" | "Decorative Items" | "Hobby Accessories" | "Gift & Novelty"
  marketType?: "Consumer Products" | "Hobbyist Market" | "Business Solutions" | "Custom/Personalized"
  hasPreferencesEthical?: boolean
  sustainabilityPriorities?: ("CRUELTY_FREE" | "RECYCLABLE" | "VEGAN")[]
}