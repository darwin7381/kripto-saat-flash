"use client";

import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  iconUrl: string;
  conditionCode: number;
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

  // 根據天氣狀況代碼獲取FontAwesome圖標 (使用更好看的圖標)
  const getWeatherIcon = (conditionCode: number): string => {
    // WeatherAPI condition codes mapping to better FontAwesome 4.7.0 icons
    if (conditionCode === 1000) return 'fa-certificate'; // Sunny - 用放射狀圖標代表太陽
    if ([1003, 1006, 1009].includes(conditionCode)) return 'fa-cloud'; // Cloudy variations
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(conditionCode)) return 'fa-tint'; // Rainy - 水滴更直觀
    if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(conditionCode)) return 'fa-asterisk'; // Snowy - 雪花用星號
    if ([1087, 1273, 1276, 1279, 1282].includes(conditionCode)) return 'fa-bolt'; // Thunderstorm - 閃電
    if ([1135, 1147].includes(conditionCode)) return 'fa-adjust'; // Mist/Fog - 半圓表示能見度低
    
    // Default for unknown conditions
    return 'fa-cloud';
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
        condition: data.current.condition.text,
        iconUrl: data.current.condition.icon,
        conditionCode: data.current.condition.code
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      // 設置默認天氣資訊
      setWeather({
        location: 'Istanbul',
        temperature: 29,
        condition: 'Sunny',
        iconUrl: '',
        conditionCode: 1000
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
              <i className={`fa ${getWeatherIcon(weather.conditionCode)}`} title={`Weather: ${weather.condition}, Code: ${weather.conditionCode}`}></i>
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