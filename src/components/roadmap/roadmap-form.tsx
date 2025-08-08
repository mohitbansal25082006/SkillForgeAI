// components/roadmap/roadmap-form.tsx
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Roadmap, ExperienceLevel } from "@/types/roadmap";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  experience: z.enum(["beginner", "intermediate", "advanced"], {
    message: "Please select an experience level.",
  }),
  goal: z.string().min(10, {
    message: "Goal must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface RoadmapFormProps {
  onRoadmapGenerated: (roadmap: Roadmap) => void;
}

export function RoadmapForm({ onRoadmapGenerated }: RoadmapFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      experience: undefined as ExperienceLevel | undefined,
      goal: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      const data = await response.json();
      onRoadmapGenerated(data.roadmap as Roadmap);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Learning Roadmap</CardTitle>
        <CardDescription>
          Tell us what you want to learn and we&apos;ll generate a personalized learning path for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to learn?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React.js, Machine Learning, UI/UX Design" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the topic or skill you want to master.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (No prior experience)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Some experience)</SelectItem>
                      <SelectItem value="advanced">Advanced (Looking to specialize)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How much experience do you have with this topic?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Goal</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., I want to build a full-stack web application, I want to become a data scientist, I want to design mobile apps" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    What do you want to achieve after completing this roadmap?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Roadmap...
                </>
              ) : (
                "Generate My Roadmap"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}