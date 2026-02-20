export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md space-y-6">
        <div className="text-6xl">📱</div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          You're Offline
        </h1>
        <div className="space-y-3">
          <p className="text-xl text-gray-700">
            Zignuts Blog works offline!
          </p>
          <p className="text-lg text-gray-600">
            Cached posts, images, and content are available instantly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl mb-1">🖼️</div>
            <div className="font-semibold">Supabase Images</div>
            <div className="text-sm text-green-600">Cached</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-semibold">Blog Posts</div>
            <div className="text-sm text-green-600">Cached</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold">Fast Load</div>
            <div className="text-sm text-green-600">Ready</div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          🔄 Connect to internet for latest updates
        </p>
      </div>
    </main>
  );
}
