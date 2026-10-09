import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BackgroundSwitcher } from '@/components/BackgroundSwitcher'
import { BG_THEMES, DEFAULT_THEME_ID, type BgTheme } from '@/lib/themes'
import { useColorMode } from '@/lib/colorMode'
import { TutorialProvider } from '@/components/TutorialProvider'
import { TutorialOverlay } from '@/components/TutorialOverlay'
import { useTutorial } from '@/lib/tutorial'

const STORAGE_KEY = 'roflbox-bg-theme'

/** Secondary hero-level tutorial CTA — must live inside TutorialProvider */
function HeroTutorialCTA() {
  const { start: startTutorial, completed: tutorialCompleted } = useTutorial()
  return (
    <button
      onClick={startTutorial}
      className="text-xs font-mono text-white/50 hover:text-white/75 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:rounded"
    >
      {tutorialCompleted ? '▶ replay tutorial' : '▶ start tutorial'}
    </button>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [hackLevel, setHackLevel] = useState(0)
  const [isBlinking, setIsBlinking] = useState(false)
  const [matrixText, setMatrixText] = useState('INITIALIZING...')
  const [chaosMode, setChaosMode] = useState(false)

  // Color mode state – persisted in localStorage under 'roflbox.colorMode'
  const { preference: colorModePreference, resolvedMode: resolvedColorMode, setColorMode } = useColorMode()

  // Background theme state – persisted in localStorage
  const [currentTheme, setCurrentTheme] = useState<BgTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return BG_THEMES.find(t => t.id === saved) ?? BG_THEMES.find(t => t.id === DEFAULT_THEME_ID) ?? BG_THEMES[0]
  })

  // Apply data-bg-theme attribute to <html> and keep it in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-bg-theme', currentTheme.id)
    return () => {
      document.documentElement.removeAttribute('data-bg-theme')
    }
  }, [currentTheme.id])

  const handleThemeChange = (theme: BgTheme) => {
    setCurrentTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme.id)
  }

  // Function to download fake zip file
  const downloadFakeZip = () => {
    // Create a large buffer of zeros (actual size will be smaller due to compression)
    // We'll create a fake zip file structure with just zeros
    const fakeZipContent = new Uint8Array(1024 * 1024 * 10) // 10MB of zeros, will appear larger
    const blob = new Blob([fakeZipContent], { type: 'application/zip' })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ROFLBOX_ULTIMATE_H4X_TOOLKIT_v6.9GB.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // Also increase hack level for effect
    setHackLevel(prev => prev + 10)
  }

  // Helper function to conditionally apply chaos animations
  const chaosClass = (className: string) => chaosMode ? className : ''

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const messages = [
      'HACKING MAINFRAME...',
      'BYPASSING SECURITY...',
      'DOWNLOADING RAM...',
      'ENHANCING PIXELS...',
      'REVERSING POLARITY...',
      'ACCESSING GIBSON...',
      'TRIANGULATING IP...',
      'READY TO PWNN00BS!'
    ]
    const interval = setInterval(() => {
      setMatrixText(messages[Math.floor(Math.random() * messages.length)])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <TutorialProvider>
      <TutorialOverlay />
      <div
        className={`min-h-screen flex flex-col items-center justify-start p-4 relative ${chaosClass('perspective-crazy')}`}
        style={{ overflow: 'visible', background: currentTheme.value }}
      >
        {/* Background theme + dark mode switcher */}
        <BackgroundSwitcher
          currentThemeId={currentTheme.id}
          onThemeChange={handleThemeChange}
          colorModePreference={colorModePreference}
          resolvedColorMode={resolvedColorMode}
          onColorModeChange={setColorMode}
        />
      
      {/* FLOATING CHAOS - ABSOLUTE POSITIONED MADNESS - Only in chaos mode */}
      {chaosMode && (
        <>
          <div className="fixed top-10 left-10 z-50 animate-fly-around hover-explode" style={{fontSize: '72px'}}>
            💀
          </div>
          
          <div className="fixed top-20 right-20 z-50 animate-rainbow-spin" style={{fontSize: '48px'}}>
            🔥
          </div>
          
          <div className="fixed bottom-20 left-1/4 z-50 animate-wobble-crazy font-comic text-red-500" style={{fontSize: '36px', fontFamily: 'Comic Sans MS, cursive'}}>
            CLICK ME!!!
          </div>
        </>
      )}
      
      {/* FAKE AD POPUP - Only in chaos mode */}
      {chaosMode && (
        <>
          <div className="fixed top-1/3 right-5 z-50 bg-yellow-300 border-4 border-red-500 p-4 rotate-12 animate-shake-violent" style={{width: '200px', boxShadow: '10px 10px 20px rgba(0,0,0,0.8)'}}>
            <div className="text-red-600 font-bold text-center animate-blink-seizure" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              🎉 CONGRATULATIONS! 🎉
            </div>
            <div className="text-xs mt-2 text-blue-800">
              You are visitor #999,999! Click here to claim your FREE BITCOIN!
            </div>
            <button className="bg-green-500 text-white p-1 text-xs mt-1 w-full hover-shrink animate-pulse">
              CLAIM NOW!!!
            </button>
          </div>
          
          {/* ANOTHER FLOATING AD */}
          <div className="fixed bottom-10 right-10 z-50 bg-pink-400 border-2 border-purple-800 p-2 -rotate-6 animate-float-diagonal" style={{fontSize: '14px'}}>
            <div className="font-bold text-purple-900 animate-text-crazy">HOT SINGLES IN YOUR AREA!</div>
            <div className="text-xs">DOCTORS HATE THIS TRICK!</div>
          </div>
        </>
      )}
      
      {/* TERRIBLE MARQUEE TEXT - Only in chaos mode */}
      {chaosMode && (
        <div className="fixed top-0 left-0 w-full z-40 bg-black text-green-400 py-1" style={{fontFamily: 'Comic Sans MS, cursive'}}>
          <div style={{
            animation: 'marquee 10s linear infinite',
            whiteSpace: 'nowrap'
          }}>
            💻 ELITE HACKER DETECTED 💻 DOWNLOADING MORE RAM... 🌈 FREE VBUCKS GENERATOR 🌈 YOUR IP: 127.0.0.1 📱 CLICK HERE FOR VIRUS-FREE DOWNLOAD 📱 CONGRATULATIONS!!! 🎊 NO SURVEY REQUIRED 🎊
          </div>
        </div>
      )}
      
      {/* RANDOM EMOJIS FLYING AROUND - Only in chaos mode */}
      {chaosMode && (
        <>
          <div className="fixed top-1/4 left-1/3 z-30 animate-fly-around" style={{fontSize: '32px'}}>🚀</div>
          <div className="fixed top-3/4 left-1/2 z-30 animate-rainbow-spin" style={{fontSize: '28px'}}>⚡</div>
          <div className="fixed top-1/2 left-1/4 z-30 animate-wobble-crazy" style={{fontSize: '40px'}}>🎮</div>
        </>
      )}
      
      {/* MISALIGNED CLIPART - Only in chaos mode */}
      {chaosMode && (
        <>
          <div className="absolute top-32 left-5 rotate-45 animate-shake-violent" style={{fontSize: '64px', zIndex: 25}}>
            🤖
          </div>
          
          <div className="absolute top-1/2 right-5 -rotate-12 animate-float-diagonal" style={{fontSize: '56px', zIndex: 25}}>
            👾
          </div>
        </>
      )}
      {/* Scrolling Banner - Conditional chaos */}
      <div className={`w-full bg-red-600 text-white py-2 mb-4 overflow-hidden border-4 border-yellow-300 ${chaosClass('animate-shake-violent')}`} style={{fontFamily: 'Comic Sans MS, cursive', marginTop: '30px'}}>
        <div className={`animate-pulse whitespace-nowrap ${chaosClass('rotate-3d-crazy')}`}>
          <span className={`inline-block ${chaosClass('animate-bounce')} font-mono text-sm ${chaosClass('hover-explode animate-blink-seizure')}`}>
            🚨 WARNING: ELITE H4X0R ZONE - NOOBS WILL BE PWNED 🚨 
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center">
        {/* Obnoxious Header - Conditional chaos */}
        <div id="tutorial-hero" className="mb-8 perspective-crazy">
          <div className={`text-6xl md:text-9xl font-black mb-4 transition-all duration-300 ${chaosClass('hover-fly animate-wobble-crazy')} ${isBlinking ? 'text-red-500 scale-110 animate-shake-violent' : 'text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-yellow-300 to-red-500'}`}>
            <span className={`font-mono tracking-wider drop-shadow-lg ${chaosClass('hover-explode rotate-3d-crazy')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>R</span>
            <span className={`font-serif italic ${chaosClass('animate-rainbow-spin')}`}>O</span>
            <span className={`font-mono ${chaosClass('animate-text-crazy')}`}>F</span>
            <span className={`font-sans font-bold ${chaosClass('hover-shrink')}`} style={{fontSize: '1.5em'}}>L</span>
            <span className={`font-mono ${chaosClass('animate-fly-around')}`}>B</span>
            <span className={`font-serif ${chaosClass('rotate-3d-crazy')}`}>O</span>
            <span className={`font-mono tracking-widest ${chaosClass('animate-blink-seizure')}`}>X</span>
          </div>
          
          <div className={`animate-pulse text-2xl md:text-4xl font-bold text-yellow-300 mb-4 font-mono ${chaosClass('hover-explode animate-text-crazy')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>
            ⚡ ULTIMATE H4X TOOLKIT ⚡
          </div>
          
          <p className={`text-lg md:text-xl text-white/90 mb-6 font-mono bg-black/30 p-4 border-2 border-green-400 rounded-lg ${chaosClass('animate-wobble-crazy rotate-3d-crazy')}`} style={{fontFamily: 'Comic Sans MS, cursive', overflow: 'visible', wordWrap: 'break-word'}}>
            ARE YOU NOOB? WANT TO BE PRO?<br/>
            <span className={`text-red-400 font-bold ${chaosClass('animate-blink-seizure hover-explode')}`}>DOWNLOAD ROFLBOX TO GROW UP!</span><br/>
            <span className={`text-lime-400 ${chaosClass('animate-text-crazy')}`}>ROFLBOX.WEBSITE FOR BEST H4X!!!</span><br/>
            <span className={`text-pink-400 ${chaosClass('animate-shake-violent')}`} style={{fontSize: '0.8em'}}>🎉🎊✨⭐🌟💫⚡🔥💯🚀👾🎮💻🖥️📱📞☎️📺📻🎵🎶🎼🎹🎸🥁🎤🎧🎬🎭🎨🖌️🖍️✏️📝📋📄📃📑📊📈📉📇📌📍📎🖇️📏📐📁📂🗂️📅📆🗓️📇🗃️🗄️🗑️📋</span>
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <Button 
              size="lg" 
              className={`text-lg font-mono bg-red-600 hover:bg-red-700 animate-pulse border-2 border-yellow-400 ${chaosClass('hover-explode animate-rainbow-spin')}`}
              onClick={downloadFakeZip}
              style={{fontFamily: 'Comic Sans MS, cursive', transform: 'skew(-10deg)'}}
            >
              💀 DOWNLOAD H4X 💀
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className={`text-lg font-mono border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black animate-bounce ${chaosClass('hover-fly rotate-3d-crazy')}`}
              onClick={() => setChaosMode(true)}
              style={{fontFamily: 'Comic Sans MS, cursive', transform: 'rotate(5deg)'}}
            >
              🎉 FREE TRIAL 🎉
            </Button>
            <Button 
              size="lg" 
              className={`text-lg font-mono bg-purple-600 hover:bg-purple-700 border-2 border-pink-400 ${chaosClass('animate-wobble-crazy hover-shrink')}`}
              onClick={() => setChaosMode(true)}
              style={{fontFamily: 'Comic Sans MS, cursive', transform: 'skew(15deg) rotate(-3deg)'}}
            >
              💰 BUY PREMIUM 💰
            </Button>
          </div>
          {/* Visible tutorial CTA below the main hero buttons */}
          <div className="mt-4 flex justify-center">
            <HeroTutorialCTA />
          </div>
        </div>

        {/* Fake Hacking Terminal - Conditional chaos */}
        <Card id="tutorial-terminal" className={`max-w-2xl mx-auto mb-8 bg-black border-2 border-green-400 ${chaosClass('animate-wobble-crazy hover-explode rotate-3d-crazy')}`} style={{transform: chaosMode ? 'perspective(400px) rotateY(10deg)' : 'none'}}>
          <CardHeader className={chaosClass('animate-shake-violent')}>
            <CardTitle className={`text-green-400 font-mono ${chaosClass('animate-text-crazy hover-fly')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>
              🖥️ ELITE HACKER TERMINAL 9000™ 🖥️
            </CardTitle>
            <CardDescription className={`text-green-300 font-mono ${chaosClass('animate-blink-seizure')}`}>
              {matrixText} 💀💀💀
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`bg-black p-4 rounded border border-green-400 font-mono text-green-400 text-left overflow-scroll ${chaosClass('animate-rainbow-spin')}`} style={{height: '150px', fontFamily: 'Courier New, monospace'}}>
              <div className={`mb-2 ${chaosClass('animate-text-crazy')}`}>root@roflbox:~# ./hack.exe --target=noobs</div>
              <div className={`mb-2 text-yellow-400 ${chaosClass('hover-explode')}`}>Initializing neural network...</div>
              <div className={`mb-2 ${chaosClass('animate-shake-violent')}`}>Hack Level: {hackLevel}% 🔥🔥🔥</div>
              <div className={`text-red-400 ${chaosClass('animate-blink-seizure')}`}>{hackLevel > 50 ? 'SYSTEM COMPROMISED! 💀💀💀' : 'Scanning for vulnerabilities... 👾👾👾'}</div>
              <div className={`text-purple-400 ${chaosClass('animate-float-diagonal')}`}>DOWNLOADING MORE RAM... 🚀</div>
              <div className={`text-cyan-400 ${chaosClass('animate-fly-around')}`} style={{fontSize: '0.8em'}}>BYPASSING FIREWALL WITH GUI INTERFACE... 💻</div>
              <div className="text-orange-400" style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>ACCESS GRANTED TO MAINFRAME OF THE INTERNET!!!!!!!!!!!!! 🌐🌐🌐</div>
            </div>
          </CardContent>
        </Card>

        {/* Ridiculous Counter - Conditional chaos */}
        <Card id="tutorial-counter" className={`max-w-md mx-auto mb-8 border-4 border-rainbow animate-pulse ${chaosClass('hover-explode rotate-3d-crazy animate-float-diagonal')}`} style={{background: 'linear-gradient(45deg, #ff00ff, #00ff00, #ff8000, #ffff00)', transform: chaosMode ? 'skew(-5deg) perspective(200px) rotateX(15deg)' : 'skew(-2deg)'}}>
          <CardHeader className={chaosClass('animate-shake-violent')}>
            <CardTitle className={`text-2xl font-mono text-red-500 ${chaosClass('animate-blink-seizure hover-fly')}`} style={{fontFamily: 'Comic Sans MS, cursive', textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000'}}>
              💥 SKILL COUNTER 3000™ 💥
            </CardTitle>
            <CardDescription className={`font-mono text-yellow-600 ${chaosClass('animate-text-crazy')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>
              Track your 1337 skillz progression 🎮🎯🔥
            </CardDescription>
          </CardHeader>
          <CardContent className={chaosClass('animate-wobble-crazy')}>
            <div className="flex flex-col items-center gap-4 perspective-crazy">
              <div className={`text-6xl font-bold text-lime-400 font-mono animate-bounce ${chaosClass('hover-explode animate-rainbow-spin')}`} style={{textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00', transform: chaosMode ? 'scale(1.2) rotate(45deg)' : 'scale(1)'}}>
                {count} 💯
              </div>
              <div className={`text-sm text-purple-400 font-mono ${chaosClass('animate-blink-seizure')}`} style={{fontFamily: 'Comic Sans MS, cursive', overflow: 'visible'}}>
                {count > 10 ? '🎉 PRO GAMER MODE ACTIVATED! 🎉🎊✨' : count > 5 ? '📈 Getting gud... 📊📈' : '😭 NOOB DETECTED 😱💀'}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => setCount(count + 1)}
                  className={`font-mono bg-lime-600 hover:bg-lime-700 ${chaosClass('hover-explode animate-shake-violent')}`}
                  style={{fontFamily: 'Comic Sans MS, cursive', transform: 'rotate(-10deg) skew(5deg)'}}
                >
                  ⬆️ +1 SKILL ⬆️
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCount(0)}
                  className={`font-mono border-red-400 text-red-400 ${chaosClass('hover-shrink animate-blink-seizure')}`}
                  style={{fontFamily: 'Comic Sans MS, cursive', transform: 'rotate(8deg)'}}
                >
                  🔄 RESET NOOB 🔄
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => setCount(count - 1)}
                  className={`font-mono ${chaosClass('animate-wobble-crazy hover-fly')}`}
                  style={{fontFamily: 'Comic Sans MS, cursive', transform: 'rotate(-5deg) scale(0.9)'}}
                >
                  ⬇️ -1 GIT GUD ⬇️
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fake Features - Conditional chaos */}
        <div id="tutorial-features" className="grid md:grid-cols-3 gap-6 mb-8 perspective-crazy">
          <Card className={`border-2 border-red-500 bg-red-950/50 transform rotate-1 ${chaosClass('hover-explode animate-wobble-crazy')}`} style={{overflow: 'visible', boxShadow: '0 0 30px #ff0000'}}>
            <CardHeader className={chaosClass('animate-shake-violent')}>
              <CardTitle className={`text-red-400 font-mono ${chaosClass('animate-blink-seizure hover-fly')}`} style={{fontFamily: 'Comic Sans MS, cursive', fontSize: '1.5em'}}>🔥 AIMBOT 9000 🔥</CardTitle>
              <CardDescription className={`font-mono text-red-200 ${chaosClass('animate-text-crazy')}`} style={{overflow: 'visible', wordWrap: 'break-word'}}>
                Never miss again! Totally not detected! 🎯💀🔫⚡✨🌟💥🎊🎉🎈🎁🎀🎂🍰🧁🍭🍬🍪🍫🍩🍯🍓🍎🍊🍋🍌🍉🍇🍈🥝🍑🍒🥥🥭🍍🥕🌽🥒🥬🥦🍄🥜🌰🥔🍠🥖🥐🍞
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className={`border-2 border-yellow-500 bg-yellow-950/50 transform -rotate-1 ${chaosClass('hover-shrink animate-float-diagonal')}`} style={{boxShadow: '0 0 25px #ffff00'}}>
            <CardHeader className={chaosClass('animate-rainbow-spin')}>
              <CardTitle className={`text-yellow-400 font-mono ${chaosClass('animate-wobble-crazy hover-explode')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>⚡ SPEEDHAX ⚡</CardTitle>
              <CardDescription className={`font-mono text-yellow-200 ${chaosClass('animate-blink-seizure')}`} style={{transform: 'skew(10deg)'}}>
                Go faster than physics allows! 🚀💨⚡🏃‍♂️🏃‍♀️💯🔥💥
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className={`border-2 border-purple-500 bg-purple-950/50 transform rotate-2 ${chaosClass('hover-fly animate-shake-violent')}`} style={{boxShadow: '0 0 35px #800080'}}>
            <CardHeader className={chaosClass('animate-text-crazy')}>
              <CardTitle className={`text-purple-400 font-mono ${chaosClass('animate-blink-seizure hover-explode')}`} style={{fontFamily: 'Comic Sans MS, cursive'}}>🌟 WALLHAX 🌟</CardTitle>
              <CardDescription className={`font-mono text-purple-200 ${chaosClass('animate-rainbow-spin')}`} style={{fontSize: '0.9em', letterSpacing: '2px'}}>
                See through walls like Superman! 👀🦸‍♂️🦸‍♀️💪🔍🌟✨💫⭐🌙☀️🌈🦄🐉🐲🔮🎭🎪🎨🖼️🖌️🖍️✏️📝📋📄📃📑📊📈📉
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Testimonials - Conditional chaos */}
        <Card id="tutorial-testimonials" className={`mb-8 border-4 border-dashed border-pink-500 bg-gradient-to-r from-pink-950/50 to-blue-950/50 ${chaosClass('animate-wobble-crazy hover-explode rotate-3d-crazy')}`} style={{overflow: 'visible', transform: chaosMode ? 'perspective(300px) rotateY(-10deg) skew(5deg)' : 'skew(2deg)'}}>
          <CardHeader className={chaosClass('animate-shake-violent')}>
            <CardTitle className={`text-3xl font-mono text-pink-400 ${chaosClass('animate-text-crazy hover-fly')}`} style={{fontFamily: 'Comic Sans MS, cursive', textShadow: '0 0 15px #ff69b4'}}>
              💬 TESTIMONIALS FROM PROS 💬
            </CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${chaosClass('animate-blink-seizure')}`}>
            <div className="font-mono text-left perspective-crazy" style={{fontFamily: 'Comic Sans MS, cursive'}}>
              <p className={`text-green-400 ${chaosClass('animate-rainbow-spin hover-explode')}`} style={{overflow: 'visible', wordBreak: 'break-all'}}>"I was noob, now I'm pro! Thanks ROFLBOX!" - xX_PrO_GaMeR_Xx 🎮🎯💯🔥⚡👾</p>
              <p className={`text-blue-400 ${chaosClass('animate-float-diagonal hover-shrink')}`} style={{transform: 'rotate(-2deg) skew(3deg)'}}>"Best h4x ever! My mom thinks I'm good at games now!" - MLG_360_NoScoper 🚀💀🎊✨</p>
              <p className={`text-yellow-400 ${chaosClass('animate-wobble-crazy hover-fly')}`} style={{fontSize: '1.1em', letterSpacing: '1px'}}>"ROFLBOX made me the best player in the world!" - Definitely_Not_Fake_Review 🌟⭐💫🌙☀️</p>
              <p className={`text-purple-400 ${chaosClass('animate-shake-violent')}`} style={{fontSize: '0.8em', transform: 'rotate(5deg)'}}>🎉🎊✨⭐🌟💫⚡🔥💯🚀👾🎮💻🖥️📱📞☎️📺📻🎵🎶🎼🎹🎸🥁🎤🎧🎬🎭🎨🖌️🖍️✏️📝</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Conditional chaos */}
        <footer className={`text-white/70 font-mono bg-black/50 p-4 border border-green-400 rounded ${chaosClass('animate-blink-seizure hover-explode rotate-3d-crazy')}`} style={{fontFamily: 'Comic Sans MS, cursive', overflow: 'visible', transform: 'skew(-3deg)'}}>
          <div className={chaosClass('animate-text-crazy')}>© 2024 ROFLBOX - NOT RESPONSIBLE FOR GETTING BANNED 💀</div>
          <div className={`${chaosClass('animate-shake-violent')} text-red-400`}>DISCLAIMER: TOTALLY LEGIT SOFTWARE 🤡</div>
          <div className={`${chaosClass('animate-float-diagonal')} text-green-400`}>DOWNLOAD NOW FOR INSTANT PRO STATUS! 🚀💯</div>
        </footer>
      </div>
      
      {/* EVEN MORE FLOATING CHAOS - Only in chaos mode */}
      {chaosMode && (
        <>
          <div className="fixed top-5 left-1/2 z-40 animate-fly-around" style={{fontSize: '20px'}}>🎪</div>
          <div className="fixed bottom-5 left-1/3 z-40 animate-rainbow-spin" style={{fontSize: '24px'}}>🎭</div>
          <div className="fixed top-2/3 right-1/4 z-40 animate-wobble-crazy" style={{fontSize: '18px'}}>🎨</div>
        </>
      )}
      
    </div>
    </TutorialProvider>
  )
}

export default App
