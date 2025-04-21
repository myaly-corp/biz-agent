import { SkincareFormData } from '@/types/global';

export const formatSkincareDataToText = (data: SkincareFormData): string => {
  const sections: string[] = [];

  // Helper function to format section
  const formatSection = (title: string, content: string): string => {
    return `${title}\n${'-'.repeat(title.length)}\n${content}\n`;
  };

  // Basic Skin Profile
  const basicProfile = [
    `Skin Type: ${data.skinType}`,
    `Location Type: ${data.locationType === "Major Urban Center" ? "Major Urban Center" : 
                 data.locationType === "Mid Size City" ? "Mid Size City" : 
                 data.locationType === "Suburban Area" ? "Suburban Area" : "Rural/Remote"}`,
    `Skin Goals: ${data.skinGoal}`,
    `Makeup Usage: ${data.makeupFrequency ? data.makeupFrequency : 'No makeup'}`,
    data.monetizationLevel ? `Makeup Types: ${data.monetizationLevel}` : '',
  ].filter(Boolean).join('\n');
  
  sections.push(formatSection('BASIC SKIN PROFILE', basicProfile));

  // Environmental Factors
  const environmental = [
    `Daily Sun Exposure: ${data.budgetLevels === "300-500" ? "300-500" : 
                          data.budgetLevels === "500-1500" ? "500-1500" : 
                          data.budgetLevels === "1500-5000" ? "1500-5000" : "5000+"}`,
    `Climate Type: ${data.climateType}`,
  ].join('\n');
  
  sections.push(formatSection('ENVIRONMENTAL FACTORS', environmental));

  // Lifestyle & Health
  const lifestyle = [
    `Stress Level: ${data.experienceLevel}/10`,
    `Sleep Duration: ${data.workPatterns === "LESS_THAN_6_HRS" ? "Less than 6 hours" : 
                      data.workPatterns === "6_TO_8_HRS" ? "6-8 hours" : "More than 8 hours"}`,
  ].join('\n');
  
  sections.push(formatSection('LIFESTYLE & HEALTH', lifestyle));

  // Budget & Preferences
  const budget = [
    `Monthly Budget: $${data.marketType === "Consumer Products" ? "Consumer Products" : 
                        data.marketType === "Hobbyist Market" ? "Hobbyist Market" :
                        data.marketType === "Business Solutions" ? "Business Solutions" :
                        data.marketType === "Custom/Personalized" ? "Custom/Personalized" : "Custom/Personalized"}`,
    data.hasPreferencesEthical && data.ethicalPreferences ? 
      `Ethical Preferences: ${data.ethicalPreferences.map(pref => 
        pref === "CRUELTY_FREE" ? "Cruelty Free" :
        pref === "VEGAN" ? "Vegan" :
        pref === "SUSTAINABLE_PACKAGING" ? "Sustainable Packaging" :
        pref === "REEF_SAFE" ? "Reef Safe" :
        pref === "PALM_OIL_FREE" ? "Palm Oil Free" : pref
      ).join(', ')}` : '',
  ].filter(Boolean).join('\n');
  
  sections.push(formatSection('BUDGET & PREFERENCES', budget));



  // Add timestamp
  const timestamp = `Generated on: ${new Date().toLocaleString()}`;
  sections.push(`\n${timestamp}`);

  return sections.join('\n');
};

// Example usage:
/*
const textSummary = formatSkincareDataToText(skincareData);
console.log(textSummary);

Output example:

BASIC SKIN PROFILE
-----------------
Skin Type: COMBINATION
Age Group: 30s
Skin Goals: ANTI_AGING
Makeup Usage: Daily
Makeup Types: Foundation, Concealer

ENVIRONMENTAL FACTORS
--------------------
Daily Sun Exposure: 500-1500
Climate Type: Humid

...etc
*/