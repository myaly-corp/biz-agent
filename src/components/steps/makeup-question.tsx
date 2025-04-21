import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useFormStep } from '@/hooks/use-form-step';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import {  makeupTypeOptions, monetizedOptions } from '@/lib/lifestyle-options';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

const makeupQuestionSchema = z.object({
  monetized: z.boolean(),
  monetizationLevel: z.string().optional(),
});

const MakeupQuestion = ({ step }: { step: number }) => {
  const { form, handleBack, handleNext } = useFormStep({
    schema: makeupQuestionSchema,
    currentStep: step,
  });

  const handleSectionComplete = (section: keyof typeof completedSections, value: any) => {
    setCompletedSections(prev => ({
      ...prev,
      [section]: true
    }));
    form.setValue(section, value);

    // Auto-scroll to next section after a brief delay
    requestAnimationFrame(() => {
      if (section === 'monetized' && value === true && monetizationLevelRef.current) {
        smoothScrollToSection(monetizationLevelRef);
      }
    });
  };
  const handlemonetizationLevelelect = (type: string) => {
    setSelectedMakeupType(type);
    form.setValue('monetizationLevel', type); 
    handleSectionComplete('monetizationLevel', type);
  };

  const [completedSections, setCompletedSections] = useState({
    monetized: false,
    monetizationLevel: false,
  });

  const [selectedMakeupType, setSelectedMakeupType] = useState<string | null>(null);


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };


  // Create refs for each section
  // const monetizedRef = useRef<HTMLDivElement>(null);
  const monetizationLevelRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function
  const smoothScrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  return (
    <Card className="border-none shadow-none max-w-4xl mx-auto">
      <CardHeader className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle>Growth ambitions?</CardTitle>
          <CardDescription className="text-lg mt-4 max-w-2xl mx-auto">
            Your growth goals will influence your investment and scaling strategy.
          </CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
            {/* Wears Makeup Section */}
            <FormField
              control={form.control}
              name="monetized"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => handleSectionComplete('monetized', value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {monetizedOptions.map((option) => (
                          <motion.div
                            key={String(option.value)}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                            onClick={() => handleSectionComplete('monetized', option.value)}
                          >
                            <div
                              className={cn(
                                "group relative flex items-center rounded-2xl p-6 cursor-pointer",
                                "bg-gradient-to-br backdrop-blur-lg transition-all duration-300 h-32",
                                field.value === option.value
                                  ? `${option.bgColor} shadow-xl ring-2 ring-primary`
                                  : "bg-muted/50 hover:bg-muted/70"
                              )}
                            >
                              <div className="flex items-center gap-4 w-full">
                                <motion.div
                                  className={cn(
                                    "p-3 text-4xl rounded-xl "
                                  )}
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {option.icon}
                                </motion.div>

                                <div className="flex-1">
                                  <Label className="text-lg font-medium cursor-pointer">{option.label}</Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {option.description}
                                  </p>
                                </div>

                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                    field.value === option.value
                                      ? "border-white bg-primary/20"
                                      : "border-muted-foreground/30"
                                  )}
                                >
                                  {field.value === option.value && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2 h-2 bg-white rounded-full"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-center text-red-400 font-medium" />
                </FormItem>
              )}
            />

            <AnimatePresence>
              {completedSections.monetized && form.getValues('monetized') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <CardTitle className="text-2xl">Select Makeup Types</CardTitle>

                  <FormField
                    control={form.control}
                    name="monetizationLevel"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => handlemonetizationLevelelect(value)}
                            defaultValue={selectedMakeupType || undefined}
                          >
                            <motion.div
                              variants={containerVariants}
                              initial="hidden"
                              animate="show"
                              className="grid grid-cols-2 md:grid-cols-4 gap-4"
                            >
                              {makeupTypeOptions.map((option) => (
                                <motion.div
                                  key={option.value}
                                  variants={itemVariants}
                                  whileHover={{ scale: 1.05 }}
                                  className="relative"
                                >
                                  <div
                                    className={cn(
                                      "group aspect-square flex flex-col items-center justify-center rounded-xl p-4 cursor-pointer",
                                      "border-2 transition-all duration-300 text-center",
                                      selectedMakeupType === option.value
                                        ? "bg-primary/10 border-primary shadow-md"
                                        : "bg-muted/50 border-muted hover:border-primary/30"
                                    )}
                                    onClick={() => handlemonetizationLevelelect(option.value)}
                                  >
                                    <div className="text-3xl mb-2">{option.icon}</div>
                                    <Label className="text-sm font-medium">
                                      {option.label}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-center text-red-400 font-medium" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>


            <motion.div
              className="flex justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                back              >
                Back
              </Button>
              <Button
                type="submit"
                front
                disabled={
                  !completedSections.monetized ||
                  (form.getValues('monetized') &&
                    (!completedSections.monetizationLevel ))
                }
              >
                Continue
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MakeupQuestion;