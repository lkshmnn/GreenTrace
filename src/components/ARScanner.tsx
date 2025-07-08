import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, Scan, Leaf, Zap, Recycle, AlertTriangle, CheckCircle, Sparkles, RotateCcw, Eye } from 'lucide-react';

interface ProductAnalysis {
  name: string;
  ecoScore: number;
  grade: string;
  carbonFootprint: number;
  recommendations: string[];
  sustainabilityFactors: {
    packaging: number;
    transport: number;
    production: number;
    endOfLife: number;
  };
}

type ScanState = 'idle' | 'uploading' | 'analyzing' | 'complete';

export function ARScanner() {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanState('uploading');
      setProgress(0);
      
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(uploadInterval);
            setScanState('analyzing');
            // Start analysis simulation
            setTimeout(() => {
              analyzeProduct();
            }, 500);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeProduct = () => {
    // Simulate AI analysis with progress
    let analysisProgress = 0;
    const analysisInterval = setInterval(() => {
      analysisProgress += 15;
      setProgress(analysisProgress);
      
      if (analysisProgress >= 100) {
        clearInterval(analysisInterval);
        setScanState('complete');
        
        // Mock analysis result
        const mockProduct: ProductAnalysis = {
          name: "Organic Cotton T-Shirt",
          ecoScore: 82,
          grade: "A",
          carbonFootprint: 4.2,
          recommendations: [
            "Choose local brands to reduce transport emissions",
            "Look for recycled packaging options",
            "Consider organic cotton alternatives",
            "Check for fair trade certifications"
          ],
          sustainabilityFactors: {
            packaging: 75,
            transport: 60,
            production: 85,
            endOfLife: 90
          }
        };
        setAnalysis(mockProduct);
      }
    }, 300);
  };

  const resetScanner = () => {
    setScanState('idle');
    setSelectedImage(null);
    setAnalysis(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'F': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
            <Scan className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AR Product Scanner</h1>
            <p className="text-gray-600 dark:text-gray-300">Instant sustainability insights for any product</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Interface */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2 h-5 w-5 text-emerald-500" />
              Product Scanner
            </CardTitle>
            <CardDescription>Upload a product image for AI-powered sustainability analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                scanState === 'idle' 
                  ? 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                  : 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
              }`}
              onClick={() => scanState === 'idle' && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={scanState !== 'idle'}
              />
              
              {scanState === 'idle' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Upload Product Image
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Click to select or drag and drop an image
                    </p>
                  </div>
                </div>
              )}

              {(scanState === 'uploading' || scanState === 'analyzing') && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                    {scanState === 'uploading' ? (
                      <Upload className="h-8 w-8 text-white" />
                    ) : (
                      <Sparkles className="h-8 w-8 text-white animate-spin" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {scanState === 'uploading' ? 'Uploading Image...' : 'Analyzing Product...'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {scanState === 'uploading' 
                        ? 'Preparing your image for analysis' 
                        : 'AI is processing sustainability data'
                      }
                    </p>
                    <Progress value={progress} className="w-full max-w-xs mx-auto" />
                  </div>
                </div>
              )}

              {scanState === 'complete' && selectedImage && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      Analysis Complete!
                    </p>
                    <img 
                      src={selectedImage} 
                      alt="Uploaded product" 
                      className="max-w-48 max-h-48 mx-auto rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {scanState === 'idle' && (
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              )}
              
              {scanState === 'complete' && (
                <>
                  <Button 
                    onClick={resetScanner}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Scan Another
                  </Button>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    New Scan
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-emerald-500" />
                  Analysis Results
                </div>
                <Badge className={getGradeColor(analysis.grade)}>
                  Grade {analysis.grade}
                </Badge>
              </CardTitle>
              <CardDescription>AI-powered sustainability assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{analysis.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-emerald-500">{analysis.ecoScore}</span>
                    <span className="text-gray-500 ml-1">/100</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Carbon Footprint</div>
                    <div className="font-semibold">{analysis.carbonFootprint} kg CO₂</div>
                  </div>
                </div>
              </div>

              {/* Sustainability Factors */}
              <div className="space-y-4">
                <h4 className="font-semibold">Sustainability Factors</h4>
                {Object.entries(analysis.sustainabilityFactors).map(([factor, score]) => (
                  <div key={factor} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center">
                  <Leaf className="mr-2 h-4 w-4 text-green-500" />
                  Recommendations
                </h4>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" className="flex-1">
                  <Recycle className="mr-2 h-4 w-4" />
                  Find Alternatives
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Save to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions (when no analysis) */}
        {!analysis && scanState === 'idle' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload Product Image</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Take a photo or upload an image of any product
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our AI analyzes packaging, materials, and production impact
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Insights</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Receive sustainability score and eco-friendly recommendations
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-300">Pro Tip</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      For best results, ensure good lighting and clear product visibility in your image.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}