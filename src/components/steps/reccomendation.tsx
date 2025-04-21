import React from 'react';

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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const SubSection = ({
  title,
  content,
}: {
  title: string;
  content: string | string[];
}) => (
  <div>
    <h3 className="text-lg font-medium">{title}</h3>
    {Array.isArray(content) ? (
      <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
        {content.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground mt-2">{content}</p>
    )}
  </div>
);

const RecommendationDisplay: React.FC<{ data: RecommendationData }> = ({ data }) => {
  const {
    technical_recommendations,
    design_and_production,
    business_and_monetization,
    marketing_strategy,
  } = data.data[0];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <Section title="Technical Recommendations">
        <SubSection
          title="Printer Type"
          content={technical_recommendations.printer_type}
        />
        <SubSection
          title="Material Choices"
          content={technical_recommendations.material_choices}
        />
        <SubSection
          title="Workflow Tips"
          content={technical_recommendations.workflow_tips}
        />
      </Section>

      <Section title="Design & Production">
        <SubSection
          title="Item Fit for Market"
          content={design_and_production.item_fit_for_market}
        />
        <SubSection
          title="Production Strategy"
          content={design_and_production.production_strategy}
        />
        <SubSection
          title="Scalability Advice"
          content={design_and_production.scalability_advice}
        />
      </Section>

      <Section title="Business & Monetization">
        <SubSection
          title="Monetization Viability"
          content={business_and_monetization.monetization_viability}
        />
        <SubSection
          title="Pricing Tips"
          content={business_and_monetization.pricing_tips}
        />
        <SubSection
          title="Marketing Channels"
          content={business_and_monetization.marketing_channels}
        />
      </Section>

      <Section title="Marketing Strategy">
        <SubSection
          title="Positioning"
          content={marketing_strategy.positioning}
        />
        <SubSection
          title="Content Plan"
          content={marketing_strategy.content_plan}
        />
        <SubSection
          title="Social Media Channels"
          content={marketing_strategy.social_media_channels}
        />
        <SubSection
          title="Partnership Opportunities"
          content={marketing_strategy.partnership_opportunities}
        />
      </Section>
    </div>
  );
};

export default RecommendationDisplay;
