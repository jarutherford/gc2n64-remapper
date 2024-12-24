import React, { useState, useEffect } from 'react';
import { Code, Download, Upload, Moon, Sun } from 'lucide-react';

export default function ButtonRemapper() {
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  
  useEffect(() => {
    // Set initial dark mode class on mount
    document.documentElement.classList.add('dark');
  }, []); // Empty dependency array means this only runs once on mount

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Rest of the existing button definitions...
  const gcButtons = [
    "A", "B", "X", "Y", "Start", "L", "R", "Z",
    "DUp", "DDown", "DLeft", "DRight",
    "CStick Up", "CStick Down", "CStick Left", "CStick Right"
  ];

  const n64Buttons = [
    "A", "B", "Z", "Start", "L", "R",
    "DUp", "DDown", "DLeft", "DRight",
    "CUp", "CDown", "CLeft", "CRight"
  ];

  // Initial mappings remain the same...
  const defaultMappings = {
    "A": "A",
    "B": "B",
    "Z": "Z",
    "Start": "Start",
    "L": "L",
    "R": "R",
    "DUp": "DUp",
    "DDown": "DDown",
    "DLeft": "DLeft",
    "DRight": "DRight",
    "CStick Up": "CUp",
    "CStick Down": "CDown",
    "CStick Left": "CLeft",
    "CStick Right": "CRight",
    "X": "CRight",
    "Y": "CLeft"
  };

  const [mappings, setMappings] = useState(defaultMappings);
  const [generatedCode, setGeneratedCode] = useState('');

  // Button masks remain the same...
  const buttonMasks = {
    "A": ["data1", "0x01"],
    "B": ["data1", "0x02"],
    "X": ["data1", "0x04"],
    "Y": ["data1", "0x08"],
    "Start": ["data1", "0x10"],
    "L": ["data2", "0x40"],
    "R": ["data2", "0x20"],
    "Z": ["data2", "0x10"],
    "DUp": ["data2", "0x08"],
    "DDown": ["data2", "0x04"],
    "DRight": ["data2", "0x02"],
    "DLeft": ["data2", "0x01"]
  };

  const n64ButtonMasks = {
    "A": [0, "0x80"],
    "B": [0, "0x40"],
    "Z": [0, "0x20"],
    "Start": [0, "0x10"],
    "DUp": [0, "0x08"],
    "DDown": [0, "0x04"],
    "DLeft": [0, "0x02"],
    "DRight": [0, "0x01"],
    "L": [1, "0x20"],
    "R": [1, "0x10"],
    "CUp": [1, "0x08"],
    "CDown": [1, "0x04"],
    "CLeft": [1, "0x02"],
    "CRight": [1, "0x01"]
  };

  // Existing handler functions remain the same...
  const handleMappingChange = (gcButton, n64Button) => {
    setMappings(prev => ({
      ...prev,
      [gcButton]: n64Button
    }));
  };

  const generateCode = () => {
    let code = "// Button mapping function\n";
    code += "void mapGamecubeToN64() {\n";
    code += "    // Clear the N64 buffer\n";
    code += "    memset(n64_buffer, 0, sizeof(n64_buffer));\n\n";

    // Standard button mappings
    Object.entries(mappings).forEach(([gcButton, n64Button]) => {
      if (n64Button !== "None" && buttonMasks[gcButton]) {
        const [gcReg, gcMask] = buttonMasks[gcButton];
        const [n64Buf, n64Mask] = n64ButtonMasks[n64Button];

        code += `    // Map ${gcButton} to ${n64Button}\n`;
        code += `    if (gc_status.${gcReg} & ${gcMask}) {\n`;
        code += `        n64_buffer[${n64Buf}] |= ${n64Mask};\n`;
        code += "    }\n\n";
      }
    });

    // C-Stick mappings
    const cstickButtons = ["CStick Up", "CStick Down", "CStick Left", "CStick Right"];
    code += "    // C-Stick mappings\n";
    cstickButtons.forEach(gcButton => {
      const n64Button = mappings[gcButton];
      if (n64Button !== "None") {
        const direction = gcButton.split(" ").pop().toLowerCase();
        const variable = direction === "up" || direction === "down" ? "cstick_y" : "cstick_x";
        const threshold = (direction === "up" || direction === "right") ? "0xB0" : "0x50";
        const comparison = (direction === "up" || direction === "right") ? ">" : "<";

        const [n64Buf, n64Mask] = n64ButtonMasks[n64Button];
        code += `    // Map ${gcButton} to ${n64Button}\n`;
        code += `    if (gc_status.${variable} ${comparison} ${threshold}) {\n`;
        code += `        n64_buffer[${n64Buf}] |= ${n64Mask};\n`;
        code += "    }\n\n";
      }
    });

    code += "}\n";
    setGeneratedCode(code);
  };

  const saveMappings = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(mappings, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "gc_n64_mappings.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadMappings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedMappings = JSON.parse(e.target.result);
          setMappings(loadedMappings);
        } catch (error) {
          alert("Error loading mappings file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center dark:text-white">GameCube to N64 Button Remapper</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Button Mappings</h2>
          
          <div className="grid gap-4 mb-8">
            {gcButtons.map((gcButton) => (
              <div key={gcButton} className="grid grid-cols-2 gap-4 items-center">
                <label className="text-gray-700 dark:text-gray-300">GameCube {gcButton}:</label>
                <select
                  value={mappings[gcButton] || "None"}
                  onChange={(e) => handleMappingChange(gcButton, e.target.value)}
                  className="form-select w-full rounded border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           shadow-sm focus:border-blue-500 dark:focus:border-blue-400"
                >
                  <option value="None">None</option>
                  {n64Buttons.map((n64Button) => (
                    <option key={n64Button} value={n64Button}>
                      {n64Button}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={generateCode}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded 
                       hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Code className="w-4 h-4 mr-2" />
              Generate Code
            </button>
            
            <button
              onClick={saveMappings}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded 
                       hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Save Mappings
            </button>
            
            <label className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded 
                           hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Load Mappings
              <input
                type="file"
                accept=".json"
                onChange={loadMappings}
                className="hidden"
              />
            </label>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 
                        rounded-lg p-4 mb-8">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Instructions:</strong> After generating the code, copy the entire function and replace the existing 
              <code className="mx-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded">
                void mapGamecubeToN64()
              </code> 
              function in your gamecube.ino file with this newly generated code.
            </p>
          </div>

          {generatedCode && (
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Generated Code:</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto 
                          text-gray-800 dark:text-gray-200">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>

        <div className="fixed bottom-4 right-4">
          <a
            href="https://github.com/jarutherford/gc2n64-remapper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-700 
                     text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 
                     transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}