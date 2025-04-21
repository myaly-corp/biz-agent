import { motion } from 'framer-motion';
import { z } from "zod";
import { useFormStep } from "@/hooks/use-form-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, CreditCard, Diamond, DollarSign, ShoppingBagIcon } from 'lucide-react';

const budgetAllocationSchema = z.object({
  marketType: z.enum(["Consumer Products", "Hobbyist Market", "Business Solutions", "Custom/Personalized"], {
    required_error: "Please Select Your Target Market"
  })
});

type BudgetAllocationForm = z.infer<typeof budgetAllocationSchema>;

export function BudgetAllocation({ step }: { step: number }) {
  const { form, handleBack, handleNext } = useFormStep<BudgetAllocationForm>({
    schema: budgetAllocationSchema,
    currentStep: step,
  });

  const budgetOptions = [
    {
      value: "Consumer Products",
      label: "Consumer Products",
      description: "Everyday items purchased by individuals for personal use",
      marketProperty: ["High competition", "Broad audience", "Relies on uniqueness and branding"],
      gradient: "from-emerald-50 to-emerald-100",
   
    },
    {
      value: "Hobbyist Market",
      label: "Hobbyist Market",
      description: "Specialized products for enthusiasts and makers",
      marketProperty: ["Moderate competition", "Loyal and engaged customers", "High-quality & unique items are expected"],
      gradient: "from-violet-50 to-violet-100",
   
    },
    {
      value: "Business Solutions",
      label: "Business Solutions",
      description: "Products designed to solve operational or productivity problems for businesses",
      marketProperty: ["High-value niche", "Potential for bulk orders and long-term contracts"],
      gradient: "from-rose-50 to-rose-100",
      
    },
    {
      value: "Custom/Personalized",
      label: "Custom/Personalized",
      description: "Products tailored to individual customer preferences or needs",
      marketProperty: ["High customer satisfaction potential with premium pricing.", "Often built around gifting and personalization."],
      gradient: "from-sky-50 to-sky-100 ",
   
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="text-left md:text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardTitle >
            What markets interests you?
          </CardTitle>
          <CardDescription >
            Choosing the right target market will help focus your product strategy.
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <FormField
              control={form.control}
              name="marketType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-4"
                    >
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1  lg:grid-cols-2 gap-4"
                      >
                        {budgetOptions.map((option) => (
                          <motion.div
                            key={option.value}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <div
                              className={`
                                relative flex items-center space-x-4 rounded-lg border p-6
                                cursor-pointer bg-gradient-to-r ${option.gradient}
                                transition-all duration-300
                                group
                                ${field.value === option.value
                                  ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                                  : "hover:shadow-md hover:border-primary/50"}
                              `}
                              onClick={() => field.onChange(option.value)}
                            >
                              <RadioGroupItem
                                value={option.value}
                                id={option.value}
                                className="transition-transform duration-300 group-hover:scale-110"
                              />

                              <Label htmlFor={option.value} className="flex flex-col cursor-pointer flex-1">
                                <div className="flex justify-between items-center w-full">
                                  <span className="font-semibold text-lg">{option.label}</span>
                             
                                </div>
                                <span className="text-muted-foreground mt-1">
                                  {option.description}
                                </span>
                                <div className='flex flex-col items-start'>
                                  {option.marketProperty.map((effect: string, index: number) => (
                                    <div className="mt-2 w-fit px-2 rounded-full bg-primary/10 text-xs font-medium text-primary">
                                    <motion.li
                                      key={index}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      
                                      >
                                      <span className="w-1 h-1 rounded-full bg-primary" />
                                      {effect}
                                    </motion.li>
                                </div>
                                  ))}
                                  </div>
                              </Label>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              className="flex justify-between pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
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
                front              >
                Continue
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BudgetAllocation;