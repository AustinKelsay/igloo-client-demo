import { useState } from 'react';
import { 
  KeysetGenerator, 
  EchoMonitor, 
  Button, 
  Card, 
  Modal,
  QRCodeDisplay,
  defaultIglooUIConfig 
} from '@igloo/ui';
import { IglooCore } from '@igloo/core';

// Initialize Igloo Core
const igloo = new IglooCore(defaultIglooUIConfig.defaultRelays);

type DemoStep = 'intro' | 'generate' | 'distribute' | 'monitor' | 'recover' | 'complete';

interface KeysetData {
  groupCredential: string;
  shareCredentials: string[];
  threshold: number;
  totalMembers: number;
  secretKey: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('intro');
  const [keysetData, setKeysetData] = useState<KeysetData | null>(null);
  const [selectedShareIndex, setSelectedShareIndex] = useState<number | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [echosReceived, setEchosReceived] = useState<Set<number>>(new Set());
  const [recoveredSecret, setRecoveredSecret] = useState<string | null>(null);

  const handleKeysetGenerated = (data: KeysetData) => {
    setKeysetData(data);
    setCurrentStep('distribute');
  };

  const handleEchoReceived = (shareIndex: number) => {
    setEchosReceived(prev => new Set([...prev, shareIndex]));
  };

  const handleRecoverSecret = async () => {
    if (!keysetData) return;
    
    try {
      // For demo purposes, we'll use the first threshold number of shares
      const sharesToUse = keysetData.shareCredentials.slice(0, keysetData.threshold);
      const secret = await igloo.recoverSecret(keysetData.groupCredential, sharesToUse);
      setRecoveredSecret(secret);
      setCurrentStep('complete');
    } catch (error) {
      console.error('Failed to recover secret:', error);
    }
  };

  const resetDemo = () => {
    setCurrentStep('intro');
    setKeysetData(null);
    setSelectedShareIndex(null);
    setShowQRModal(false);
    setEchosReceived(new Set());
    setRecoveredSecret(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Igloo Flow Demo
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Experience the complete Igloo threshold signature workflow:
                from generating keysets to distributed echo monitoring and secret recovery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">🔑 Keyset Generation</h3>
                  <p className="text-sm text-blue-600 mt-1">Generate threshold signature keysets</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">📱 Share Distribution</h3>
                  <p className="text-sm text-green-600 mt-1">Distribute shares via QR codes</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800">🔊 Echo Monitoring</h3>
                  <p className="text-sm text-purple-600 mt-1">Monitor share echo confirmations</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800">🔓 Secret Recovery</h3>
                  <p className="text-sm text-orange-600 mt-1">Recover secrets from threshold shares</p>
                </div>
              </div>
              <Button 
                onClick={() => setCurrentStep('generate')}
                className="mt-8 px-8 py-3 text-lg"
              >
                Start Demo
              </Button>
            </div>
          </Card>
        );

      case 'generate':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 1: Generate Keyset</h2>
              <p className="text-gray-600">Create a threshold signature keyset with your parameters</p>
            </div>
            <KeysetGenerator onKeysetGenerated={handleKeysetGenerated} />
          </div>
        );

      case 'distribute':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 2: Distribute Shares</h2>
              <p className="text-gray-600">Share the generated key shares with participants via QR codes</p>
            </div>
            
            {keysetData && (
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Keyset Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Threshold:</span> {keysetData.threshold}
                    </div>
                    <div>
                      <span className="font-medium">Total Members:</span> {keysetData.totalMembers}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Share Credentials</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keysetData.shareCredentials.map((share, index) => (
                      <Card key={index} className="p-4 border-2 hover:border-blue-300 transition-colors">
                        <div className="text-center space-y-3">
                          <div className="font-semibold">Share #{index + 1}</div>
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded truncate">
                            {share.substring(0, 20)}...
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedShareIndex(index);
                              setShowQRModal(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            Show QR Code
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => setCurrentStep('monitor')}
                    className="px-8"
                  >
                    Continue to Echo Monitoring
                  </Button>
                </div>
              </Card>
            )}

            <Modal 
              isOpen={showQRModal} 
              onClose={() => setShowQRModal(false)}
              title={`Share #${(selectedShareIndex ?? 0) + 1} QR Code`}
            >
              {selectedShareIndex !== null && keysetData && (
                <div className="text-center space-y-4">
                  <QRCodeDisplay 
                    value={keysetData.shareCredentials[selectedShareIndex]}
                    size={256}
                  />
                  <p className="text-sm text-gray-600">
                    Scan this QR code to share the credential with participant #{selectedShareIndex + 1}
                  </p>
                </div>
              )}
            </Modal>
          </div>
        );

      case 'monitor':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 3: Monitor Echoes</h2>
              <p className="text-gray-600">Watch for echo confirmations from distributed shares</p>
            </div>

            {keysetData && (
              <>
                <EchoMonitor
                  groupCredential={keysetData.groupCredential}
                  shareCredentials={keysetData.shareCredentials}
                  onEchoReceived={handleEchoReceived}
                />

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Echo Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {keysetData.shareCredentials.map((_, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-2 ${
                          echosReceived.has(index) 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Share #{index + 1}</span>
                          <span className={`text-lg ${
                            echosReceived.has(index) ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {echosReceived.has(index) ? '✓' : '○'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {echosReceived.has(index) ? 'Echo received' : 'Waiting for echo...'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="mb-4">
                      <span className="text-lg font-medium">
                        {echosReceived.size} / {keysetData.totalMembers} echoes received
                      </span>
                      {echosReceived.size >= keysetData.threshold && (
                        <div className="text-green-600 font-medium mt-2">
                          ✓ Threshold reached! Ready for secret recovery.
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => setCurrentStep('recover')}
                      disabled={echosReceived.size < keysetData.threshold}
                      className="px-8"
                    >
                      Proceed to Secret Recovery
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>
        );

      case 'recover':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 4: Recover Secret</h2>
              <p className="text-gray-600">Use the threshold shares to recover the original secret</p>
            </div>

            {keysetData && (
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Secret Recovery Process</h3>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <p className="text-blue-800">
                        Using {keysetData.threshold} out of {keysetData.totalMembers} shares to recover the secret key.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Original Secret (for verification)</h4>
                      <div className="font-mono text-sm bg-gray-100 p-3 rounded break-all">
                        {keysetData.secretKey}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recovered Secret</h4>
                      <div className="font-mono text-sm bg-gray-100 p-3 rounded break-all min-h-[52px] flex items-center">
                        {recoveredSecret ? (
                          <span className={recoveredSecret === keysetData.secretKey ? 'text-green-600' : 'text-red-600'}>
                            {recoveredSecret}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Click "Recover Secret" to proceed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      onClick={handleRecoverSecret}
                      disabled={!!recoveredSecret}
                      className="px-8"
                    >
                      {recoveredSecret ? 'Secret Recovered!' : 'Recover Secret'}
                    </Button>
                  </div>

                  {recoveredSecret && (
                    <div className="text-center mt-6">
                      <div className={`p-4 rounded-lg ${
                        recoveredSecret === keysetData.secretKey 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className={`text-lg font-semibold ${
                          recoveredSecret === keysetData.secretKey ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {recoveredSecret === keysetData.secretKey 
                            ? '✓ Secret Successfully Recovered!' 
                            : '✗ Secret Recovery Failed'}
                        </div>
                        <p className={`text-sm mt-1 ${
                          recoveredSecret === keysetData.secretKey ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {recoveredSecret === keysetData.secretKey 
                            ? 'The recovered secret matches the original key perfectly.'
                            : 'The recovered secret does not match the original key.'}
                        </p>
                      </div>
                      
                      <Button 
                        onClick={() => setCurrentStep('complete')}
                        className="mt-4 px-8"
                      >
                        Complete Demo
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        );

      case 'complete':
        return (
          <Card className="max-w-2xl mx-auto p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold text-gray-800">Demo Complete!</h1>
              <p className="text-lg text-gray-600">
                You've successfully completed the full Igloo threshold signature workflow.
              </p>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">What you accomplished:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Generated a threshold signature keyset</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Distributed shares via QR codes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Monitored echo confirmations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Successfully recovered the secret key</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 justify-center">
                <Button onClick={resetDemo} variant="outline">
                  Run Demo Again
                </Button>
                <Button 
                  onClick={() => window.open('https://github.com/FROSTR-ORG/igloo-ui', '_blank')}
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto">
        {/* Progress indicator */}
        {currentStep !== 'intro' && currentStep !== 'complete' && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
              {['generate', 'distribute', 'monitor', 'recover'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? 'bg-blue-600 text-white' 
                      : ['generate', 'distribute', 'monitor', 'recover'].indexOf(currentStep) > index
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {['generate', 'distribute', 'monitor', 'recover'].indexOf(currentStep) > index ? '✓' : index + 1}
                  </div>
                  {index < 3 && <div className="w-12 h-0.5 bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {renderStepContent()}
      </div>
    </div>
  );
}

export default App;
