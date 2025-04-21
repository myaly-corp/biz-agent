import { motion } from 'framer-motion';
import { z } from "zod";
import { useFormStep } from "@/hooks/use-form-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Feather, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const itemTypeSchema = z.object({
  itemType: z.enum(["Functional Items", "Decorative Items", "Hobby Accessories", "Gift & Novelty"], {
    required_error: "Please select your preferred routine complexity"
  })
});

type itemTypeForm = z.infer<typeof itemTypeSchema>;

export function ItemType({step}: {step: number}) {
  const { form, handleBack, handleNext } = useFormStep<itemTypeForm>({
    schema: itemTypeSchema,
    currentStep: step,
  });

  const itemTypeOptions = [
    {
      value: "Functional Items",
      label: "Functional Items",
      description: "Practical and utilitarian 3D printed products like phone stands, cable organizers, tools, or home improvement accessories.",
      gradient: "from-blue-50 to-blue-100",
  
      color: "blue"
    },
    {
      value: "Decorative Items",
      label: "Decorative Items",
      description: "Aesthetic pieces such as vases, sculptures, wall art, and home decor that focus on visual appeal rather than function.",
      icon: Clock,
      gradient: "from-purple-50 to-purple-100",
      color: "purple"
    },
     
    {
      value: "Hobby Accessories",
      label: "Hobby Accessories",
      description: "Items designed to complement popular hobbies like tabletop gaming, model building, or crafting—such as dice towers, terrain pieces, organizers, or custom tools.",
      icon: Sparkles,
      gradient: "from-pink-50 to-pink-100",
      color: "pink"
    },
    { 
      value: "Gift & Novelty", 
      label: "Gift & Novelty", 
      description: "Personalized gifts, seasonal items, or trending products that add a touch of luxury and novelty to the collection.",
      icon: Sparkles,
      gradient: "from-amber-50 to-amber-100",
      color: "amber"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  const stepVariants = {
    rest: { scale: 1 },
    hover: (i: number) => ({
      scale: [1, 1.2, 1],
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <Card className="border-none shadow-none max-w-4xl mx-auto">
      <CardHeader >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle >
          What types of products interest you most?
          </CardTitle>
          <CardDescription >
          Your product focus will determine your design needs and market strategy.  
          </CardDescription>
        </motion.div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-8">
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-8"
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      >
                        {itemTypeOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                          >
                            <div 
                              className={cn(
                                "group relative flex flex-col justify-between rounded-2xl p-8 cursor-pointer",
                                "bg-gradient-to-br backdrop-blur-lg transition-all duration-300",
                                "h-64 shadow-lg hover:shadow-xl",
                                field.value === option.value 
                                  ? `${option.gradient}`
                                  : "bg-muted/50 hover:bg-muted/70"
                              )}
                              onClick={() => field.onChange(option.value)}
                            >
                              <div className="flex items-start justify-between">
                            
                                
                                <RadioGroupItem 
                                  value={option.value}
                                  className={cn(
                                    "absolute top-4 right-4 w-6 h-6 border-2",
                                    field.value === option.value 
                                      ? "border-white bg-primary/20"
                                      : "border-muted-foreground/30"
                                  )}
                                />
                              </div>

                              <div className="space-y-3">
                                <h3 className="text-2xl font-bold">{option.label}</h3>
                                <p className="text-sm">{option.description}</p>
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
                back
              >
                Back
              </Button>
              <Button 
                type="submit"
                front
              >
                Continue
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ItemType;