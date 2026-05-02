import React from 'react'
import * as Select from '@radix-ui/react-select'
import * as Slider from '@radix-ui/react-slider'
import * as Tabs from '@radix-ui/react-tabs'
import { Label } from '@radix-ui/react-label'
import { ChevronDown, Settings2, Sparkles, Box, Palette, Download } from 'lucide-react'
import { useStore, GRADIENT_PRESETS } from '../store'
import { cn } from '../lib/utils'

export default function ControlPanel() {
  const { 
    noiseType, setNoiseType,
    frequency, setFrequency,
    amplitude, setAmplitude,
    evolutionSpeed, setEvolutionSpeed,
    scaleX, setScaleX,
    scaleY, setScaleY,
    materialType, setMaterialType,
    roughness, setRoughness,
    metalness, setMetalness,
    transmission, setTransmission,
    ior, setIor,
    thickness, setThickness,
    colors, setColorAt, setPreset,
    shapeType, setShapeType,
    quality, setQuality,
    gradientType, setGradientType,
    fullscreen, setFullscreen
  } = useStore()
  
  const store = { gradientType, setGradientType, fullscreen, setFullscreen }

  const [exported, setExported] = React.useState(false)

  const exportConfig = () => {
    const config = {
      material: materialType,
      noiseType: ["Simplex Organic", "Perlin Cloud", "Worley Cellular", "Fractal FBM"][noiseType],
      params: { frequency, amplitude, evolutionSpeed, scaleX, scaleY },
      materialProps: { roughness, metalness, transmission, ior, thickness },
      colors
    };
    const code = `const orbSettings = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code);
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  return (
    <div className="fixed top-6 right-6 bottom-6 w-80 z-50 animate-in fade-in slide-in-from-top-4 duration-1000 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-[2.5rem] p-6 overflow-y-auto relative max-h-full pointer-events-auto custom-scrollbar overscroll-contain">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-gray-500" />
            <h2 className="text-sm font-black tracking-tighter text-gray-800 uppercase">Orb Engine</h2>
          </div>
          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-widest">v2.3</span>
        </div>

        <div className="space-y-3 mb-8">
          <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engine Quality</Label>
          <CustomSelect value={quality.toString()} onChange={setQuality} options={[
            { value: "0", label: "Performance (Fastest)" },
            { value: "1", label: "Balanced" },
            { value: "2", label: "Cinema (High Poly)" }
          ]} />
        </div>

        <Tabs.Root defaultValue="noise" className="space-y-6">
          <Tabs.List className="flex bg-gray-100/50 p-1 rounded-2xl mb-8">
            <TabTrigger value="noise" icon={<Sparkles className="w-4 h-4" />} label="Motion" />
            <TabTrigger value="material" icon={<Box className="w-4 h-4" />} label="Body" />
            <TabTrigger value="colors" icon={<Palette className="w-4 h-4" />} label="Color" />
          </Tabs.List>

          {/* NOISE & GEOMETRY TAB */}
          <Tabs.Content value="noise" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Edge-to-Edge</Label>
                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Perfect Fullscreen Fill</p>
              </div>
              <button 
                onClick={() => store.setFullscreen(!store.fullscreen)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative duration-300",
                  store.fullscreen ? "bg-black" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                  store.fullscreen ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Algorithm</Label>
              <CustomSelect value={noiseType.toString()} onChange={setNoiseType} options={[
                { value: "0", label: "Simplex Organic" },
                { value: "1", label: "Perlin Cloud" },
                { value: "2", label: "Worley Cellular" },
                { value: "3", label: "Fractal FBM" }
              ]} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ControlSlider label="Frequency" value={frequency} onChange={setFrequency} min={0.1} max={2.0} />
              <ControlSlider label="Bumps" value={amplitude} onChange={setAmplitude} min={0.05} max={2.0} />
              <ControlSlider label="Evolution" value={evolutionSpeed} onChange={setEvolutionSpeed} min={0.05} max={1.2} />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <ControlSlider label="Width" value={scaleX} onChange={setScaleX} min={0.5} max={5.0} step={0.1} />
                <ControlSlider label="Height" value={scaleY} onChange={setScaleY} min={0.5} max={5.0} step={0.1} />
              </div>
            </div>
          </Tabs.Content>

          {/* MATERIAL TAB */}
          <Tabs.Content value="material" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Shape</Label>
                <CustomSelect value={shapeType} onChange={setShapeType} options={[
                  { value: "sphere", label: "Sphere" },
                  { value: "box", label: "Cube" },
                  { value: "torus", label: "Torus" },
                  { value: "cylinder", label: "Cylinder" }
                ]} />
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Surface Finish</Label>
                <CustomSelect value={materialType} onChange={setMaterialType} options={[
                  { value: "glass", label: "Frosted Glass" },
                  { value: "standard", label: "Satin Plastic" },
                  { value: "basic", label: "Unlit Glow" }
                ]} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ControlSlider label="Roughness" value={roughness} onChange={setRoughness} min={0} max={1} />
              <ControlSlider label="Metalness" value={metalness} onChange={setMetalness} min={0} max={1} />
              
              {materialType === 'glass' && (
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <ControlSlider label="Transmission" value={transmission} onChange={setTransmission} min={0} max={1} />
                  <ControlSlider label="Index of Refraction" value={ior} onChange={setIor} min={1.0} max={2.5} />
                  <ControlSlider label="Thickness" value={thickness} onChange={setThickness} min={0} max={10} />
                </div>
              )}
            </div>
          </Tabs.Content>

          {/* COLORS TAB */}
          <Tabs.Content value="colors" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gradient Style</Label>
              <CustomSelect value={store.gradientType.toString()} onChange={store.setGradientType} options={[
                { value: "0", label: "Generative Noise" },
                { value: "1", label: "Linear Ramp" },
                { value: "2", label: "Radial Sphere" }
              ]} />
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presets</Label>
              <CustomSelect value="" onChange={setPreset} options={Object.keys(GRADIENT_PRESETS).map(k => ({
                value: k, label: k.charAt(0).toUpperCase() + k.slice(1)
              }))} placeholder="Choose Preset..." />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Palette Editor</Label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color, i) => (
                  <div key={i} className="group relative flex flex-col items-center gap-1">
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColorAt(i, e.target.value)}
                      className="w-full h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm hover:scale-105 transition-transform"
                    />
                    <span className="text-[8px] font-mono text-gray-300 group-hover:text-gray-500 transition-colors uppercase">{color.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <a 
                href="https://github.com/ghosh/uiGradients" 
                target="_blank" 
                rel="noreferrer"
                className="text-[9px] font-medium text-gray-300 hover:text-gray-500 transition-colors"
              >
                Presets powered by uiGradients (Indrashish Ghosh)
              </a>
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="mt-10 pt-6 border-t border-gray-100">
           <button 
             onClick={exportConfig}
             className={cn(
               "w-full py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 active:scale-95 flex items-center justify-center gap-2",
               exported 
                ? "bg-green-500 text-white shadow-xl shadow-green-100" 
                : "bg-gray-900 text-white shadow-2xl shadow-gray-200 hover:bg-black"
             )}
           >
             {exported ? "Copied to Clipboard" : <><Download className="w-3 h-3" /> Export Session</>}
           </button>
        </div>
      </div>
    </div>
  )
}

function TabTrigger({ value, icon, label }) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Tabs.Trigger>
  )
}

function CustomSelect({ value, onChange, options, placeholder }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none">
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white/95 backdrop-blur-2xl rounded-2xl border border-gray-100 shadow-2xl z-[100] max-h-[300px]">
          <Select.Viewport className="p-2 h-full overflow-y-auto">
            {options.map(opt => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="relative flex items-center px-8 py-3 text-xs font-semibold text-gray-600 rounded-xl cursor-default select-none hover:bg-black hover:text-white transition-colors focus:outline-none"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

function ControlSlider({ label, value, onChange, min, max, step = 0.01 }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</Label>
        <span className="text-[10px] font-black text-gray-900 tabular-nums bg-gray-100 px-2 py-0.5 rounded-full">
          {value.toFixed(2)}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        max={max}
        min={min}
        step={step}
      >
        <Slider.Track className="bg-gray-100 relative grow rounded-full h-[6px]">
          <Slider.Range className="absolute bg-gray-900 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-[3px] border-gray-900 shadow-xl rounded-full hover:scale-110 active:scale-90 transition-transform focus:outline-none cursor-pointer"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  )
}
