
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
    </div>
  );
};

export default LoadingSpinner;
