import { z } from "zod"
import { useFormStep } from "@/hooks/use-form-step"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles } from 'lucide-react'
import { motion } from "framer-motion"

const locationTypeSchema = z.object({
  locationType: z.enum([
    "Major Urban Center", 
    "Mid Size City", 
    "Suburban Area", 
    "Rural/Remote", 
  ], {
    required_error: "Please select your location "
  })
})

type LocationTypeForm = z.infer<typeof locationTypeSchema>

export function LocationType({step}: {step: number}) {
  const { form, handleBack, handleNext } = useFormStep<LocationTypeForm>({
    schema: locationTypeSchema,
    currentStep: step,
  })

  const locationTypeOptions = [
    {
      value: "Major Urban Center",
      label: "Major Urban Center",
      description: "Large city with dense population",
      locationProperty: "High foot traffic, access to maker spaces, and better local demand",
      shippingAccessibility: [
        "Same day courier services",
        "High demand for local pickup",
        "Reliable shipping infrastructure"
      ],
      bgColor: "bg-blue-50",
      imageUrl: "/location/city-skyline-landmarks-illustration_23-2148810179.jpg"
    },
    {
      value: "Mid Size City",
      label: "Mid-Size City",
      description: "A balanced environment with moderate population density and growing demand",
      locationProperty: "Accessible resources, potential for loyal local customer base, moderate competition",
      shippingAccessibility: [
        "Standard national shipping with 1-3 day delivery",
        "Local delivery and pickup options available",
        "Limited access to logistics hubs"
      ],

      bgColor: "bg-pink-50",
      imageUrl: "/location/mid-size-city.jpg"
    },
    {
      value: "Suburban Area",
      label: "Suburban Area",
      description: "Residential neighborhoods outside major cities with moderate access to amenities",
      locationProperty: "Tight-knit community, lower overhead costs, potential for word-of-mouth growth",
      shippingAccessibility: [
        "Reliable standard shipping services",
        "Local pickup options via community hubs",
        "Occasional delays for specialty or international shipping"
      ],
      bgColor: "bg-purple-50",
      imageUrl: "/location/sub-urban.jpg"
    },
    {
      value: "Rural/Remote",
      label: "Rural/Remote",
      description: "Low population density areas with limited infrastructure and access to markets",
      locationProperty: "High privacy, low competition, stronger reliance on digital marketing and shipping",
      shippingAccessibility: [
        "Limited courier options, slower delivery times",
        "Higher shipping costs for some regions",
        "Pickup options may be impractical or unavailable"
      ],
      bgColor: "bg-orange-50",
      imageUrl: "/location/countryside-landscape_23-2148671533.jpg"
    }
  ]

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardTitle >
            Your Location
          </CardTitle>
          <CardDescription>
          Your location influences the types of products you can sell and your distribution strategy.
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                    >
                      {locationTypeOptions.map((option, index) => (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div 
                            className={`
                              relative rounded-xl border overflow-hidden
                              transition-all duration-300 ease-in-out
                              hover:scale-[1.02] hover:shadow-lg cursor-pointer
                              ${field.value === option.value ? 
                                'ring-2 ring-primary shadow-md' : 
                                'hover:bg-accent/50'}
                            `}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="absolute top-4 right-4 z-10">
                              <RadioGroupItem 
                                value={option.value} 
                                id={option.value} 
                                className={`
                                  ${field.value === option.value ? 
                                    'bg-primary text-primary-foreground' : 
                                    'bg-transparent'}
                                `}
                              />
                            </div>
                            
                            {/* Image Section */}
                            <motion.div 
                              className="w-full h-48 relative"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img 
                                src={option.imageUrl} 
                                alt={`${option.label} skincare`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="text-xl font-bold">{option.label}</h3>
                                <p className="text-sm opacity-90">{option.description}</p>
                              </div>
                            </motion.div>

                            {/* Content Section */}
                            <motion.div 
                              className="p-4 space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div>
                                <Label className="text-sm font-medium">Location Property</Label>
                                <p className="text-sm text-muted-foreground">{option.locationProperty}</p>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Shipping Accessibility</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {option.shippingAccessibility.map((ingredient, idx) => (
                                    <motion.span 
                                      key={idx}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.3 + (idx * 0.1) }}
                                      className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                                    >
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      {ingredient}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div
              className="flex justify-between pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
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
              >
                Continue
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LocationType