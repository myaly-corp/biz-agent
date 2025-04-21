import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useFormStep } from '@/hooks/use-form-step';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { lifestyleFactors, workPatternsOptions, experienceLevelOptions, budgetLevelsOptions, SunParticles } from '@/lib/lifestyle-options';

const lifestyleFactorsSchema = z.object({
    budgetLevels: z.enum(["300-500", "500-1500", "1500-5000", "5000+"], {
      required_error: "Please select your budget level"
    }),
    experienceLevel: z.enum(["BASIC", "BEGINNER", "INTERMEDIATE", "ADVANCED"], {
      required_error: "Please select your experience level"
    }),
    workPatterns: z.enum(["1_TO_5_HRS", "5_TO_15_HRS", "15_TO_30_HRS", "MORE_THAN_30_HRS"], {
      required_error: "Please select your work pattern"
    })
  })


const LifestyleFactors = ({ step }: { step: number }) => {
    const { form, handleBack, handleNext } = useFormStep({
      schema: lifestyleFactorsSchema,
      currentStep: step,
    });
  
    const [completedSections, setCompletedSections] = useState({
      budgetLevels: false,
      experienceLevel: false,
      workPatterns: false
    });
  
    // Create refs for each section
    const budgetLevelsRef = useRef<HTMLDivElement>(null);
    const experienceLevelRef = useRef<HTMLDivElement>(null);
    const workPatternsRef = useRef<HTMLDivElement>(null);
  
    // Improved smooth scroll function using native scrollIntoView
    const smoothScrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    };
  
    const handleSectionComplete = (section: keyof typeof completedSections, value: any) => {
      setCompletedSections(prev => ({
        ...prev,
        [section]: true
      }));
      form.setValue(section, value);
  
      // Auto-scroll to next section after a brief delay
      requestAnimationFrame(() => {
        if (section === 'budgetLevels' && experienceLevelRef.current) {
          smoothScrollToSection(experienceLevelRef);
        } else if (section === 'experienceLevel' && workPatternsRef.current) {
          smoothScrollToSection(workPatternsRef);
        }
      });
    };
  
    // Add custom CSS for scroll behavior and animations
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }
        
        @keyframes bounce-scroll {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .scroll-indicator {
          animation: bounce-scroll 1s infinite;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }, []);
  
    const renderOptionCards = (options: any[], fieldName: string) => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {options.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "relative min-h-[300px] cursor-pointer transition-all duration-700 ease-in-out overflow-hidden",
                form.getValues(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels") === option.value 
                  ? "ring-2 ring-primary shadow-lg transform" 
                  : "hover:shadow-md",
                // Add themed backgrounds for both stress and sleep
                fieldName === "experienceLevel" && 
                form.getValues(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels") === option.value && 
                "stress-mode",
                fieldName === "workPatterns" && 
                form.getValues(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels") === option.value && 
                "night-mode"
              )}
              onClick={() => handleSectionComplete(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels", option.value)}
            >
              {/* Night sky animation for sleep patterns */}
              {fieldName === "workPatterns" && (
                <div className="absolute inset-0 z-0">
                  <div 
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      form.getValues(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels") === option.value
                        ? "opacity-100" 
                        : "opacity-0",
                      "bg-gradient-to-b",
                      option.theme?.background
                    )}
                  >
                    {/* Stars */}
                    <div className="stars absolute inset-0 z-10">
                      {[...Array(option.theme?.starCount || 20)].map((_, i) => (
                        <div
                          key={i}
                          className="star absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `twinkle ${1 + Math.random() * 2}s infinite ${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Moon */}
                    <div 
                      className={cn(
                        "moon absolute top-4 right-4 w-16 h-16 rounded-full transition-all duration-700",
                        "bg-gradient-to-br",
                        option.theme?.moonColor,
                        option.theme?.moonGlow,
                        form.getValues(fieldName) === option.value
                          ? "scale-100 opacity-100" 
                          : "scale-0 opacity-0"
                      )}
                    />
                  </div>
                </div>
              )}
              {/* Stress level animation background */}
              {fieldName === "experienceLevel" && (
                <motion.div 
                  className="absolute inset-0 z-0"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: form.getValues(fieldName) === option.value ? 1 : 0 
                  }}
                  transition={{ duration: 0.7 }}
                >
                  <div className={cn(
                    "absolute inset-0 transition-opacity duration-700",
                    "bg-gradient-to-b",
                    option.theme?.background
                  )} />
                </motion.div>
              )}

              {/* Sun exposure animation background */}
              {fieldName === "budgetLevels" && (
                <div className="absolute inset-0 z-0">
                  <div 
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700",
                      form.getValues(fieldName) === option.value
                        ? "opacity-100" 
                        : "opacity-0",
                      "bg-gradient-to-b",
                      option.theme?.background
                    )}
                  />
                  {form.getValues(fieldName) === option.value && (
                    <SunParticles type={option.theme?.particles} />
                  )}
                </div>
              )}

              <CardContent className={cn(
                "relative z-10 p-6 flex flex-col items-center text-center",
                (fieldName === "experienceLevel" || 
                 fieldName === "workPatterns" || 
                 fieldName === "budgetLevels") && 
                form.getValues(fieldName) === option.value && 
                "text-white"
              )}>
                <motion.div
                  className={cn(
                    "transition-colors duration-700",
                    fieldName === "experienceLevel" && option.theme?.color
                  )}
                  animate={{
                    scale: form.getValues(fieldName as "experienceLevel" | "workPatterns" | "budgetLevels") === option.value ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {option.icon}
                </motion.div>

                {/* Rest of the card content with conditional styling */}
                <h3 className="font-semibold mt-4">{option.label}</h3>
                <p className={cn(
                  "text-sm mt-2",
                  (fieldName === "experienceLevel" || 
                   fieldName === "workPatterns" || 
                   fieldName === "budgetLevels") && 
                  form.getValues(fieldName) === option.value
                    ? "text-white/80" 
                    : "text-muted-foreground"
                )}>
                  {option.description}
                </p>

                {/* Effects and Recommendations */}
                {option.effects && (
                  <div className="mt-4 text-left w-full">
                    <h4 className="text-sm font-serif font-medium mb-2">Effects on Printing Productivity</h4>
                    <ul className="space-y-1">
                      {option.effects.map((effect: string, index: number) => (
                        <motion.li 
                          key={index}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={cn(
                            "text-sm flex items-center gap-2",
                            (fieldName === "experienceLevel" || 
                             fieldName === "workPatterns" || 
                             fieldName === "budgetLevels") && 
                            form.getValues(fieldName) === option.value
                              ? "text-white/80" 
                              : "text-muted-foreground"
                          )}
                        >
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {effect}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {option.recommendations && (
                  <div className="mt-4 text-left w-full">
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.recommendations.map((rec: string, index: number) => (
                        <span
                          key={index}
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs",
                            (fieldName === "experienceLevel" || 
                             fieldName === "workPatterns" || 
                             fieldName === "budgetLevels") && 
                            form.getValues(fieldName) === option.value
                              ? "bg-white/20 text-white"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );

    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className='text-4xl font-serif mb-4 text-left md:text-center'>Your 3D Printing Factors</CardTitle>
          <CardDescription>
            Help us understand your personal 3D printing journey.
          </CardDescription>
        </CardHeader>
  
          <CardContent className='p-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
              <div className="space-y-8">
                {/* Sun Exposure Section */}
                <div 
                  ref={budgetLevelsRef} 
                  id="sun-exposure-section"
                  className={cn(
                    lifestyleFactors.budgetLevels.containerClass,
                    "scroll-mt-20" // Add scroll margin to account for fixed headers
                  )}
                >
                  <FormField
                    control={form.control}
                    name="budgetLevels"
                    render={() => (
                      <FormItem>
                        <div className="mb-6">
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            {lifestyleFactors.budgetLevels.title}
                            {completedSections.budgetLevels && (
                              <span className="flex items-center text-primary text-sm">
                                <Check className="w-4 h-4 mr-1" /> Selected
                              </span>
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lifestyleFactors.budgetLevels.description}
                          </p>
                        </div>
                        {renderOptionCards(budgetLevelsOptions, 'budgetLevels')}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
  
                {/* Budget Section */}
                {completedSections.budgetLevels && (
                  <div 
                    ref={experienceLevelRef} 
                    id="stress-levels-section"
                    className={cn(
                      lifestyleFactors.experienceLevel.containerClass,
                      "scroll-mt-20"
                    )}
                  >
                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={() => (
                        <FormItem>
                          <div className="mb-6">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                              {lifestyleFactors.experienceLevel.title}
                              {completedSections.experienceLevel && (
                                <span className="flex items-center text-primary text-sm">
                                  <Check className="w-4 h-4 mr-1" /> Selected
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {lifestyleFactors.experienceLevel.description}
                            </p>
                          </div>
                          {renderOptionCards(experienceLevelOptions, 'experienceLevel')}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
  
                {/* Experience Section */}
                {completedSections.experienceLevel && (
                  <div 
                    ref={workPatternsRef} 
                    id="sleep-patterns-section"
                    className={cn(
                      lifestyleFactors.workPatterns.containerClass,
                      "scroll-mt-20"
                    )}
                  >
                    <FormField
                      control={form.control}
                      name="workPatterns"
                      render={() => (
                        <FormItem>
                          <div className="mb-6">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                              {lifestyleFactors.workPatterns.title}
                              {completedSections.workPatterns && (
                                <span className="flex items-center text-primary text-sm">
                                  <Check className="w-4 h-4 mr-1" /> Selected
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {lifestyleFactors.workPatterns.description}
                            </p>
                          </div>
                          {renderOptionCards(workPatternsOptions, 'workPatterns')}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
  
              <div className="flex justify-between pt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  back
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={!completedSections.workPatterns}
                  front
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };
  

export default LifestyleFactors;