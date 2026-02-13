'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DeviceContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

export function useDevice() {
  return useContext(DeviceContext);
}

interface ResponsiveContainerProps {
  children: ReactNode;
}

export default function ResponsiveContainer({ children }: ResponsiveContainerProps) {
  const [device, setDevice] = useState<DeviceContextType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  return (
    <DeviceContext.Provider value={device}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </DeviceContext.Provider>
  );
}
