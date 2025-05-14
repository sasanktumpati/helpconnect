"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { COLORS } from "@/lib/utils/color-utils"

Chart.register(...registerables)

export function LineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Sample data - in a real app, this would come from your API
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    const campaignData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 5))
    const helpRequestData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 3))
    const driveData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 2))

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Campaigns",
            data: campaignData,
            borderColor: COLORS.primary,
            backgroundColor: "rgba(30, 64, 175, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Help Requests",
            data: helpRequestData,
            borderColor: "#16A34A",
            backgroundColor: "rgba(22, 163, 74, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "Community Drives",
            data: driveData,
            borderColor: "#EA580C",
            backgroundColor: "rgba(234, 88, 12, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} />
}

export function BarChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Sample data - in a real app, this would come from your API
    const campaigns = ["Flood Relief", "Medical Supplies", "Food Drive", "Education Fund", "Shelter Project"]

    const targetData = [10000, 5000, 3000, 8000, 12000]
    const raisedData = [8000, 4500, 3000, 2000, 6000]

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: campaigns,
        datasets: [
          {
            label: "Target",
            data: targetData,
            backgroundColor: "rgba(30, 64, 175, 0.2)",
            borderColor: "rgba(30, 64, 175, 1)",
            borderWidth: 1,
          },
          {
            label: "Raised",
            data: raisedData,
            backgroundColor: "rgba(22, 163, 74, 0.6)",
            borderColor: "rgba(22, 163, 74, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} />
}

export function PieChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Sample data - in a real app, this would come from your API
    const data = [45, 25, 15, 10, 5]

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    chartInstance.current = new Chart(chartRef.current, {
      type: "pie",
      data: {
        labels: ["Monetary", "Goods", "Blood", "Volunteer", "Disaster Relief"],
        datasets: [
          {
            data,
            backgroundColor: [
              COLORS.primary, // Primary
              "#16A34A", // Secondary
              "#EA580C", // Accent
              "#6B7280", // Gray
              "#EF4444", // Red
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} />
}
