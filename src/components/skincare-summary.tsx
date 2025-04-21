import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  User, Sun, Cloud, Clock, DollarSign, Heart, 
  Droplet, Target, AlertTriangle, Calendar,
  Camera, Activity, Mail, Moon, Leaf, Phone
} from 'lucide-react';
import { SkincareFormData } from '@/types/global';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};



interface CardWrapperProps {
  children: React.ReactNode;
  gradient: string;
  icon: React.ReactNode;
  title: string;
}

const CardWrapper = ({ children, gradient, icon, title }: CardWrapperProps) => (
  <motion.div
    variants={cardVariants}
    whileHover="hover"
    className="transform-gpu"
  >
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl p-0">
      <CardHeader className={`${gradient} relative overflow-hidden`}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r opacity-50"
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <CardTitle className="flex items-center gap-2 relative z-10">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
          <span className="text-lg">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </CardContent>
    </Card>
  </motion.div>
);

// @ts-ignore
const getBadgeColor = (type) => {
  const colors = {
    'DRY': 'bg-yellow-100 text-yellow-800',
    'OILY': 'bg-green-100 text-green-800',
    'COMBINATION': 'bg-blue-100 text-blue-800',
    'SENSITIVE': 'bg-red-100 text-red-800',
    'NORMAL': 'bg-purple-100 text-purple-800'
  };
  // @ts-ignore
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const StressLevelBar = ({ level }: { level: number }) => {
  // Calculate color based on stress level (1-10)
  const getStressColor = (level: number) => {
    if (level <= 3) return 'bg-green-400'; // BEGINNER stress
    if (level <= 6) return 'bg-yellow-400'; // Medium stress  
    return 'bg-red-400'; // High stress
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${getStressColor(level)} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${(level / 10) * 100}%` }}
      />
    </div>
  );
};

// const BudgetDisplay = ({ amount }: { amount: string }) => (
//   <div className="flex items-center gap-2">
//     <span className="text-2xl font-bold text-green-600">${amount}</span>
//     <div className="w-full bg-gray-200 rounded-full h-2.5">
//       <div 
//         className="bg-green-500 h-2.5 rounded-full" 
//         style={{ width: `${(amount / 200) * 100}%` }}
//       />
//     </div>
//   </div>
// );

const SkincareSummary = ({ data }: { data: SkincareFormData }) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CardWrapper
        gradient="from-purple-50 to-pink-50"
        icon={<User className="h-5 w-5 text-purple-500" />}
        title="Basic Skin Profile"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={cardVariants}
        >
          <motion.div 
            className="space-y-3"
            variants={cardVariants}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm text-gray-500">Skin Type</span>
              <motion.div 
                className={`inline-block px-3 py-1 rounded-full mt-1 ${getBadgeColor(data.skinType)}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {data.skinType}
              </motion.div>
            </motion.div>
            <div>
              <span className="text-sm text-gray-500">Age Group</span>
              <p className="font-medium">{data.locationType === "Major Urban Center" ? "20s" : data.locationType === "Mid Size City" ? "30s" : data.locationType === "Suburban Area" ? "40s" : data.locationType === "Rural/Remote" ? "50s" : "60s+"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Skin Goals</span>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full ${getBadgeColor(data.skinGoal)}`}>
                  {data.skinGoal}
                </span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </CardWrapper>

      <CardWrapper
        gradient="from-blue-50 to-green-50"
        icon={<Sun className="h-5 w-5 text-orange-500" />}
        title="Environmental Factors"
      >
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
          variants={cardVariants}
        >
          <div>
            <span className="text-sm text-gray-500">Daily Sun Exposure</span>
            <div className="flex items-center gap-2 mt-1">
              <Sun className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{data.budgetLevels === "300-500" ? "300-500" : data.budgetLevels === "500-1500" ? "500-1500" : data.budgetLevels === "1500-5000" ? "1500-5000" : "5000+"}</span>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Climate Type</span>
            <div className="flex items-center gap-2 mt-1">
              <Cloud className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{data.climateType === "ARID" ? "Arid" : data.climateType === "HUMID" ? "Humid" : "Urban"}</span>
            </div>
          </div>
        </motion.div>
      </CardWrapper>

      <CardWrapper
        gradient="from-green-50 to-blue-50"
        icon={<Activity className="h-5 w-5 text-green-500" />}
        title="Lifestyle & Health"
      >
        <motion.div 
          className="space-y-6 pt-4"
          variants={cardVariants}
        >
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Stress Level</span>
              <span className="text-sm font-medium">{ 
              data.experienceLevel === "BEGINNER" ? "BEGINNER" : 
              data.experienceLevel === "BASIC" ? "BASIC" : 
              data.experienceLevel === "INTERMEDIATE" ? "INTERMEDIATE" : 
              data.experienceLevel === "ADVANCED" }
              </span>
            </div>
            <StressLevelBar level={data.experienceLevel === "BEGINNER" ? 1 : data.experienceLevel === "BASIC" ? 2 : data.experienceLevel === "INTERMEDIATE" ? 5 : data.experienceLevel === "ADVANCED" ? 8 : 10} />
          </div>
          <div className="flex items-center gap-4">
            <Moon className="h-5 w-5 text-blue-500" />
            <div>
              <span className="text-sm text-gray-500">Sleep Duration</span>
              <p className="font-medium">{data.workPatterns === "LESS_THAN_6_HRS" ? "Less than 6 hours" : data.workPatterns === "6_TO_8_HRS" ? "6-8 hours" : "More than 8 hours"}</p>
            </div>
          </div>
        </motion.div>
      </CardWrapper>

      <CardWrapper
        gradient="from-green-50 to-teal-50"
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
        title="Budget & Preferences"
      >
        <motion.div 
          className="space-y-4 pt-4"
          variants={cardVariants}
        >
          <div>
            <span className="text-sm text-gray-500">Monthly Budget</span>
            {/* <BudgetDisplay amount={data.marketType === "Consumer Products" ? "Consumer Products" :
               data.marketType === "Hobbyist Market" ? "Hobbyist Market" : 
               data.marketType === "Business Solutions" ? "Business Solutions" : 
               data.marketType === "Custom/Personalized" ? "Custom/Personalized" : "Custom/Personalized"} /> */}
          </div>
          {data.hasPreferencesEthical && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Ethical Preferences</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.ethicalPreferences?.map((pref) => (
                  <span key={pref} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                    {pref === "CRUELTY_FREE" ? "Cruelty Free" : pref === "VEGAN" ? "Vegan" : pref === "SUSTAINABLE_PACKAGING" ? "Sustainable Packaging" : pref === "REEF_SAFE" ? "Reef Safe" : pref === "PALM_OIL_FREE" ? "Palm Oil Free" : pref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </CardWrapper>

      
    </motion.div>
  );
};

export default SkincareSummary;