"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"

export default function Home() {
  return (
    <SessionProvider>
      <MainContent />
    </SessionProvider>
  )
}

function MainContent() {
  const { data: session, status } = useSession()
  const [pinInput, setPinInput] = useState("")
  const [scanData, setScanData] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Mock data for testing (replace with real database later)
  const mockScans: any = {
    "123456": {
      pin: "123456",
      timestamp: "2026-02-28 15:30:22",
      user: "testuser",
      folders: {
        "_ac": [
          "20260226174830_Amcache_DeviceContainer.csv",
          "20260226174830_Amcache_DevicePnps.csv",
          "20250226174830_Amcache_DriveBinaries.csv",
          "20260226174830_Amcache_DriverPackages.csv",
          "20180226174830_Amcache_ShortCuts.csv",
          "20260226174830_Amcache_Unassociated.csv"
        ],
        "_mj": ["usn_C.csv (55,256 KB)"],
        "_pj": ["prefetch.json (5,267 KB)"],
        "_sc": [
          "ISBECmd_Messages.txt",
          "found_NTUSER.csv",
          "found_UsrClass.csv"
        ],
        "_shc": ["results.csv (59 KB)"],
        "_sru": [
          "20260226224831_SrumECmd_AppResourceUseInfo.csv",
          "20260226224831_SrumECmd_AppTimeline.csv",
          "20260222248831_SrumECmd_EnergyUsage.csv",
          "20260226224831_SrumECmd_NetworkConnectivity.csv",
          "20260222248831_SrumECmd_NetworkUsage.csv",
          "20260226224831_SrumECmd_PushNotification.csv",
          "20260222248831_SrumECmd_vfuprov_Out.csv",
          "SRU.chk",
          "SRU.log",
          "SRUDB_temp.jfm",
          "SRUres00001.jrs",
          "SRUres00002.jrs",
          "SREtmp.log"
        ]
      },
      summary: {
        totalFiles: 29,
        acFiles: 6,
        mjFiles: 1,
        pjFiles: 1,
        scFiles: 3,
        shcFiles: 1,
        sruFiles: 13
      }
    },
    "654321": {
      pin: "654321",
      timestamp: "2026-02-27 09:12:45",
      user: "anotheruser",
      folders: {
        "_ac": ["Amcache_data1.csv", "Amcache_data2.csv"],
        "_mj": ["usn_C.csv"],
        "_pj": ["prefetch.json"],
        "_sc": ["found_NTUSER.csv"],
        "_shc": ["results.csv"],
        "_sru": ["SRUdata1.csv", "SRU.log"]
      },
      summary: {
        totalFiles: 8,
        acFiles: 2,
        mjFiles: 1,
        pjFiles: 1,
        scFiles: 1,
        shcFiles: 1,
        sruFiles: 2
      }
    }
  }

  const handleSubmitPin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Simulate API call
    setTimeout(() => {
      if (mockScans[pinInput]) {
        setScanData(mockScans[pinInput])
        setError("")
      } else {
        setError("Invalid PIN or scan not found")
        setScanData(null)
      }
      setLoading(false)
    }, 500)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">LOADING...</div>
          <div className="border border-green-500 p-4">CIVSCAN v1.0</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono">
        <div className="max-w-md mx-auto pt-20">
          <div className="border border-green-500 p-8 text-center">
            <h1 className="text-3xl mb-6">🔍 CIVSCAN</h1>
            <p className="mb-8">Forensic Analysis Dashboard</p>
            <button 
              onClick={() => signIn("discord")}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded font-bold transition"
            >
              Login with Discord
            </button>
            <div className="mt-6 text-xs text-gray-500">
              Authenticate to view your scan results
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="border border-green-500 p-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">🔍 CIVSCAN</h1>
            <p className="text-sm text-gray-500">Logged in as: {session.user?.name}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="border border-red-500 text-red-500 px-4 py-2 hover:bg-red-950 transition"
          >
            Logout
          </button>
        </div>

        {/* PIN Entry */}
        <div className="border border-blue-500 p-6 mb-6">
          <h2 className="text-xl mb-4">ENTER SCAN PIN</h2>
          <form onSubmit={handleSubmitPin} className="flex gap-2">
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="6-digit PIN"
              className="bg-black border border-green-500 text-green-400 px-4 py-3 flex-1 text-lg"
              maxLength={6}
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-green-900 hover:bg-green-800 px-6 py-3 disabled:opacity-50"
            >
              {loading ? "..." : "VIEW"}
            </button>
          </form>
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>

        {/* Scan Results */}
        {scanData && (
          <div className="border border-yellow-500 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">📊 SCAN RESULTS - PIN: {scanData.pin}</h2>
              <div className="text-sm text-gray-500">{scanData.timestamp}</div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_ac</div>
                <div className="text-lg">{scanData.summary.acFiles}</div>
              </div>
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_mj</div>
                <div className="text-lg">{scanData.summary.mjFiles}</div>
              </div>
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_pj</div>
                <div className="text-lg">{scanData.summary.pjFiles}</div>
              </div>
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_sc</div>
                <div className="text-lg">{scanData.summary.scFiles}</div>
              </div>
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_shc</div>
                <div className="text-lg">{scanData.summary.shcFiles}</div>
              </div>
              <div className="border border-green-500 p-2 text-center">
                <div className="text-xs">_sru</div>
                <div className="text-lg">{scanData.summary.sruFiles}</div>
              </div>
              <div className="border border-purple-500 p-2 text-center bg-purple-950">
                <div className="text-xs">TOTAL</div>
                <div className="text-lg">{scanData.summary.totalFiles}</div>
              </div>
            </div>

            {/* Folder Contents */}
            <div className="grid grid-cols-2 gap-4">
              {/* _ac folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _ac (Amcache)</h3>
                <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
                  {scanData.folders._ac.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>

              {/* _mj folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _mj (AppCompat)</h3>
                <div className="text-sm space-y-1">
                  {scanData.folders._mj.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>

              {/* _pj folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _pj (Prefetch)</h3>
                <div className="text-sm space-y-1">
                  {scanData.folders._pj.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>

              {/* _sc folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _sc (MFT)</h3>
                <div className="text-sm space-y-1">
                  {scanData.folders._sc.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>

              {/* _shc folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _shc (Prefetch)</h3>
                <div className="text-sm space-y-1">
                  {scanData.folders._shc.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>

              {/* _sru folder */}
              <div className="border border-green-500 p-4">
                <h3 className="text-lg mb-2 text-green-300">📁 _sru (SRUM) - 13 files</h3>
                <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
                  {scanData.folders._sru.map((file: string, i: number) => (
                    <div key={i} className="border-b border-green-900 py-1">{file}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}