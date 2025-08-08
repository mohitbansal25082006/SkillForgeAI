"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, Video, FileText, Download, Send } from "lucide-react";
import { Roadmap } from "@/types/roadmap";
import { exportToPDF } from "@/utils/pdf-export";
import { createNotionPage } from "@/lib/notion";
import toast from "react-hot-toast";

interface RoadmapDisplayProps {
  roadmap: Roadmap;
}

export function RoadmapDisplay({ roadmap }: RoadmapDisplayProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF("roadmap-content", `${roadmap.title.replace(/\s+/g, '-')}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportNotion = async () => {
    setIsExporting(true);
    try {
      await createNotionPage(roadmap.title, roadmap);
      toast.success("Roadmap exported to Notion!");
    } catch (error) {
      console.error("Error exporting to Notion:", error);
      toast.error("Failed to export to Notion");
    } finally {
      setIsExporting(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "tutorial":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{roadmap.title}</h2>
        <p className="text-gray-600 mb-4">{roadmap.description}</p>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleExportPDF} 
            disabled={isExporting}
            variant="outline"
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleExportNotion} 
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <Send className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Export to Notion
              </>
            )}
          </Button>
        </div>
      </div>

      <div id="roadmap-content" className="space-y-6">
        {roadmap.weeks.map((week) => (
          <div key={week.week} className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                <Badge variant="outline" className="mr-2">
                  Week {week.week}
                </Badge>
                {week.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{week.description}</p>
            
            <div className="space-y-6">
              {week.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border-l-2 border-gray-200 pl-4">
                  <h4 className="font-semibold text-lg mb-2">{module.title}</h4>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  
                  {module.resources.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Resources:</h5>
                      <div className="space-y-2">
                        {module.resources.map((resource, resourceIndex) => (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            {getResourceIcon(resource.type)}
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {module.project && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium mb-1">Project Idea:</h5>
                      <p className="text-sm">{module.project}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}