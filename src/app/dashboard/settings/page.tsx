"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Bell, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your workspace preferences and systems.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Shop Profile</CardTitle>
            <CardDescription>Update your general business details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Shop Name</label>
                <Input defaultValue="PaintFlow Admin" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Primary Contact Email</label>
                <Input defaultValue="contact@paintflow.co" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Physical Address</label>
              <Input defaultValue="100 Luxury Avenue, Suite A, New York, NY" />
            </div>
            <Button className="gap-2 bg-primary text-white hover:bg-primary/90 rounded-2xl h-11 px-6">
              <Save size={16} />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Configurations Card */}
        <div className="space-y-6">
          {/* Display Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Preferences</CardTitle>
              <CardDescription>Manage user experience variables.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Display Theme</p>
                  <p className="text-xs text-muted-foreground">Toggle Light/Dark presentation</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-xl"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Integration Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Security</CardTitle>
              <CardDescription>Manage workspace credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Shield size={14} className="text-accent" />
                  Supabase Backend Status
                </span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                  Connected
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
