"use client";

import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
}

interface WeatherDisplayProps {
  className?: string;
}

export default function WeatherDisplay({ className = "" }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // 獲取當前日期（簡潔的土耳其語格式）
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short',
      day: 'numeric' 
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  // 獲取天氣資訊
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=ec9aef29858349d7a9f94946252906&q=Istanbul&aqi=no`
      );
      const data = await response.json();
      setWeather({
        location: data.location.name,
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      // 設置默認天氣資訊
      setWeather({
        location: 'Istanbul',
        temperature: 29,
        condition: 'Sunny'
      });
    }
  };

  // 組件載入時獲取天氣
  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <div className={`jeg_nav_col jeg_nav_left ${className}`}>
      <div className="item_wrap jeg_nav_alignleft flex items-center">
        {/* Weather Info */}
        {weather && (
          <>
            <div className="jeg_nav_item jeg_weather flex items-center space-x-1 text-sm">
              <i className="fa fa-thermometer-half"></i>
              <span>{weather.temperature}°C {weather.location}</span>
            </div>
            
            {/* Separator */}
            <div className="separator mx-4 h-4 w-px bg-gray-400"></div>
          </>
        )}
        
        {/* Date */}
        <div className="jeg_nav_item jeg_top_date text-sm">
          {getCurrentDate()}
        </div>
      </div>
    </div>
  );
} 