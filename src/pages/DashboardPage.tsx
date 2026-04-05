import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClimate } from "@/hooks/useClimate";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ClimateOverview from "@/components/dashboard/ClimateOverview";
import ProfileForm from "@/components/dashboard/ProfileForm";
import RainfallChart from "@/components/dashboard/RainfallChart";
import WeatherTrends from "@/components/dashboard/WeatherTrends";
import DisruptionPredictor from "@/components/dashboard/DisruptionPredictor";
import { Skeleton } from "@/components/ui/skeleton";

import type { Region } from "@/lib/types";

type Tab = "overview" | "profile" | "climate" | "predictions";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <TabContent tab={activeTab} region={user.region} />
    </DashboardLayout>
  );
}

function TabContent({ tab, region }: { tab: Tab; region: Region }) {
  const { data, loading } = useClimate(region);

  if (loading || !data) {
    return <LoadingState />;
  }

  switch (tab) {
    case "overview":
      return <ClimateOverview data={data} />;
    case "profile":
      return <ProfileForm />;
    case "climate":
      return (
        <div className="space-y-6">
          <RainfallChart data={data} />
          <WeatherTrends data={data} />
        </div>
      );
    case "predictions":
      return <DisruptionPredictor data={data} />;
    default:
      return <ClimateOverview data={data} />;
  }
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80" />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    </div>
  );
}
