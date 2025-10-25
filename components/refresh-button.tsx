"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function RefreshButton() {
  return (
    <Button 
      variant="outline" 
      className="w-full sm:w-auto h-12 px-6"
      onClick={() => window.location.reload()}
    >
      <Globe className="w-4 h-4 mr-2" />
      刷新状态
    </Button>
  )
}
