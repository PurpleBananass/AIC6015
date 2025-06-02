import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ResourceUsageChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Mock data for the past 7 days
  const generateMockData = () => {
    const days = 7;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    // Generate random usage data with an upward trend
    const cpuUsage = Array.from({ length: days }, (_, i) => 
      Math.round(50 + (i * 5) + (Math.random() * 20 - 10))
    );
    
    const memoryUsage = Array.from({ length: days }, (_, i) => 
      Math.round(60 + (i * 4) + (Math.random() * 15 - 7.5))
    );
    
    const gpuUtilization = Array.from({ length: days }, (_, i) => 
      Math.round(70 + (i * 3) + (Math.random() * 10 - 5))
    );

    return { labels, cpuUsage, memoryUsage, gpuUtilization };
  };

  const { labels, cpuUsage, memoryUsage, gpuUtilization } = generateMockData();

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'CPU Usage (%)',
                data: cpuUsage,
                borderColor: '#3B82F6', // blue
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Memory Usage (%)',
                data: memoryUsage,
                borderColor: '#10B981', // green
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'GPU Utilization (%)',
                data: gpuUtilization,
                borderColor: '#8B5CF6', // purple
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  boxWidth: 8,
                },
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                titleColor: '#1F2937',
                bodyColor: '#4B5563',
                borderColor: 'rgba(229, 231, 235, 1)',
                borderWidth: 1,
                padding: 10,
                boxPadding: 5,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y}%`;
                  }
                }
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  stepSize: 20,
                  callback: function(value) {
                    return value + '%';
                  }
                },
                grid: {
                  display: true,
                  drawBorder: false,
                },
              },
              x: {
                grid: {
                  display: false,
                  drawBorder: false,
                },
              },
            },
          },
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, cpuUsage, memoryUsage, gpuUtilization]);

  return (
    <div className="h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ResourceUsageChart;