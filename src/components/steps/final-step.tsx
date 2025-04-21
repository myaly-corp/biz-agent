import { useFormStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormStep } from "@/hooks/use-form-step"
import { z } from "zod"
import axios, { isCancel, AxiosError } from 'axios';
import LeadForm from "../lead-form"
import SkincareSummary from "../skincare-summary"
import DeveloperProfile from "../developer-profile"
import { SkincareSummarySheet } from "../skincare-sheet"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/clerk-react"
import RecommendationDisplay from "./Reccomendation"




function FinalStep({ step }: { step: number }) {

  type RecommendationData = {
    data: [
      {
        technical_recommendations: {
          printer_type: string;
          material_choices: string[];
          workflow_tips: string[];
        };
        design_and_production: {
          item_fit_for_market: string;
          production_strategy: string[];
          scalability_advice: string[];
        };
        business_and_monetization: {
          monetization_viability: string;
          pricing_tips: string[];
          marketing_channels: string[];
        };
        marketing_strategy: {
          positioning: string;
          content_plan: string[];
          social_media_channels: string[];
          partnership_opportunities: string[];
        };
      }
    ];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  const { formData, resetForm, setCurrentStep } = useFormStore()
  const { user } = useUser();

  function updateDB() {
    if (!user?.id) {
      console.error('User ID is undefined. Cannot proceed.');
      alert('User is not authenticated. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setHasProcessed(true); // Hide Process button

    axios
      .post('https://myalyai.app.n8n.cloud/webhook/afead81e-6f7c-46d7-8734-a08551e7747f', {
        user_id: user.id,
        formData: formData,
      })
      .then((response) => {
        console.log('Response from n8n:', response.data);
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error('Error from n8n webhook:', error);
        alert('Something went wrong while processing your data.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const { handleBack } = useFormStep({
    currentStep: step,
    schema: z.object({}),

  })



  const handleReset = () => {
    resetForm()
    setCurrentStep(1)
  }


  return (
    <div className="space-y-6 p-4">
      <Card className="border-none shadow-none">
        {!hasProcessed && (
        <CardHeader>
          <CardTitle>Review</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please review all the information you've provided. You can start over.
          </CardDescription>
        </CardHeader>
        )}
        <CardContent className="p-0 flex flex-col items-center justify-center  ">
          {!hasProcessed && (
            <div className="w-3/4 overflow-auto border rounded-lg mb-6">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 font-medium text-gray-700">
                  <tr>
                    <th className="p-3 border">Field</th>
                    <th className="p-3 border">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData).map(([key, value]) => (
                    <tr key={key} className="border-t">
                      <td className="p-3 capitalize border font-semibold">{key}</td>
                      <td className="p-3 border">{typeof value === 'boolean' ? value.toString() : value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!hasProcessed && (
            <Button className="w-1/6  m-2" onClick={updateDB} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Process'}
            </Button>
          )}
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-lg font-medium animate-pulse">Processing...</p>
            </div>
          ) : (
            responseData && (
              // <SkincareSummary data={responseData}></SkincareSummary>
              <RecommendationDisplay data={responseData} />


            )
          )}



        </CardContent>
        <CardFooter className="flex justify-between">
          <Button back variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleReset}>Start Over</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FinalStep