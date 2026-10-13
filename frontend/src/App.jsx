import { BrowserRouter, Routes, Route } from "react-router-dom";

import Admin from "./pages/Admin";
import Devices from "./pages/Devices";
import { useLayoutMode } from "./hooks/useLayoutMode";
import MobileDashboard from "./mobile/MobileDashboard";
import MobileBathroomDetail from "./mobile/MobileBathroomDetail";
import MobileDeviceManagement from "./mobile/MobileDeviceManagement";
import LandscapeDashboard from "./dashboard/LandscapeDashboard";

// Three route trees, picked by useLayoutMode():
//   "mobile"    -- full-screen portrait phone app (unchanged).
//   "landscape" -- landscape phones + tablets: the new dashboard.
//   "desktop"   -- mouse/trackpad browsers: the original desktop
//                  dashboard, completely untouched.
export default function App() {
  const layoutMode = useLayoutMode();

  return (
    <BrowserRouter>
      {layoutMode === "mobile" && (
        <Routes>
          <Route path="/" element={<MobileDashboard />} />
          <Route path="/bathroom/:id" element={<MobileBathroomDetail />} />
          <Route path="/devices" element={<MobileDeviceManagement />} />
        </Routes>
      )}

      {layoutMode === "landscape" && (
        <Routes>
          <Route path="/" element={<LandscapeDashboard />} />
          <Route path="/devices" element={<Devices />} />
        </Routes>
      )}

      {layoutMode === "desktop" && (
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/devices" element={<Devices />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
