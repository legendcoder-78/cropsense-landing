import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { REGIONS, INDIAN_CROPS, type Region } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [region, setRegion] = useState<Region>(user?.region || "karnataka");
  const [crops, setCrops] = useState<string[]>(user?.crops || []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setRegion(user.region);
      setCrops(user.crops || []);
    }
  }, [user]);

  const toggleCrop = (crop: string) => {
    setCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSave = () => {
    updateProfile({ region, crops });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your location and crop preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farm Location</CardTitle>
          <CardDescription>Select the region where your farm is located</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crops Grown</CardTitle>
          <CardDescription>Select all crops you currently cultivate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INDIAN_CROPS.map((crop) => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={`crop-${crop}`}
                  checked={crops.includes(crop)}
                  onCheckedChange={() => toggleCrop(crop)}
                />
                <Label
                  htmlFor={`crop-${crop}`}
                  className="text-sm cursor-pointer select-none"
                >
                  {crop}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
        {saved && (
          <p className="text-sm text-primary animate-fade-up">
            Profile updated successfully
          </p>
        )}
      </div>
    </div>
  );
}
